import type { CartItem, Product } from '@commerce/shared-types';

export const mockCartProducts: Product[] = [
  {
    id: 'p-hf-rift-runner-01',
    name: 'HF Rift Runner 01',
    price: 220,
    category: 'Low profile',
    rating: 4.9,
  },
  {
    id: 'p-hf-bricklane-high',
    name: 'HF Bricklane High',
    price: 265,
    category: 'High-top drop',
    rating: 4.8,
  },
  {
    id: 'p-hf-noise-trail',
    name: 'HF Noise Trail',
    price: 248,
    category: 'Trail unit',
    rating: 4.9,
  },
  {
    id: 'p-hf-gridshock-90',
    name: 'HF Gridshock 90',
    price: 195,
    category: 'Street core',
    rating: 4.7,
  },
];

export const mockCartItems: CartItem[] = [
  { productId: 'p-hf-rift-runner-01', quantity: 1 },
  { productId: 'p-hf-bricklane-high', quantity: 1 },
  { productId: 'p-hf-noise-trail', quantity: 2 },
];
