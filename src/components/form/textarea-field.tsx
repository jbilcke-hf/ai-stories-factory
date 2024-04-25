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
      text-base md:text-lg lg:text-xl
      text-stone-900/90 dark:text-stone-100/90
      `, labelClassName)}
      style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}>{label}</Label>}
      <Textarea {...props} className={cn(`
      text-base md:text-lg lg:text-xl
      rounded-lg md:rounded-xl lg:rounded-2xl
      border-2
      backdrop-blur-2xl
      border-stone-800/80 dark:border-stone-800/80
      outline-stone-800/80 dark:outline-stone-800/80
      ring-stone-800/80 dark:ring-stone-800/80
      ring-offset-stone-800/0 dark:ring-offset-stone-800/0
      placeholder:text-stone-900/50 dark:placeholder:text-stone-100/50
      focus-visible:ring-amber-400/100 dark:focus-visible:ring-amber-400/100
      p-2 md:p-4 lg:p-6
      `, inputClassName)}
      style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}
      />
    </div>
  )
}