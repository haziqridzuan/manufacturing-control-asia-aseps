
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @param formatStr Optional format string for date-fns
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy') {
  try {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    if (!isValid(date)) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
}

/**
 * Calculate days remaining until the given date
 * @param dateString ISO date string
 * @returns Number of days remaining (negative if in the past)
 */
export function getDaysRemaining(dateString: string): number {
  try {
    if (!dateString) return 0;
    
    const targetDate = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const today = new Date();
    
    if (!isValid(targetDate)) {
      console.error('Invalid date for days calculation:', dateString);
      return 0;
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return 0;
  }
}

/**
 * Format a date to a relative time (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    if (!isValid(date)) {
      console.error('Invalid date for relative time:', dateString);
      return 'Invalid date';
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Error';
  }
}

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
