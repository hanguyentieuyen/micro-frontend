import { RemoteRoutePage } from '../../components/remote-route-page';

type RouteSearchParams = Record<string, string | string[] | undefined>;

type ProductsPageProps = {
  searchParams?: Promise<RouteSearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <RemoteRoutePage remoteId="products" searchParams={resolvedSearchParams} />;
}