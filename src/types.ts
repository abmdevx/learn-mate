import type { Models } from "appwrite";

export type AppwriteUser = Models.User<Models.Preferences>;

export interface UserProfile extends Models.Row {
  Name: string;
  Level?: string;
  Availability?: string;
  Timezone?: string;
  Topics?: string[];
  Bio?: string;
  Avatar?: string;
  Status?: "online" | "offline" | string;
}

export interface MatchDocument extends Models.Row {
  UserId?: string;
  Level?: string;
  MatchedUsers?: string[];
  MatchedTopics?: string[];
  Participants?: string[];
}

export interface Message extends Models.Row {
  MatchId: string;
  SenderId: string;
  Message: string;
}

export interface Notification extends Models.Row {
  SenderId: string;
  ReceiverId: string;
  Status: string;
  Read: boolean;
}

export interface SignupData {
  [key: string]: unknown;
  Name: string;
  Email: string;
  Password: string;
  Level: string;
  Availability: string;
  Timezone: string | null;
  Topics: string[];
  Bio: string;
  Avatar: string;
}

export interface NormalizedSignupData {
  name: string;
  email: string;
  password: string;
  level: string;
  availability: string;
  timezone: string;
  topics: string[];
  bio: string;
  avatar: string;
}

export interface AuthState {
  status: boolean;
  userData: AppwriteUser | null;
  loading: boolean;
  error: string | null;
}

export interface ProfileUpdates {
  Name?: string;
  Level?: string;
  Availability?: string;
  Timezone?: string;
  Topics?: string[];
  Bio?: string;
  Avatar?: string;
  Status?: string;
}
