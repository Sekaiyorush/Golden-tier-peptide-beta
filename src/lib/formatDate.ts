import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date string or Date to a human-readable format.
 * Handles ISO strings, Date objects, and invalid values gracefully.
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = 'MMM d, yyyy'
): string {
  if (!date) return 'N/A';

  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'N/A';

  return format(parsed, formatStr);
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'N/A';

  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * Format a date with time included (e.g., "Jan 15, 2025 at 10:30 AM").
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'MMM d, yyyy \'at\' h:mm a');
}

/**
 * Format a date for short display (e.g., "Jan 15").
 */
export function formatShortDate(date: string | Date | null | undefined): string {
  return formatDate(date, 'MMM d');
}
