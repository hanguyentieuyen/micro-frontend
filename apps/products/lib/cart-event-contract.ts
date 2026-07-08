import { MICRO_APP_EVENTS, type MicroAppEventMap, type Product } from '@commerce/shared-types';

export const cartItemAddedEventName = MICRO_APP_EVENTS['cart:item-added'];

export type PreparedCartItemAddedPayload = MicroAppEventMap[typeof cartItemAddedEventName];

export function buildCartItemAddedPayload(
  product: Pick<Product, 'id'>,
  quantity = 1,
): PreparedCartItemAddedPayload {
  return {
    productId: product.id,
    quantity,
  };
}