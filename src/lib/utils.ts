import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard utility to handle conditional classes cleanly
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
