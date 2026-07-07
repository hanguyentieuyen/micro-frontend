import { RemoteRoutePage } from '../../../components/remote-route-page';

type CatchAllParams = {
  slug?: string[];
};

type ProductsNestedPageProps = {
  params: CatchAllParams | Promise<CatchAllParams>;
};

export default async function ProductsNestedPage({ params }: ProductsNestedPageProps) {
  const { slug = [] } = await params;

  return <RemoteRoutePage remoteId="products" segments={slug} />;
}