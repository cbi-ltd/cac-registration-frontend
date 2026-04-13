import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  const key = (status || "").toLowerCase();
  switch (key) {
    case "approved":
      return "text-green-600";
    case "pending":
      return "text-amber-600";
    case "submitted":
      return "text-blue-600";
    case "rejected":
      return "text-destructive";
    default:
      return "text-foreground";
  }
};
