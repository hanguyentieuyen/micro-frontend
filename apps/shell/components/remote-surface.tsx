'use client';

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
};

export function RemoteSurface({
  remoteId,
  title,
  description,
  framework,
  origin,
  routeLabel,
  src,
  devCommand,
}: RemoteSurfaceProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const surfaceRef = useRef<HTMLElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setShouldLoad(false);
    setIsLoaded(false);
    setHasTimedOut(false);
  }, [src]);

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
  }, [src, retryKey]);

  function postAuthSync() {
    if (!frameRef.current?.contentWindow) {
      return;
    }

    postMessageToFrame(
      frameRef.current.contentWindow,
      buildShellAuthEventEnvelope(authUserChangedPreview),
      origin,
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
      origin,
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
        src,
      });
    }, 6000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoaded, remoteId, shouldLoad, src, retryKey]);

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
  }, [isLoaded, origin, remoteId]);

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

  return (
    <section ref={surfaceRef} className="ui-section remote-surface ui-stack-md">
      <div className="remote-toolbar">
        <div className="ui-stack-sm">
          <p className="ui-eyebrow">Runtime composition surface</p>
          <h3>{title}</h3>
          <p className="ui-copy">{description}</p>
        </div>

        <div className="remote-actions">
          <a className="ui-button ui-button--ghost" href={origin} target="_blank" rel="noreferrer">
            Open standalone app
          </a>
          <a className="ui-button ui-button--primary" href={src} target="_blank" rel="noreferrer">
            Open current remote route
          </a>
        </div>
      </div>

      <div className="remote-facts">
        <span className="remote-pill">{framework}</span>
        <span className="remote-pill">{routeLabel}</span>
        <span className="remote-pill">{origin}</span>
        <span className={hasTimedOut ? 'remote-pill remote-pill--warning' : isLoaded ? 'remote-pill remote-pill--success' : 'remote-pill'}>
          {loadStatus}
        </span>
      </div>

      <div className="remote-frame-shell">
        {!shouldLoad ? (
          <div className="remote-frame-shell__placeholder ui-stack-md">
            <div>
              <p className="ui-eyebrow">Day 17 / Lazy loading</p>
              <h4>Remote request is deferred until this surface is near the viewport.</h4>
            </div>
            <p className="ui-copy">
              Before Day 17, the iframe requested the remote immediately on route render. Now the host waits until this panel is about to be seen, or until you trigger it manually.
            </p>
            <button type="button" className="ui-button ui-button--primary" onClick={() => setShouldLoad(true)}>
              Load remote now
            </button>
          </div>
        ) : null}

        {shouldLoad && !isLoaded && !hasTimedOut ? (
          <div className="remote-frame-shell__loading">
            <p>Loading remote app from its own runtime origin...</p>
          </div>
        ) : null}

        {shouldLoad && hasTimedOut && !isLoaded ? (
          <div className="remote-frame-shell__fallback ui-stack-md">
            <div>
              <p className="ui-eyebrow">Day 18 / Fallback UI</p>
              <h4>The shell stayed alive even though this remote did not respond in time.</h4>
            </div>
            <p className="ui-copy">
              Retry the surface, open the standalone app directly, or continue using another route in the shell. This is the resilience boundary for a failing remote.
            </p>
            <div className="remote-frame-shell__actions">
              <button type="button" className="ui-button ui-button--primary" onClick={handleRetry}>
                Retry remote load
              </button>
              <a className="ui-button ui-button--ghost" href={origin} target="_blank" rel="noreferrer">
                Open standalone app
              </a>
            </div>
          </div>
        ) : null}

        {shouldLoad ? (
          <iframe
            ref={frameRef}
            key={`${retryKey}-${src}`}
            title={title}
            src={src}
            loading="lazy"
            className={isLoaded ? 'remote-frame remote-frame--visible' : 'remote-frame'}
            onLoad={handleFrameLoad}
          />
        ) : null}
      </div>

      <p className="remote-helper">
        Lazy mount defers the iframe request until this surface is near the viewport or until you click the manual load button. If the remote stays unavailable, the shell keeps working and shows a retry path instead of crashing.
      </p>
    </section>
  );
}