import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimizes Cloudinary images by inserting auto-format (f_auto),
 * auto-quality (q_auto), and target width (w_N) transformation parameters.
 */
export function getOptimizedImageUrl(url?: string, width = 800): string {
  if (!url || typeof url !== 'string') return '';

  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // If transformations aren't already included, inject f_auto,q_auto,w_N
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }

  return url;
}
