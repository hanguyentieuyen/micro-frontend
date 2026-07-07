export type RemoteAppId = 'products' | 'cart' | 'profile';

type RemoteAppDefinition = {
  id: RemoteAppId;
  label: string;
  framework: 'Next.js' | 'Nuxt 3';
  shellPath: `/${RemoteAppId}`;
  standaloneOrigin: string;
  description: string;
  devCommand: string;
  nestedExamplePath?: string;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function getRemoteOrigin(envName: string, fallback: string) {
  return trimTrailingSlash(process.env[envName] ?? fallback);
}

export const REMOTE_APPS: Record<RemoteAppId, RemoteAppDefinition> = {
  products: {
    id: 'products',
    label: 'Products',
    framework: 'Next.js',
    shellPath: '/products',
    standaloneOrigin: getRemoteOrigin('NEXT_PUBLIC_PRODUCTS_REMOTE_ORIGIN', 'http://127.0.0.1:3001'),
    description: 'Catalog discovery stays inside the products domain while the shell keeps the surrounding portal layout.',
    devCommand: 'npm run dev:products',
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    framework: 'Next.js',
    shellPath: '/cart',
    standaloneOrigin: getRemoteOrigin('NEXT_PUBLIC_CART_REMOTE_ORIGIN', 'http://127.0.0.1:3002'),
    description: 'Cart remains independently runnable and focused on basket state, line items, and checkout summary.',
    devCommand: 'npm run dev:cart',
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    framework: 'Nuxt 3',
    shellPath: '/profile',
    standaloneOrigin: getRemoteOrigin('NEXT_PUBLIC_PROFILE_REMOTE_ORIGIN', 'http://127.0.0.1:3003'),
    description: 'The Nuxt profile remote proves the shell can compose a different frontend framework at runtime.',
    devCommand: 'npm run dev:profile',
    nestedExamplePath: '/profile/security',
  },
};

export function getRemoteApp(remoteId: RemoteAppId) {
  return REMOTE_APPS[remoteId];
}

export function buildShellRoute(remoteId: RemoteAppId, segments: readonly string[] = []) {
  const remote = getRemoteApp(remoteId);
  return segments.length === 0 ? remote.shellPath : `${remote.shellPath}/${segments.join('/')}`;
}

export function buildRemoteRoute(remoteId: RemoteAppId, segments: readonly string[] = []) {
  const remote = getRemoteApp(remoteId);
  return segments.length === 0 ? remote.standaloneOrigin : `${remote.standaloneOrigin}/${segments.join('/')}`;
}