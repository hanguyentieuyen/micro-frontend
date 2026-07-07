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