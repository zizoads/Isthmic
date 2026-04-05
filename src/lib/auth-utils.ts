
import { UserProfile } from '../../types';

export const MASTER_IDENTITY = 'zizoadszn@gmail.com';

export const constructBaseProfile = (id: string, email: string, name?: string): UserProfile => {
  return {
    id,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    role: email.toLowerCase() === MASTER_IDENTITY ? 'Admin' : 'User',
    createdAt: new Date().toISOString(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
  };
};
