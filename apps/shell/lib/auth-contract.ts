import { MICRO_APP_EVENTS, type MicroAppEventMap, type User } from '@commerce/shared-types';

export const authUserChangedEventName = MICRO_APP_EVENTS['auth:user-changed'];

export type AuthUserChangedContract = MicroAppEventMap[typeof authUserChangedEventName];

export const mockShellUser: User = {
  id: 'u-hf-drop-09',
  name: 'Mina Corvin',
  email: 'mina@hf-run.club',
  role: 'admin',
};

export function buildAuthUserChangedPayload(user: Pick<User, 'id'>): AuthUserChangedContract {
  return {
    userId: user.id,
  };
}

export const authUserChangedPreview = buildAuthUserChangedPayload(mockShellUser);
