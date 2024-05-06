import { VideoOrientation } from "@/app/types"

export function parseVideoOrientation(input?: any): VideoOrientation {
  const orientation = `${input || ""}`.trim().toLowerCase() || "square"

  return (
    (orientation === "vertical" || orientation === "portrait") ? VideoOrientation.PORTRAIT
    : (orientation === "horizontal" || orientation === "landscape") ? VideoOrientation.LANDSCAPE
    : VideoOrientation.SQUARE
  )
}