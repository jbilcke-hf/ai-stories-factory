import { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export function InputField({
  label,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...props
}: ComponentProps<typeof Input> & {
  label?: string
  className?: string
  labelClassName?: string
  inputClassName?: string
}) {
  return (
    <div className={cn(
      `flex flex-col space-y-3 items-start`,
      className
      )}>
      {label && <Label className={cn("text-xl text-stone-900/90 dark:text-stone-100/90", labelClassName)}>{label}</Label>}
      <Input {...props} className={cn("text-xl", inputClassName)} />
    </div>
  )
}
