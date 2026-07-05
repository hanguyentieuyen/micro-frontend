import { RoutePlaceholder } from '../../components/route-placeholder';

export default function CartPage() {
  return (
    <RoutePlaceholder
      eyebrow="Remote placeholder"
      title="Cart route"
      description="This route is reserved for the cart remote and later event-driven badge updates."
      checklist={[
        'Create the cart app in the monorepo.',
        'Plan the cart:item-added event contract.',
        'Mount cart UI here after remote integration.',
      ]}
    />
  );
}
