import { RemoteRoutePage } from '../../components/remote-route-page';

type RouteSearchParams = Record<string, string | string[] | undefined>;

type ProfilePageProps = {
  searchParams?: Promise<RouteSearchParams>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <RemoteRoutePage remoteId="profile" searchParams={resolvedSearchParams} />;
}