"use client"

import { GlobalStatus, TaskStatus } from "@/types"
import { ClapProject } from "@aitube/clap"
import { create } from "zustand"

export const useStore = create<{
  storyPromptDraft: string
  storyPrompt: string
  status: GlobalStatus
  storyGenerationStatus: TaskStatus
  voiceGenerationStatus: TaskStatus
  imageGenerationStatus: TaskStatus
  videoGenerationStatus: TaskStatus
  generatedClap?: ClapProject
  generatedVideo: string
  progress: number
  error: string
  setStoryPromptDraft: (storyPromptDraft: string) => void
  setStoryPrompt: (storyPrompt: string) => void
  setStatus: (status: GlobalStatus) => void
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => void
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => void
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => void
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => void
  setGeneratedClap: (generatedClap?: ClapProject) => void
  setGeneratedVideo: (generatedVideo: string) => void
  setProgress: (progress: number) => void
  setError: (error: string) => void
}>((set, get) => ({
  storyPromptDraft: "Yesterday I was at my favorite pizza place and..",
  storyPrompt: "",
  status: "idle",
  storyGenerationStatus: "idle",
  voiceGenerationStatus: "idle",
  imageGenerationStatus: "idle",
  videoGenerationStatus: "idle",
  generatedClap: undefined,
  generatedVideo: "",
  progress: 0,
  error: "",
  setStoryPromptDraft: (storyPromptDraft: string) => { set({ storyPromptDraft }) },
  setStoryPrompt: (storyPrompt: string) => { set({ storyPrompt }) },
  setStatus: (status: GlobalStatus) => { set({ status }) },
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => { set({ storyGenerationStatus }) },
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => { set({ voiceGenerationStatus }) },
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => { set({ imageGenerationStatus }) },
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => { set({ videoGenerationStatus }) },
  setGeneratedClap: (generatedClap?: ClapProject) => { set({ generatedClap }) },
  setGeneratedVideo: (generatedVideo: string) => { set({ generatedVideo }) },
  setProgress: (progress: number) => { set({ progress }) },
  setError: (error: string) => { set({ error }) },
}))