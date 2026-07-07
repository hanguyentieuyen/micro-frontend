import { RemoteRoutePage } from '../../../components/remote-route-page';

type CatchAllParams = {
  slug?: string[];
};

type CartNestedPageProps = {
  params: CatchAllParams | Promise<CatchAllParams>;
};

export default async function CartNestedPage({ params }: CartNestedPageProps) {
  const { slug = [] } = await params;

  return <RemoteRoutePage remoteId="cart" segments={slug} />;
}