import { RemoteRoutePage } from '../../../components/remote-route-page';

type CatchAllParams = {
  slug?: string[];
};

type RouteSearchParams = Record<string, string | string[] | undefined>;

type ProfileNestedPageProps = {
  params: CatchAllParams | Promise<CatchAllParams>;
  searchParams?: Promise<RouteSearchParams>;
};

export default async function ProfileNestedPage({ params, searchParams }: ProfileNestedPageProps) {
  const { slug = [] } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <RemoteRoutePage remoteId="profile" segments={slug} searchParams={resolvedSearchParams} />;
}