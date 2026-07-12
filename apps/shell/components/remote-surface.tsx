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
    ? 'The bag outage is simulated and the storefront shell is still online.'
    : 'The storefront shell stayed online even though this remote timed out.';

  const fallbackCopy = isSimulatedCartOutage
    ? 'This drill proves the host can keep navigation, bag state, and recovery controls alive while the bag remote is unavailable. Remove the simulation from the URL or open the healthy standalone app to recover.'
    : `Retry the surface, open the standalone app directly, or keep browsing another storefront route. If you are running locally, confirm ${devCommand} is healthy.`;

  return (
    <Card
      ref={surfaceRef}
      className="hf-terminal-border rounded-[0.25rem] bg-card"
    >
      <CardHeader className="space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="hf-kicker">
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

        <div className="flex flex-wrap gap-3">
          <Badge variant="subtle">{framework}</Badge>
          <Badge variant="outline">{routeLabel}</Badge>
          <Badge variant="default">Healthy origin {origin}</Badge>
          {isSimulatedCartOutage ? <Badge variant="destructive">Simulated outage {activeOrigin}</Badge> : null}
          <Badge
            variant={hasTimedOut ? 'default' : isLoaded ? 'secondary' : 'outline'}
            className={cn(hasTimedOut ? 'bg-destructive text-destructive-foreground' : '')}
          >
            {loadStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative min-h-[960px] overflow-hidden border-[4px] border-foreground bg-muted shadow-[8px_8px_0_hsl(var(--foreground))]">
          {!shouldLoad ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-background px-6 text-center">
              <div className="max-w-2xl space-y-4">
                <div className="space-y-3">
                  <p className="hf-kicker">
                    Deferred loading
                  </p>
                  <h4 className="font-[family:var(--font-display)] text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-foreground">
                    The remote request waits until this surface gets close to the viewport.
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
            <div className="absolute inset-0 z-10 grid place-items-center bg-accent px-6 text-center text-sm text-foreground">
              Loading remote module from its own runtime origin...
            </div>
          ) : null}

          {shouldLoad && hasTimedOut && !isLoaded ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-background px-6 text-center">
              <div className="max-w-2xl space-y-4">
                <div className="space-y-3">
                  <p className="inline-flex w-fit border-[3px] border-foreground bg-destructive px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-destructive-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
                    Remote fallback
                  </p>
                  <h4 className="font-[family:var(--font-display)] text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-foreground">
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
                  ? 'block min-h-[960px] w-full border-0 bg-transparent opacity-100 transition-opacity duration-150'
                  : 'block min-h-[960px] w-full border-0 bg-transparent opacity-0 transition-opacity duration-150'
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
