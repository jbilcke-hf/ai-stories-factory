import { ComponentProps } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/cn"

import { Switch } from "../ui/switch"

export function SwitchField({
  label,
  className = "",
  labelClassName = "",
  switchClassName = "",
  ...props
}: ComponentProps<typeof Switch> & {
  label?: string;
  className?: string;
  labelClassName?: string;
  switchClassName?: string;
}) {
  return (
    <div className={cn(
      `flex flex-col space-y-3 items-start`,
      className
      )}>
      {label && <Label className={cn(`
      text-base md:text-lg lg:text-xl
       text-stone-900/90 dark:text-stone-100/90
       `, labelClassName)}>{label}</Label>}
      <Switch {...props} className={switchClassName} />
    </div>
  )
}