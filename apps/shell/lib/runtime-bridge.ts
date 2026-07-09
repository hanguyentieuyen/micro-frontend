import {
  MICRO_APP_EVENTS,
  MICRO_APP_EVENT_ENVELOPE_KIND,
  SHELL_MESSAGES,
  SHELL_MESSAGE_KIND,
  type AuthUserChangedPayload,
  type CartItem,
  type CartItemAddedPayload,
  type CartStateSnapshot,
  type MicroAppEventEnvelope,
  type ShellMessageEnvelope,
} from '@commerce/shared-types';

export const SHELL_CART_STATE_STORAGE_KEY = 'commerce-portal:cart-state';
export const SHELL_CART_STATE_CHANGED_EVENT = 'commerce-portal:cart-state-changed';

function isCartItemArray(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every((item) => {
    return typeof item === 'object'
      && item !== null
      && typeof item.productId === 'string'
      && typeof item.quantity === 'number';
  });
}

export function calculateTotalQuantity(items: readonly CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function buildCartStateSnapshot(items: readonly CartItem[]): CartStateSnapshot {
  return {
    items: items.map((item) => ({ ...item })),
    totalQuantity: calculateTotalQuantity(items),
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyCartState(): CartStateSnapshot {
  return buildCartStateSnapshot([]);
}

export function readCartState(): CartStateSnapshot {
  if (typeof window === 'undefined') {
    return createEmptyCartState();
  }

  const raw = window.sessionStorage.getItem(SHELL_CART_STATE_STORAGE_KEY);

  if (!raw) {
    return createEmptyCartState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CartStateSnapshot>;

    if (!isCartItemArray(parsed.items)) {
      return createEmptyCartState();
    }

    return {
      items: parsed.items,
      totalQuantity: typeof parsed.totalQuantity === 'number'
        ? parsed.totalQuantity
        : calculateTotalQuantity(parsed.items),
      updatedAt: typeof parsed.updatedAt === 'string'
        ? parsed.updatedAt
        : new Date().toISOString(),
    };
  } catch {
    return createEmptyCartState();
  }
}

export function writeCartState(nextState: CartStateSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(SHELL_CART_STATE_STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new CustomEvent<CartStateSnapshot>(SHELL_CART_STATE_CHANGED_EVENT, {
    detail: nextState,
  }));
}

export function applyCartItemAdded(
  currentState: CartStateSnapshot,
  payload: CartItemAddedPayload,
): CartStateSnapshot {
  const nextItems = currentState.items.map((item) => ({ ...item }));
  const existingItem = nextItems.find((item) => item.productId === payload.productId);

  if (existingItem) {
    existingItem.quantity += payload.quantity;
  } else {
    nextItems.push({
      productId: payload.productId,
      quantity: payload.quantity,
    });
  }

  return buildCartStateSnapshot(nextItems);
}

export function buildShellCartStateSyncEnvelope(
  payload: CartStateSnapshot,
): ShellMessageEnvelope<'shell:cart-state-sync'> {
  return {
    kind: SHELL_MESSAGE_KIND,
    messageName: SHELL_MESSAGES['shell:cart-state-sync'],
    payload,
  };
}

export function buildShellAuthEventEnvelope(
  payload: AuthUserChangedPayload,
): MicroAppEventEnvelope<'auth:user-changed'> {
  return {
    kind: MICRO_APP_EVENT_ENVELOPE_KIND,
    sourceApp: 'shell',
    eventName: MICRO_APP_EVENTS['auth:user-changed'],
    payload,
  };
}

export function postMessageToFrame(
  targetWindow: Window,
  data: MicroAppEventEnvelope | ShellMessageEnvelope,
  targetOrigin: string,
) {
  targetWindow.postMessage(data, targetOrigin);
}