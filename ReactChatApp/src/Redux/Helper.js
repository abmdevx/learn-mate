// helper.js
export const normalizeUserData = (data) => ({
  name: data.Name || data.name || "",
  email: data.Email || data.email || "",
  password: data.Password || data.password || "",
  level: data.Level || data.level || "Beginner",
  availability: data.Availability || data.availability || "Available",
  timezone: data.Timezone || data.timezone || "UTC",
  topics: data.Topics || data.topics || [],
  bio: data.Bio || data.bio || "",
  avatar: data.Avatar || data.avatar || null,
});