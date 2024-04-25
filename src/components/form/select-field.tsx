import { ComponentProps } from "react";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SelectField({
  label,
  className = "",
  labelClassName = "",
  selectClassName = "",
  ...props
}: ComponentProps<typeof Select> & {
  label?: string;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
}) {
  return (
    <div className={cn(
      `flex flex-col space-y-3 items-start`,
      className
      )}>
      {label && <Label className={cn("text-xl text-stone-900/90 dark:text-stone-100/90", labelClassName)}>{label}</Label>}
      <Select {...props} />
    </div>
  )
}