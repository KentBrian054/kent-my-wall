import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50 bg-[#2955a3] text-white hover:bg-[#204783]");

export function Button({ className, ...props }: ComponentProps<"button">) {
  return <button data-slot="button" className={cn(buttonVariants(), className)} {...props} />;
}
