import {
  MICRO_APP_EVENT_ENVELOPE_KIND,
  type MicroAppEventEnvelope,
} from '@commerce/shared-types';

import {
  cartItemAddedEventName,
  type PreparedCartItemAddedPayload,
} from './cart-event-contract';

export function isEmbeddedInShell() {
  return typeof window !== 'undefined' && window.parent !== window;
}

function getParentOrigin() {
  if (typeof document === 'undefined' || !document.referrer) {
    return '*';
  }

  try {
    return new URL(document.referrer).origin;
  } catch {
    return '*';
  }
}

export function emitCartItemAddedToShell(
  payload: PreparedCartItemAddedPayload,
): MicroAppEventEnvelope<typeof cartItemAddedEventName> {
  const envelope: MicroAppEventEnvelope<typeof cartItemAddedEventName> = {
    kind: MICRO_APP_EVENT_ENVELOPE_KIND,
    sourceApp: 'products',
    eventName: cartItemAddedEventName,
    payload,
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(cartItemAddedEventName, {
      detail: payload,
    }));

    if (isEmbeddedInShell()) {
      window.parent.postMessage(envelope, getParentOrigin());
    }
  }

  return envelope;
}