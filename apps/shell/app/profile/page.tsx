import { RoutePlaceholder } from '../../components/route-placeholder';

export default function ProfilePage() {
  return (
    <RoutePlaceholder
      eyebrow="Remote placeholder"
      title="Profile route"
      description="This route will later load the profile remote for account-specific experiences."
      checklist={[
        'Create the profile app in the monorepo.',
        'Define shared user-related contracts.',
        'Mount profile UI here after remote integration.',
      ]}
    />
  );
}
