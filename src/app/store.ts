"use client"

import { ClapProject, parseClap, serializeClap } from "@aitube/clap"
import { create } from "zustand"

import { GlobalStatus, TaskStatus } from "@/types"

import { VideoOrientation } from "./types"
import { getVideoOrientation } from "@/lib/utils/getVideoOrientation"

export const useStore = create<{
  mainCharacterImage: string
  mainCharacterVoice: string
  storyPromptDraft: string
  storyPrompt: string

  // the desired orientation for the next video
  // but this won't impact the actual orientation of the fake device container
  orientation: VideoOrientation

  status: GlobalStatus
  storyGenerationStatus: TaskStatus
  voiceGenerationStatus: TaskStatus
  imageGenerationStatus: TaskStatus
  videoGenerationStatus: TaskStatus
  currentClap?: ClapProject
  currentVideo: string

  // orientation of the currently loaded video (which can be different from `orientation`)
  // it will impact the actual orientation of the fake device container
  currentVideoOrientation: VideoOrientation
  progress: number
  error: string
  toggleOrientation: () => void
  setCurrentVideoOrientation: (currentVideoOrientation: VideoOrientation) => void
  setMainCharacterImage: (mainCharacterImage: string) => void
  setMainCharacterVoice: (mainCharacterVoice: string) => void
  setStoryPromptDraft: (storyPromptDraft: string) => void
  setStoryPrompt: (storyPrompt: string) => void
  setStatus: (status: GlobalStatus) => void
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => void
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => void
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => void
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => void
  setCurrentClap: (currentClap?: ClapProject) => void

  // note: this will preload the video, and compute the orientation too
  setGeneratedVideo: (generatedVideo: string) => Promise<void>

  setProgress: (progress: number) => void
  setError: (error: string) => void
  saveClap: (fileName?: string) => Promise<void>
  loadClap: (blob: Blob, fileName?: string) => Promise<void>
}>((set, get) => ({
  mainCharacterImage: "",
  mainCharacterVoice: "",
  storyPromptDraft: "Yesterday I was at my favorite pizza place and..",
  storyPrompt: "",
  orientation: VideoOrientation.PORTRAIT,
  status: "idle",
  storyGenerationStatus: "idle",
  voiceGenerationStatus: "idle",
  imageGenerationStatus: "idle",
  videoGenerationStatus: "idle",
  currentClap: undefined,
  currentVideo: "",
  currentVideoOrientation: VideoOrientation.PORTRAIT,
  progress: 0,
  error: "",
  toggleOrientation: () => {
    const { orientation: previousOrientation, currentVideoOrientation, currentVideo } = get()
    const orientation =
      previousOrientation === VideoOrientation.LANDSCAPE
      ? VideoOrientation.PORTRAIT
      : VideoOrientation.LANDSCAPE

    set({
      orientation,

      // we normally don't touch the currentVideoOrientation since it will already contain a video
      currentVideoOrientation:
        currentVideo
        ? currentVideoOrientation
        : orientation
    })
  },
  setCurrentVideoOrientation: (currentVideoOrientation: VideoOrientation) => { set({ currentVideoOrientation }) },
  setMainCharacterImage: (mainCharacterImage: string) => { set({ mainCharacterImage }) },
  setMainCharacterVoice: (mainCharacterVoice: string) => { set({ mainCharacterVoice }) },
  setStoryPromptDraft: (storyPromptDraft: string) => { set({ storyPromptDraft }) },
  setStoryPrompt: (storyPrompt: string) => { set({ storyPrompt }) },
  setStatus: (status: GlobalStatus) => { set({ status }) },
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => { set({ storyGenerationStatus }) },
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => { set({ voiceGenerationStatus }) },
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => { set({ imageGenerationStatus }) },
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => { set({ videoGenerationStatus }) },
  setCurrentClap: (currentClap?: ClapProject) => { set({ currentClap }) },
  setGeneratedVideo: async (currentVideo: string): Promise<void> => {
    const currentVideoOrientation = await getVideoOrientation(currentVideo)
    set({
      currentVideo,
      currentVideoOrientation

    })
  },
  setProgress: (progress: number) => { set({ progress }) },
  setError: (error: string) => { set({ error }) },
  saveClap: async (fileName: string = "untitled_story.clap"): Promise<void> => {
    const { currentClap } = get()

    if (!currentClap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    const currentClapBlob: Blob = await serializeClap(currentClap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(currentClapBlob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    anchor.download = fileName

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  },
  loadClap: async (blob: Blob, fileName: string = "untitled_story.clap"): Promise<void> => {
    if (!blob) {
      throw new Error(`missing blob`)
    }

    const currentClap: ClapProject = await parseClap(blob)

    set({
      currentClap,
    })
  },
}))