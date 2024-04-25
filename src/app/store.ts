"use client"

import { GlobalStatus, TaskStatus } from "@/types"
import { create } from "zustand"

export const useStore = create<{
  storyPromptDraft: string
  storyPrompt: string
  status: GlobalStatus
  storyGenerationStatus: TaskStatus
  voiceGenerationStatus: TaskStatus
  imageGenerationStatus: TaskStatus
  videoGenerationStatus: TaskStatus
  setStoryPromptDraft: (storyPromptDraft: string) => void
  setStoryPrompt: (storyPrompt: string) => void
  setStatus: (status: GlobalStatus) => void
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => void
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => void
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => void
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => void
}>((set, get) => ({
  storyPromptDraft: "",
  storyPrompt: "",
  status: "idle",
  storyGenerationStatus: "idle",
  voiceGenerationStatus: "idle",
  imageGenerationStatus: "idle",
  videoGenerationStatus: "idle",
  setStoryPromptDraft: (storyPromptDraft: string) => { set({ storyPromptDraft }) },
  setStoryPrompt: (storyPrompt: string) => { set({ storyPrompt }) },
  setStatus: (status: GlobalStatus) => { set({ status }) },
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => { set({ storyGenerationStatus }) },
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => { set({ voiceGenerationStatus }) },
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => { set({ imageGenerationStatus }) },
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => { set({ videoGenerationStatus }) },
}))