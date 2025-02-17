import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setStockStatus = (stock: number, minimumStock: number) => {
  if (stock <= minimumStock) {
    return "bg-red-500 animate-pulse";
  } else if (stock <= minimumStock * 2) {
    return "bg-yellow-500";
  } else {
    return "bg-blue-500";
  }
};
