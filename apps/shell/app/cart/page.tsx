import { RemoteRoutePage } from '../../components/remote-route-page';

type RouteSearchParams = Record<string, string | string[] | undefined>;

type CartPageProps = {
  searchParams?: Promise<RouteSearchParams>;
};

export default async function CartPage({ searchParams }: CartPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <RemoteRoutePage remoteId="cart" searchParams={resolvedSearchParams} />;
}