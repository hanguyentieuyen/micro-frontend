import Link from 'next/link';

import { buildRemoteRoute, buildShellRoute, getRemoteApp, type RemoteAppId } from '../lib/remotes';
import { RemoteSurface } from './remote-surface';

type RemoteRoutePageProps = {
  remoteId: RemoteAppId;
  segments?: string[];
};

export function RemoteRoutePage({ remoteId, segments = [] }: RemoteRoutePageProps) {
  const remote = getRemoteApp(remoteId);
  const shellRoute = buildShellRoute(remoteId, segments);
  const remoteRoute = buildRemoteRoute(remoteId, segments);
  const nestedPathLabel = segments.length === 0 ? '/' : `/${segments.join('/')}`;

  return (
    <div className="stack-xl">
      <section className="ui-section ui-stack-md">
        <p className="ui-eyebrow">Week 2 / Day 14</p>
        <h2>{remote.label} now mounts at runtime inside the shell.</h2>
        <p className="ui-copy">
          {remote.description} The current shell route <code>{shellRoute}</code> forwards users into the matching remote surface without moving them away from the host app.
        </p>

        <div className="remote-facts">
          <span className="remote-pill">Shell route {shellRoute}</span>
          <span className="remote-pill">Remote path {nestedPathLabel}</span>
          <span className="remote-pill">Framework {remote.framework}</span>
        </div>

        {remote.nestedExamplePath ? (
          <p className="ui-copy remote-inline-copy">
            Cross-framework deep link ready: <Link href={remote.nestedExamplePath}>{remote.nestedExamplePath}</Link>
          </p>
        ) : null}
      </section>

      <RemoteSurface
        title={`${remote.label} remote`}
        description={remote.description}
        framework={remote.framework}
        origin={remote.standaloneOrigin}
        routeLabel={`Remote path ${nestedPathLabel}`}
        src={remoteRoute}
        devCommand={remote.devCommand}
      />
    </div>
  );
}