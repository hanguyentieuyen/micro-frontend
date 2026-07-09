'use client';

import { useEffect } from 'react';

import {
  MICRO_APP_EVENTS,
  type CartItemAddedPayload,
  isMicroAppEventEnvelope,
} from '@commerce/shared-types';

import { REMOTE_APPS } from '../lib/remotes';
import { applyCartItemAdded, readCartState, writeCartState } from '../lib/runtime-bridge';

const allowedOrigins = new Set(Object.values(REMOTE_APPS).map((remote) => remote.standaloneOrigin));

export function ShellEventBridge() {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!allowedOrigins.has(event.origin)) {
        return;
      }

      if (!isMicroAppEventEnvelope(event.data)) {
        return;
      }

      if (event.data.eventName !== MICRO_APP_EVENTS['cart:item-added']) {
        return;
      }

      if (event.data.sourceApp !== 'products') {
        return;
      }

      const nextState = applyCartItemAdded(
        readCartState(),
        event.data.payload as CartItemAddedPayload,
      );
      writeCartState(nextState);
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;
}