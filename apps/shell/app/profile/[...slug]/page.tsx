import { RemoteRoutePage } from '../../../components/remote-route-page';

type CatchAllParams = {
  slug?: string[];
};

type ProfileNestedPageProps = {
  params: CatchAllParams | Promise<CatchAllParams>;
};

export default async function ProfileNestedPage({ params }: ProfileNestedPageProps) {
  const { slug = [] } = await params;

  return <RemoteRoutePage remoteId="profile" segments={slug} />;
}