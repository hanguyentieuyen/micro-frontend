import { MICRO_APP_EVENTS, type MicroAppEventMap, type User } from '@commerce/shared-types';

export const authUserChangedEventName = MICRO_APP_EVENTS['auth:user-changed'];

export type AuthUserChangedContract = MicroAppEventMap[typeof authUserChangedEventName];

export const mockShellUser: User = {
  id: 'u-shell-01',
  name: 'Mina Carter',
  email: 'mina@commerce-portal.dev',
  role: 'customer',
};

export function buildAuthUserChangedPayload(user: Pick<User, 'id'>): AuthUserChangedContract {
  return {
    userId: user.id,
  };
}

export const authUserChangedPreview = buildAuthUserChangedPayload(mockShellUser);