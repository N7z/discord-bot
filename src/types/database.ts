export interface ProfileRow {
  user_id: string;
  bio: string;
  bg_color: string;
  bg_image: string;
}

export interface UserRow {
  id: string;
  balance: number;
  bank: number;
  last_daily: string;
  last_work: number;
  starting_claimed: number;
}

export interface Profile {
  bio: string;
  bg_color: string;
  bg_image?: string;
}

export interface User extends UserRow {
  profile: Profile;
}
