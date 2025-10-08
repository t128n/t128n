import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional and Tailwind classes safely.
 *
 * Example:
 *   cn(
 *     'p-4',
 *     prefixClasses({ sm: 'bg-red-500 text-white' }),
 *     { hidden: isHidden }
 *   );
 */
export function cn(...classValues: ClassValue[]): string {
	return twMerge(clsx(classValues));
}
