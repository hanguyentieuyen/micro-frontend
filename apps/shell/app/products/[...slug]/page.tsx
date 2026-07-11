import { RemoteRoutePage } from '../../../components/remote-route-page';

type CatchAllParams = {
  slug?: string[];
};

type RouteSearchParams = Record<string, string | string[] | undefined>;

type ProductsNestedPageProps = {
  params: CatchAllParams | Promise<CatchAllParams>;
  searchParams?: Promise<RouteSearchParams>;
};

export default async function ProductsNestedPage({ params, searchParams }: ProductsNestedPageProps) {
  const { slug = [] } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <RemoteRoutePage remoteId="products" segments={slug} searchParams={resolvedSearchParams} />;
}