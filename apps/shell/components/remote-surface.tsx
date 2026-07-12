'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, buttonVariants, cn } from '@commerce/shared-ui';
import type { CartStateSnapshot } from '@commerce/shared-types';

import { useEffect, useRef, useState } from 'react';

import { authUserChangedPreview } from '../lib/auth-contract';
import type { RemoteAppId } from '../lib/remotes';
import {
  buildShellAuthEventEnvelope,
  buildShellCartStateSyncEnvelope,
  postMessageToFrame,
  readCartState,
  SHELL_CART_STATE_CHANGED_EVENT,
} from '../lib/runtime-bridge';

type RemoteSurfaceProps = {
  remoteId: RemoteAppId;
  title: string;
  description: string;
  framework: string;
  origin: string;
  routeLabel: string;
  src: string;
  devCommand: string;
  simulationMode?: string;
  recoveryHref: string;
};

const CART_OUTAGE_SIMULATION_ORIGIN = 'http://localhost:3998';
const CART_OUTAGE_SIMULATION = 'cart-outage';

export function RemoteSurface({
  remoteId,
  title,
  description,
  framework,
  origin,
  routeLabel,
  src,
  devCommand,
  simulationMode,
  recoveryHref,
}: RemoteSurfaceProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const isSimulatedCartOutage = remoteId === 'cart' && simulationMode === CART_OUTAGE_SIMULATION;
  const activeOrigin = isSimulatedCartOutage ? CART_OUTAGE_SIMULATION_ORIGIN : origin;
  const activeSrc = isSimulatedCartOutage
    ? `${CART_OUTAGE_SIMULATION_ORIGIN}/__simulated-cart-outage__`
    : src;

  useEffect(() => {
    setShouldLoad(false);
    setIsLoaded(false);
    setHasTimedOut(false);
  }, [activeSrc]);

  useEffect(() => {
    const node = surfaceRef.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '160px 0px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [activeSrc, retryKey]);

  function postAuthSync() {
    if (!frameRef.current?.contentWindow) {
      return;
    }

    postMessageToFrame(
      frameRef.current.contentWindow,
      buildShellAuthEventEnvelope(authUserChangedPreview),
      activeOrigin,
    );
  }

  function postCartStateSync(snapshot?: CartStateSnapshot) {
    if (remoteId !== 'cart' || !frameRef.current?.contentWindow) {
      return;
    }

    const payload = snapshot ?? readCartState();

    postMessageToFrame(
      frameRef.current.contentWindow,
      buildShellCartStateSyncEnvelope(payload),
      activeOrigin,
    );
  }

  function postBootstrapMessages(snapshot?: CartStateSnapshot) {
    postAuthSync();
    postCartStateSync(snapshot);
  }

  useEffect(() => {
    if (!shouldLoad || isLoaded) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHasTimedOut(true);
      console.error('[shell] remote surface timed out before load', {
        remoteId,
        src: activeSrc,
        activeOrigin,
        simulatedFailure: isSimulatedCartOutage,
      });
    }, 6000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeOrigin, activeSrc, isLoaded, isSimulatedCartOutage, remoteId, shouldLoad, retryKey]);

  useEffect(() => {
    if (remoteId !== 'cart') {
      return;
    }

    function handleCartStateChanged(event: Event) {
      if (!isLoaded) {
        return;
      }

      const customEvent = event as CustomEvent<CartStateSnapshot>;
      postCartStateSync(customEvent.detail);
    }

    window.addEventListener(
      SHELL_CART_STATE_CHANGED_EVENT,
      handleCartStateChanged as EventListener,
    );

    return () => {
      window.removeEventListener(
        SHELL_CART_STATE_CHANGED_EVENT,
        handleCartStateChanged as EventListener,
      );
    };
  }, [activeOrigin, isLoaded, remoteId]);

  function handleRetry() {
    setHasTimedOut(false);
    setIsLoaded(false);
    setShouldLoad(true);
    setRetryKey((value) => value + 1);
  }

  function handleFrameLoad() {
    setIsLoaded(true);
    setHasTimedOut(false);
    postBootstrapMessages();
    window.setTimeout(() => {
      postBootstrapMessages();
    }, 220);
  }

  const loadStatus = hasTimedOut
    ? 'Fallback active'
    : isLoaded
      ? 'Ready'
      : shouldLoad
        ? 'Loading'
        : 'Waiting to lazy load';

  const fallbackTitle = isSimulatedCartOutage
    ? 'The cart outage is intentionally simulated and the shell is still usable.'
    : 'The shell stayed alive even though this remote did not respond in time.';

  const fallbackCopy = isSimulatedCartOutage
    ? 'This drill proves the buyer shell can keep working while the cart remote is unavailable. Remove the simulation from the URL or open the healthy standalone app to recover.'
    : `Retry the surface, open the standalone app directly, or keep using another route in the shell. If you are running locally, confirm ${devCommand} is healthy.`;

  return (
    <Card
      ref={surfaceRef}
      className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    >
      <CardHeader className="space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
              Runtime composition surface
            </p>
            <CardTitle>{title}</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a className={buttonVariants({ variant: 'outline' })} href={origin} target="_blank" rel="noreferrer">
              Open standalone app
            </a>
            <a className={buttonVariants({ variant: 'dark' })} href={activeSrc} target="_blank" rel="noreferrer">
              Open current route
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Badge variant="subtle">{framework}</Badge>
          <Badge variant="subtle">{routeLabel}</Badge>
          <Badge variant="subtle">Healthy origin {origin}</Badge>
          {isSimulatedCartOutage ? <Badge variant="outline" className="border-rose-500/20 bg-rose-500/10 text-rose-700">Simulated outage {activeOrigin}</Badge> : null}
          <Badge
            variant="outline"
            className={cn(
              hasTimedOut
                ? 'border-amber-500/24 bg-amber-500/10 text-amber-700'
                : isLoaded
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                  : 'border-border bg-background text-muted-foreground',
            )}
          >
            {loadStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative min-h-[960px] overflow-hidden rounded-[1.5rem] border border-border/80 bg-background/70">
          {!shouldLoad ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,245,249,0.96))] px-6 text-center">
              <div className="max-w-2xl space-y-4">
                <div className="space-y-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
                    Deferred loading
                  </p>
                  <h4 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    The remote request waits until this surface is close to the viewport.
                  </h4>
                </div>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  The shell keeps initial route work lighter by delaying the iframe request until
                  this panel is likely to be seen, or until you choose to load it manually.
                </p>
                <Button variant="dark" onClick={() => setShouldLoad(true)}>
                  Load remote now
                </Button>
              </div>
            </div>
          ) : null}

          {shouldLoad && !isLoaded && !hasTimedOut ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(241,245,249,0.94))] px-6 text-center text-sm text-muted-foreground">
              Loading remote app from its own runtime origin...
            </div>
          ) : null}

          {shouldLoad && hasTimedOut && !isLoaded ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,245,249,0.96))] px-6 text-center">
              <div className="max-w-2xl space-y-4">
                <div className="space-y-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-600">
                    Remote fallback
                  </p>
                  <h4 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {fallbackTitle}
                  </h4>
                </div>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">{fallbackCopy}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="dark" onClick={handleRetry}>
                    Retry remote load
                  </Button>
                  {isSimulatedCartOutage ? (
                    <a className={buttonVariants({ variant: 'outline' })} href={recoveryHref}>
                      Return to healthy route
                    </a>
                  ) : null}
                  <a className={buttonVariants({ variant: 'outline' })} href={origin} target="_blank" rel="noreferrer">
                    Open standalone app
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {shouldLoad ? (
            <iframe
              ref={frameRef}
              key={`${retryKey}-${activeSrc}`}
              title={title}
              src={activeSrc}
              loading="lazy"
              className={
                isLoaded
                  ? 'block min-h-[960px] w-full border-0 bg-transparent opacity-100 transition-opacity duration-300'
                  : 'block min-h-[960px] w-full border-0 bg-transparent opacity-0 transition-opacity duration-300'
              }
              onLoad={handleFrameLoad}
            />
          ) : null}
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          Lazy mount defers the iframe request until this surface is near the viewport or until you
          trigger it manually. If the remote stays unavailable, the shell keeps working and shows a
          recovery path instead of collapsing.
        </p>
      </CardContent>
    </Card>
  );
}


