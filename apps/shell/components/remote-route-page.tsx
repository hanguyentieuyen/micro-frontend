import { Badge, Card, CardHeader, SectionHeading, buttonVariants } from '@commerce/shared-ui';

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
    <div className="space-y-6">
      <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <CardHeader className="space-y-5">
          <SectionHeading
            eyebrow="Embedded runtime"
            title={`${remote.label} stays independently runnable while still mounting inside the shared buyer shell.`}
            description={`${remote.description} The host route ${shellRoute} keeps navigation, shared context, and recovery UI outside the remote while the domain continues to own its own runtime surface.`}
          />

          <div className="flex flex-wrap gap-2.5">
            <Badge variant="subtle">Shell route {shellRoute}</Badge>
            <Badge variant="subtle">Remote path {nestedPathLabel}</Badge>
            <Badge variant="info">{remote.framework}</Badge>
          </div>

          {remoteId === 'cart' ? (
            <p className="text-sm leading-7 text-muted-foreground">
              Need to verify resilience? Open{' '}
              <Link href={cartOutageHref} className="font-medium text-sky-700 underline underline-offset-4">
                {cartOutageHref}
              </Link>{' '}
              to simulate a cart outage while keeping the shell usable.
            </p>
          ) : null}

          {remote.nestedExamplePath ? (
            <p className="text-sm leading-7 text-muted-foreground">
              Deep linking still lands inside the correct remote boundary:{' '}
              <Link
                href={remote.nestedExamplePath}
                className="font-medium text-sky-700 underline underline-offset-4"
              >
                {remote.nestedExamplePath}
              </Link>
            </p>
          ) : null}
        </CardHeader>
      </Card>

      <RemoteErrorBoundary remoteLabel={remote.label} resetKey={`${remoteRoute}-${simulationMode ?? 'healthy'}`}>
        <RemoteSurface
          remoteId={remoteId}
          title={`${remote.label} runtime surface`}
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

