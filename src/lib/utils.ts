import { cn as mergeClasses } from "cn";

export function cn(...inputs: Parameters<typeof mergeClasses>) {
  return mergeClasses(...inputs);
}
