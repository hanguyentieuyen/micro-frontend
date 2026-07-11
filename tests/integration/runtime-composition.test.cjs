const assert = require('node:assert/strict');
const path = require('node:path');

const { loadWorkspaceTsModule, projectRoot } = require('../helpers/load-workspace-ts-module.cjs');
const { runChecks } = require('../helpers/run-checks.cjs');

const sharedTypes = loadWorkspaceTsModule(path.join(projectRoot, 'packages/shared-types/index.ts'));
const shellRemotes = loadWorkspaceTsModule(path.join(projectRoot, 'apps/shell/lib/remotes.ts'));
const shellRuntimeBridge = loadWorkspaceTsModule(path.join(projectRoot, 'apps/shell/lib/runtime-bridge.ts'));
const productsContracts = loadWorkspaceTsModule(path.join(projectRoot, 'apps/products/lib/cart-event-contract.ts'));
const productsRuntimeBridge = loadWorkspaceTsModule(path.join(projectRoot, 'apps/products/lib/runtime-bridge.ts'));
const cartContracts = loadWorkspaceTsModule(path.join(projectRoot, 'apps/cart/lib/cart-event-contract.ts'));

runChecks('integration', [
  ['shared envelope guards accept valid contracts and reject malformed messages', () => {
    const validEventEnvelope = {
      kind: sharedTypes.MICRO_APP_EVENT_ENVELOPE_KIND,
      sourceApp: 'products',
      eventName: sharedTypes.MICRO_APP_EVENTS['cart:item-added'],
      payload: { productId: 'p-1', quantity: 1 },
    };

    const validShellMessage = {
      kind: sharedTypes.SHELL_MESSAGE_KIND,
      messageName: sharedTypes.SHELL_MESSAGES['shell:cart-state-sync'],
      payload: {
        items: [],
        totalQuantity: 0,
        updatedAt: '2026-07-11T00:00:00.000Z',
      },
    };

    assert.equal(sharedTypes.isMicroAppEventEnvelope(validEventEnvelope), true);
    assert.equal(sharedTypes.isMicroAppEventEnvelope({ kind: 'other' }), false);
    assert.equal(sharedTypes.isShellMessageEnvelope(validShellMessage), true);
    assert.equal(sharedTypes.isShellMessageEnvelope({ kind: 'other' }), false);
  }],
  ['products -> shell -> cart add-to-cart flow stays contract compatible', () => {
    const payload = {
      productId: 'p-canvas-weekender',
      quantity: 2,
    };

    const eventEnvelope = productsRuntimeBridge.emitCartItemAddedToShell(payload);

    assert.equal(eventEnvelope.kind, sharedTypes.MICRO_APP_EVENT_ENVELOPE_KIND);
    assert.equal(eventEnvelope.sourceApp, 'products');
    assert.equal(eventEnvelope.eventName, productsContracts.cartItemAddedEventName);
    assert.deepEqual(eventEnvelope.payload, payload);

    let cartState = shellRuntimeBridge.createEmptyCartState();
    cartState = shellRuntimeBridge.applyCartItemAdded(cartState, eventEnvelope.payload);
    cartState = shellRuntimeBridge.applyCartItemAdded(cartState, {
      productId: payload.productId,
      quantity: 1,
    });

    assert.equal(cartState.totalQuantity, 3);
    assert.equal(cartState.items.length, 1);
    assert.equal(cartState.items[0].productId, payload.productId);
    assert.equal(cartState.items[0].quantity, 3);

    const syncEnvelope = shellRuntimeBridge.buildShellCartStateSyncEnvelope(cartState);

    assert.equal(syncEnvelope.kind, sharedTypes.SHELL_MESSAGE_KIND);
    assert.equal(syncEnvelope.messageName, cartContracts.shellCartStateSyncMessageName);
    assert.deepEqual(syncEnvelope.payload.items, cartState.items);
    assert.equal(syncEnvelope.payload.totalQuantity, 3);
  }],
  ['shell route builders keep host and remote paths aligned', () => {
    assert.equal(shellRemotes.buildShellRoute('products'), '/products');
    assert.equal(shellRemotes.buildShellRoute('profile', ['security']), '/profile/security');
    assert.equal(shellRemotes.buildRemoteRoute('cart'), 'http://localhost:3002');
    assert.equal(shellRemotes.buildRemoteRoute('profile', ['security']), 'http://localhost:3003/security');
    assert.equal(shellRemotes.getRemoteApp('profile').framework, 'Nuxt 3');
  }],
  ['shell auth handoff reuses the shared event name instead of hardcoded strings', () => {
    const authEnvelope = shellRuntimeBridge.buildShellAuthEventEnvelope({ userId: 'u-01' });

    assert.equal(authEnvelope.kind, sharedTypes.MICRO_APP_EVENT_ENVELOPE_KIND);
    assert.equal(authEnvelope.sourceApp, 'shell');
    assert.equal(authEnvelope.eventName, sharedTypes.MICRO_APP_EVENTS['auth:user-changed']);
    assert.deepEqual(authEnvelope.payload, { userId: 'u-01' });
  }],
]);