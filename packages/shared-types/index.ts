export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartItemAddedPayload {
  productId: string;
  quantity: number;
}

export interface AuthUserChangedPayload {
  userId: string;
}

export interface MicroAppEventMap {
  'cart:item-added': CartItemAddedPayload;
  'auth:user-changed': AuthUserChangedPayload;
}

export type MicroAppEventName = keyof MicroAppEventMap;

export const MICRO_APP_EVENTS: { [K in MicroAppEventName]: K } = {
  'cart:item-added': 'cart:item-added',
  'auth:user-changed': 'auth:user-changed',
};

export type MicroAppSourceApp = 'shell' | 'products' | 'cart' | 'profile';

export const MICRO_APP_EVENT_ENVELOPE_KIND = 'micro-app:event';

export interface MicroAppEventEnvelope<K extends MicroAppEventName = MicroAppEventName> {
  kind: typeof MICRO_APP_EVENT_ENVELOPE_KIND;
  sourceApp: MicroAppSourceApp;
  eventName: K;
  payload: MicroAppEventMap[K];
}

export interface CartStateSnapshot {
  items: CartItem[];
  totalQuantity: number;
  updatedAt: string;
}

export interface ShellMessageMap {
  'shell:cart-state-sync': CartStateSnapshot;
}

export type ShellMessageName = keyof ShellMessageMap;

export const SHELL_MESSAGES: { [K in ShellMessageName]: K } = {
  'shell:cart-state-sync': 'shell:cart-state-sync',
};

export const SHELL_MESSAGE_KIND = 'shell:message';

export interface ShellMessageEnvelope<K extends ShellMessageName = ShellMessageName> {
  kind: typeof SHELL_MESSAGE_KIND;
  messageName: K;
  payload: ShellMessageMap[K];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isMicroAppEventEnvelope(value: unknown): value is MicroAppEventEnvelope {
  if (!isRecord(value)) {
    return false;
  }

  return value.kind === MICRO_APP_EVENT_ENVELOPE_KIND
    && typeof value.sourceApp === 'string'
    && typeof value.eventName === 'string'
    && 'payload' in value;
}

export function isShellMessageEnvelope(value: unknown): value is ShellMessageEnvelope {
  if (!isRecord(value)) {
    return false;
  }

  return value.kind === SHELL_MESSAGE_KIND
    && typeof value.messageName === 'string'
    && 'payload' in value;
}