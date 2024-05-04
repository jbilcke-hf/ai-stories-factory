import { ReactNode } from "react"

import { cn } from "@/lib/utils/cn"

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <label className={cn(`text-base font-semibold text-zinc-700`, className)}>{children}</label>
  )
}