import { ComponentProps } from "react";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SliderField({
  label,
  className = "",
  labelClassName = "",
  sliderClassName = "",
  ...props
}: ComponentProps<typeof Slider> & {
  label?: string;
  className?: string;
  labelClassName?: string;
  sliderClassName?: string;
}) {
  return (
    <div className={cn(
      `flex flex-col space-y-3 items-start`,
      className
      )}>
      {label && <Label className={cn("text-xl text-stone-900/90 dark:text-stone-100/90", labelClassName)}>{label}</Label>}
      <Slider {...props} className={sliderClassName} />
    </div>
  )
}