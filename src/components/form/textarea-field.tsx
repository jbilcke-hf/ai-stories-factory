import { ComponentProps } from "react";

import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export function TextareaField({
  label,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...props
}: ComponentProps<typeof Textarea> & {
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
      {label && <Label className={cn(`
      text-xl text-stone-900/90 dark:text-stone-100/90
      `, labelClassName)}>{label}</Label>}
      <Textarea {...props} className={cn(`
      text-xl
      rounded-2xl
            
      border-yellow-300 dark:border-yellow-300
      outline-yellow-300 dark:outline-yellow-300
      ring-yellow-300 dark:ring-yellow-300
      ring-offset-yellow-300 dark:ring-offset-yellow-300
      placeholder:text-stone-900/50 dark:placeholder:text-stone-100/50
      p-6
      `, inputClassName)} />
    </div>
  )
}