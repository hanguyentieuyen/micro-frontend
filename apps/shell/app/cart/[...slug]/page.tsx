import { RemoteRoutePage } from '../../../components/remote-route-page';

type CatchAllParams = {
  slug?: string[];
};

type RouteSearchParams = Record<string, string | string[] | undefined>;

type CartNestedPageProps = {
  params: CatchAllParams | Promise<CatchAllParams>;
  searchParams?: Promise<RouteSearchParams>;
};

export default async function CartNestedPage({ params, searchParams }: CartNestedPageProps) {
  const { slug = [] } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <RemoteRoutePage remoteId="cart" segments={slug} searchParams={resolvedSearchParams} />;
}