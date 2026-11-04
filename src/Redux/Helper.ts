// helper.js
import type { NormalizedSignupData, SignupData } from "../types";

export const normalizeUserData = (data: Partial<SignupData> & { [key: string]: unknown }): NormalizedSignupData => ({
  name: String(data.Name || data.name || ""),
  email: String(data.Email || data.email || ""),
  password: String(data.Password || data.password || ""),
  level: String(data.Level || data.level || "Beginner"),
  availability: String(data.Availability || data.availability || "Available"),
  timezone: String(data.Timezone || data.timezone || "UTC"),
  topics: (data.Topics || data.topics || []) as string[],
  bio: String(data.Bio || data.bio || ""),
  avatar: (() => {
    const avatar = data.Avatar ?? data.avatar ?? "";
    return typeof avatar === "string" ? avatar : JSON.stringify(avatar);
  })(),
});