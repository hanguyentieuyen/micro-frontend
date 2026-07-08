import { MICRO_APP_EVENTS, type MicroAppEventMap } from '@commerce/shared-types';

export const cartItemAddedEventName = MICRO_APP_EVENTS['cart:item-added'];

export type IncomingCartItemAddedPayload = MicroAppEventMap[typeof cartItemAddedEventName];

export const sampleIncomingCartItemAddedPayload: IncomingCartItemAddedPayload = {
  productId: 'p-canvas-weekender',
  quantity: 1,
};