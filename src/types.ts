export type TaskStatus =
  | "idle"
  | "generating"
  | "finished"
  | "error"

export type GlobalStatus =
  | "idle"
  | "generating"
  | "finished"
  | "error"

export type GenerationStage =
  | "story"
  | "entities"
  | "voices"
  | "images"
  | "video_export"
  | "idle"
