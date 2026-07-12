import { MICRO_APP_EVENTS, type MicroAppEventMap, type User } from '@commerce/shared-types';

export const authUserChangedEventName = MICRO_APP_EVENTS['auth:user-changed'];

export type AuthUserChangedContract = MicroAppEventMap[typeof authUserChangedEventName];

export const mockShellUser: User = {
  id: 'u-buyer-01',
  name: 'Avery Nguyen',
  email: 'avery@northgrid.io',
  role: 'admin',
};

export function buildAuthUserChangedPayload(user: Pick<User, 'id'>): AuthUserChangedContract {
  return {
    userId: user.id,
  };
}

export const authUserChangedPreview = buildAuthUserChangedPayload(mockShellUser);
