import { RoutePlaceholder } from '../../components/route-placeholder';

export default function ProductsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Remote placeholder"
      title="Products route"
      description="This route will host the products remote once the domain app is created."
      checklist={[
        'Create the products app in the monorepo.',
        'Expose a stable entrypoint for runtime composition.',
        'Render product catalog UI inside this route.',
      ]}
    />
  );
}
