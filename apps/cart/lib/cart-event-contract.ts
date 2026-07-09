import {
  MICRO_APP_EVENTS,
  SHELL_MESSAGES,
  type MicroAppEventMap,
  type ShellMessageMap,
} from '@commerce/shared-types';

export const cartItemAddedEventName = MICRO_APP_EVENTS['cart:item-added'];

export type IncomingCartItemAddedPayload = MicroAppEventMap[typeof cartItemAddedEventName];

export const shellCartStateSyncMessageName = SHELL_MESSAGES['shell:cart-state-sync'];

export type IncomingCartStateSyncPayload = ShellMessageMap[typeof shellCartStateSyncMessageName];

export const sampleIncomingCartItemAddedPayload: IncomingCartItemAddedPayload = {
  productId: 'p-canvas-weekender',
  quantity: 1,
};