"use client"

import { ClapProject, parseClap, serializeClap } from "@aitube/clap"
import { create } from "zustand"

import { GlobalStatus, TaskStatus } from "@/types"
import { getVideoOrientation } from "@/lib/utils/getVideoOrientation"
import { parseVideoOrientation } from "@/lib/utils/parseVideoOrientation"

import { VideoOrientation } from "./types"
import { RESOLUTION_LONG, RESOLUTION_SHORT } from "./server/aitube/config"

export const useStore = create<{
  mainCharacterImage: string
  mainCharacterVoice: string
  storyPromptDraft: string
  storyPrompt: string

  // the desired orientation for the next video
  // but this won't impact the actual orientation of the fake device container
  orientation: VideoOrientation

  status: GlobalStatus
  parseGenerationStatus: TaskStatus
  storyGenerationStatus: TaskStatus
  assetGenerationStatus: TaskStatus
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
  setParseGenerationStatus: (parseGenerationStatus: TaskStatus) => void
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => void
  setAssetGenerationStatus: (assetGenerationStatus: TaskStatus) => void
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => void
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => void
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => void
  setCurrentClap: (currentClap?: ClapProject) => void

  // note: this will preload the video, and compute the orientation too
  setGeneratedVideo: (generatedVideo: string) => Promise<void>

  setProgress: (progress: number) => void
  setError: (error: string) => void
  saveClap: () => Promise<void>
  loadClap: (blob: Blob, fileName?: string) => Promise<ClapProject>
}>((set, get) => ({
  mainCharacterImage: "",
  mainCharacterVoice: "",
  storyPromptDraft: "Yesterday I was at my favorite pizza place and..",
  storyPrompt: "",
  orientation: VideoOrientation.PORTRAIT,
  status: "idle",
  parseGenerationStatus: "idle",
  storyGenerationStatus: "idle",
  assetGenerationStatus: "idle",
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
  setParseGenerationStatus: (parseGenerationStatus: TaskStatus) => { set({ parseGenerationStatus }) },
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => { set({ storyGenerationStatus }) },
  setAssetGenerationStatus: (assetGenerationStatus: TaskStatus) => { set({ assetGenerationStatus }) },
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
  saveClap: async (): Promise<void> => {
    const { currentClap , storyPrompt } = get()

    if (!currentClap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    const currentClapBlob: Blob = await serializeClap(currentClap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(currentClapBlob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    const firstPartOfStoryPrompt = storyPrompt // .split(",").shift() || ""

    const cleanStoryPrompt = firstPartOfStoryPrompt.replace(/([^a-z0-9, ]+)/gi, "_")

    const cleanName = `${cleanStoryPrompt.slice(0, 50)}`

    anchor.download = `${cleanName}.clap`

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  },
  loadClap: async (blob: Blob, fileName: string = "untitled_story.clap"): Promise<ClapProject> => {
    if (!blob) {
      throw new Error(`missing blob`)
    }

    const currentClap: ClapProject | undefined = await parseClap(blob)

    if (!currentClap) { throw new Error(`failed to import the clap`) }


    const storyPrompt = currentClap.meta.description.split("||").pop() || ""

    // TODO: parseVideoOrientation should be put inside @aitube/clap (in the utils)
    // const orientation = parseVideoOrientation(currentClap.meta.orientation)
    // let's use the UI settings for now
    const { orientation } = get()

    currentClap.meta.height = orientation === VideoOrientation.LANDSCAPE ? RESOLUTION_SHORT : RESOLUTION_LONG
    currentClap.meta.width = orientation === VideoOrientation.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG

    set({
      currentClap,
      storyPrompt,
      storyPromptDraft: storyPrompt,
      orientation,
      currentVideoOrientation: orientation,
    })

    return currentClap
  },
}))