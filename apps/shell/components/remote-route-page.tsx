import Link from 'next/link';

import { buildRemoteRoute, buildShellRoute, getRemoteApp, type RemoteAppId } from '../lib/remotes';
import { RemoteErrorBoundary } from './remote-error-boundary';
import { RemoteSurface } from './remote-surface';

type RouteSearchParams = Record<string, string | string[] | undefined>;

type RemoteRoutePageProps = {
  remoteId: RemoteAppId;
  segments?: string[];
  searchParams?: RouteSearchParams;
};

export function RemoteRoutePage({ remoteId, segments = [], searchParams = {} }: RemoteRoutePageProps) {
  const remote = getRemoteApp(remoteId);
  const shellRoute = buildShellRoute(remoteId, segments);
  const remoteRoute = buildRemoteRoute(remoteId, segments);
  const nestedPathLabel = segments.length === 0 ? '/' : `/${segments.join('/')}`;
  const cartOutageHref = `${shellRoute}?simulate=cart-outage`;
  const simulationMode = typeof searchParams.simulate === 'string' ? searchParams.simulate : undefined;

  return (
    <div className="stack-xl">
      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Week 3 / Days 19-21</p>
        <h2>{remote.label} is now mounted with lazy load, typed sync, fallback drills, and clearer boundaries.</h2>
        <p className="ui-copy">
          {remote.description} The shell route <code>{shellRoute}</code> keeps host navigation outside the remote while adding four production-minded layers: typed event contracts, deferred loading, outage simulation, and shell-side resilience.
        </p>

        <div className="remote-facts">
          <span className="remote-pill">Shell route {shellRoute}</span>
          <span className="remote-pill">Remote path {nestedPathLabel}</span>
          <span className="remote-pill">Framework {remote.framework}</span>
        </div>

        {remoteId === 'cart' ? (
          <p className="ui-copy remote-inline-copy">
            Day 19 drill: <Link href={cartOutageHref}>{cartOutageHref}</Link> simulates a cart remote outage so you can confirm the host fallback without stopping servers manually.
          </p>
        ) : null}

        {remote.nestedExamplePath ? (
          <p className="ui-copy remote-inline-copy">
            Deep link still works through the host: <Link href={remote.nestedExamplePath}>{remote.nestedExamplePath}</Link>
          </p>
        ) : null}
      </section>

      <RemoteErrorBoundary remoteLabel={remote.label} resetKey={`${remoteRoute}-${simulationMode ?? 'healthy'}`}>
        <RemoteSurface
          remoteId={remoteId}
          title={`${remote.label} remote`}
          description={remote.description}
          framework={remote.framework}
          origin={remote.standaloneOrigin}
          routeLabel={`Remote path ${nestedPathLabel}`}
          src={remoteRoute}
          devCommand={remote.devCommand}
          simulationMode={simulationMode}
          recoveryHref={shellRoute}
        />
      </RemoteErrorBoundary>
    </div>
  );
}