import type { CartItem, Product } from '@commerce/shared-types';

export const mockCartProducts: Product[] = [
  {
    id: 'p-canvas-weekender',
    name: 'Canvas Weekender',
    price: 129,
    category: 'Travel',
    rating: 4.9,
  },
  {
    id: 'p-dune-bottle',
    name: 'Dune Steel Bottle',
    price: 36,
    category: 'Accessories',
    rating: 4.8,
  },
  {
    id: 'p-sand-runner',
    name: 'Sand Runner Sneakers',
    price: 88,
    category: 'Footwear',
    rating: 4.7,
  },
];

export const mockCartItems: CartItem[] = [
  { productId: 'p-canvas-weekender', quantity: 1 },
  { productId: 'p-dune-bottle', quantity: 2 },
  { productId: 'p-sand-runner', quantity: 1 },
];
