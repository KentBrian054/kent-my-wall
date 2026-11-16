import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn("block min-h-28 w-full resize-y rounded-md border border-[#bfcce0] bg-white px-3 py-3 text-sm text-[#182941] placeholder:text-[#586a83] focus-visible:outline-2 focus-visible:outline-blue-700", className)} {...props} />;
}
