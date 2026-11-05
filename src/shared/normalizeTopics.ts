export const normalizeTopics = (topics: unknown): string[] => {
  if (!Array.isArray(topics)) return [];

  return [...new Set(
    topics
      .filter((topic): topic is string => typeof topic === "string")
      .map((topic) => topic.trim().toLowerCase())
      .filter(Boolean),
  )];
};
