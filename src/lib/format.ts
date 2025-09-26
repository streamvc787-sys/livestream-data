/**
 * Format number with compact notation (e.g., 1234 -> 1.2K)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Format number with commas (e.g., 1234 -> 1,234)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Calculate uptime from start time to now
 */
export function calculateUptime(startedAt: string | undefined): string {
  if (!startedAt) return 'Unknown';
  
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  
  if (diffMs < 0) return 'Not started';
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMinutes % 60}m`;
  if (diffMinutes > 0) return `${diffMinutes}m ${diffSeconds % 60}s`;
  return `${diffSeconds}s`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 0) return 'In the future';
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Get status badge variant based on live status
 */
export function getStatusVariant(isLive: boolean | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (isLive === true) {
    return 'default';
  }
  if (isLive === false) {
    return 'secondary';
  }
  return 'outline';
}

/**
 * Get status text based on live status
 */
export function getStatusText(isLive: boolean | undefined): string {
  if (isLive === true) {
    return 'LIVE';
  }
  if (isLive === false) {
    return 'ENDED';
  }
  return 'UNKNOWN';
}

/**
 * Get display name for stream (name or symbol)
 */
export function getStreamDisplayName(stream: {
  name?: string;
  symbol?: string;
  title?: string;
  handle?: string;
}): string {
  return stream.name || stream.symbol || stream.title || stream.handle || 'Unknown Stream';
}

/**
 * Get display handle for stream
 */
export function getStreamHandle(stream: {
  symbol?: string;
  name?: string;
  handle?: string;
  title?: string;
}): string {
  return stream.symbol || stream.handle || stream.name || stream.title || 'unknown';
}

/**
 * Format countdown for next refresh
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Refreshing...';
  return `${seconds}s`;
}

// Alias for backward compatibility
export const compactNumber = formatCompactNumber;

/**
 * Get title from stream item (legacy compatibility)
 */
export function titleOf(item: { title?: string; name?: string; symbol?: string }): string {
  return item?.title ?? item?.name ?? item?.symbol ?? "Untitled";
}

/**
 * Get handle from stream item (legacy compatibility)
 */
export function handleOf(item: { handle?: string; symbol?: string }): string {
  return item?.handle ? `@${item.handle}` : item?.symbol ? `$${item.symbol}` : "";
}

/**
 * Calculate uptime from start time (legacy compatibility)
 */
export function uptimeFrom(startedAt: string | undefined): string {
  return calculateUptime(startedAt);
}

/**
 * Get updated label for stream item
 */
export function updatedLabel(updatedAt: string | undefined): string {
  if (!updatedAt) return "Unknown";
  return formatRelativeTime(updatedAt);
}
