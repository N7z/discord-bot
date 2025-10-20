import type { User } from '../types/database.ts';
import { getUserRow, createUserRow } from '../repositories/usersRepo.ts';
import { getProfileRow, createProfileRow } from '../repositories/profilesRepo.ts';

export async function getOrCreateUserWithProfile(userId: string): Promise<User> {
  let user = await getUserRow(userId);
  if (!user) {
    await createUserRow(userId);
    user = {
      id: userId,
      balance: 0,
      bank: 0,
      last_daily: '',
      last_work: 0,
      starting_claimed: 0,
    };
  }

  let profile = await getProfileRow(userId);
  if (!profile) {
    await createProfileRow(userId);
    profile = {
      user_id: userId,
      bio: '',
      bg_color: '#2c2f33',
      bg_image: '',
    };
  }

  return {
    ...user,
    profile: {
      bio: profile.bio,
      bg_color: profile.bg_color,
      bg_image: profile.bg_image,
    },
  };
}
