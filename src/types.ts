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
  | "music"
  | "voices"
  | "images"
  | "videos"
  | "final"
  | "idle"
