export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();

  // Handle future dates (optional)
  if (diffMs < 0) return "Just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  return `${days} day${days > 1 ? "s" : ""} ago`;
};
