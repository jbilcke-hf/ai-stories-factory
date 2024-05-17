
import { useRef } from "react"
import { useLocalStorage } from "usehooks-ts"

import { defaultPrompt, localStorageStoryDraftKey } from "@/app/config"

export function useStoryPromptDraft() {
  const [storyPromptDraft, setStoryPromptDraft] = useLocalStorage<string>(
    localStorageStoryDraftKey,
    defaultPrompt
  )
  const promptDraftRef = useRef("")
  promptDraftRef.current = storyPromptDraft

  return { storyPromptDraft, setStoryPromptDraft, promptDraftRef }
}