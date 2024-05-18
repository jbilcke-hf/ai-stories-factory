"use client"

import { ClapProject, parseClap, serializeClap, ClapMediaOrientation, parseMediaOrientation, ClapSegmentCategory, newSegment, getClapAssetSourceType } from "@aitube/clap"
import { create } from "zustand"

import { GenerationStage, GlobalStatus, TaskStatus } from "@/types"
import { getVideoOrientation } from "@/lib/utils/getVideoOrientation"

import { RESOLUTION_LONG, RESOLUTION_SHORT } from "./server/config"
import { putTextInTextAreaElement } from "@/lib/utils/putTextInTextAreaElement"
import { defaultPrompt } from "./config"

export const useStore = create<{
  mainCharacterImage: string
  mainCharacterVoice: string
  storyPrompt: string

  // the desired orientation for the next video
  // but this won't impact the actual orientation of the fake device container
  orientation: ClapMediaOrientation

  status: GlobalStatus
  stage: GenerationStage
  statusMessage: string
  parseGenerationStatus: TaskStatus
  storyGenerationStatus: TaskStatus
  assetGenerationStatus: TaskStatus
  soundGenerationStatus: TaskStatus
  musicGenerationStatus: TaskStatus
  voiceGenerationStatus: TaskStatus
  imageGenerationStatus: TaskStatus
  videoGenerationStatus: TaskStatus
  finalGenerationStatus: TaskStatus
  isBusy: boolean

  currentClap?: ClapProject
  currentVideo: string

  // orientation of the currently loaded video (which can be different from `orientation`)
  // it will impact the actual orientation of the fake device container
  currentVideoOrientation: ClapMediaOrientation
  progress: number
  error: string
  showAuthWall: boolean
  setShowAuthWall: (showAuthWall: boolean) => void
  toggleOrientation: () => void
  setOrientation: (orientation: ClapMediaOrientation) => void
  setCurrentVideoOrientation: (currentVideoOrientation: ClapMediaOrientation) => void
  setMainCharacterImage: (mainCharacterImage: string) => void
  setMainCharacterVoice: (mainCharacterVoice: string) => void
  setStoryPrompt: (storyPrompt: string) => void
  setStatus: (status: GlobalStatus) => void
  setParseGenerationStatus: (parseGenerationStatus: TaskStatus) => void
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => void
  setAssetGenerationStatus: (assetGenerationStatus: TaskStatus) => void
  setSoundGenerationStatus: (soundGenerationStatus: TaskStatus) => void
  setMusicGenerationStatus: (musicGenerationStatus: TaskStatus) => void
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => void
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => void
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => void
  setFinalGenerationStatus: (finalGenerationStatus: TaskStatus) => void
  syncStatusAndStageState: () => void
  setCurrentClap: (currentClap?: ClapProject) => void

  // note: this will preload the video, and compute the orientation too
  setCurrentVideo: (currentVideo: string) => Promise<void>

  setProgress: (progress: number) => void
  setError: (error: string) => void
  saveVideo: () => Promise<void>
  saveClap: () => Promise<void>
  loadClap: (blob: Blob, fileName?: string) => Promise<{
    clap: ClapProject
    regenerateVideo: boolean
  }>
}>((set, get) => ({
  mainCharacterImage: "",
  mainCharacterVoice: "",
  storyPromptDraft: defaultPrompt,
  storyPrompt: "",
  orientation: ClapMediaOrientation.PORTRAIT,
  status: "idle",
  stage: "idle",
  statusMessage: "",
  parseGenerationStatus: "idle",
  storyGenerationStatus: "idle",
  assetGenerationStatus: "idle",
  soundGenerationStatus: "idle",
  musicGenerationStatus: "idle",
  voiceGenerationStatus: "idle",
  imageGenerationStatus: "idle",
  videoGenerationStatus: "idle",
  finalGenerationStatus: "idle",
  isBusy: false,
  currentClap: undefined,
  currentVideo: "",
  currentVideoOrientation: ClapMediaOrientation.PORTRAIT,
  progress: 0,
  error: "",
  showAuthWall: false,
  setShowAuthWall: (showAuthWall: boolean) => { set({ showAuthWall }) },
  toggleOrientation: () => {
    const { orientation: previousOrientation, currentVideoOrientation, currentVideo } = get()
    const orientation =
      previousOrientation === ClapMediaOrientation.LANDSCAPE
      ? ClapMediaOrientation.PORTRAIT
      : ClapMediaOrientation.LANDSCAPE

    set({
      orientation,

      // we normally don't touch the currentVideoOrientation since it will already contain a video
      currentVideoOrientation:
        currentVideo
        ? currentVideoOrientation
        : orientation
    })
  },
  setOrientation: (orientation: ClapMediaOrientation) => {
    const { currentVideoOrientation, currentVideo } = get()

    set({
      orientation,

      // we normally don't touch the currentVideoOrientation since it will already contain a video
      currentVideoOrientation:
        currentVideo
        ? currentVideoOrientation
        : orientation
    })
  },
  setCurrentVideoOrientation: (currentVideoOrientation: ClapMediaOrientation) => { set({ currentVideoOrientation }) },
  setMainCharacterImage: (mainCharacterImage: string) => { set({ mainCharacterImage }) },
  setMainCharacterVoice: (mainCharacterVoice: string) => { set({ mainCharacterVoice }) },
  setStoryPrompt: (storyPrompt: string) => { set({ storyPrompt }) },
  setStatus: (status: GlobalStatus) => {
    set({ status })
    get().syncStatusAndStageState()
  },
  setParseGenerationStatus: (parseGenerationStatus: TaskStatus) => {
    set({ parseGenerationStatus })
    get().syncStatusAndStageState()
  },
  setStoryGenerationStatus: (storyGenerationStatus: TaskStatus) => {
    set({ storyGenerationStatus })
    get().syncStatusAndStageState()
  },
  setAssetGenerationStatus: (assetGenerationStatus: TaskStatus) => {
    set({ assetGenerationStatus })
    get().syncStatusAndStageState()
  },
  setSoundGenerationStatus: (soundGenerationStatus: TaskStatus) => {
    set({ soundGenerationStatus })
    get().syncStatusAndStageState()
  },
  setMusicGenerationStatus: (musicGenerationStatus: TaskStatus) => {
    set({ musicGenerationStatus })
    get().syncStatusAndStageState()
  },
  setVoiceGenerationStatus: (voiceGenerationStatus: TaskStatus) => {
    set({ voiceGenerationStatus })
    get().syncStatusAndStageState()
  },
  setImageGenerationStatus: (imageGenerationStatus: TaskStatus) => {
    set({ imageGenerationStatus })
    get().syncStatusAndStageState()
  },
  setVideoGenerationStatus: (videoGenerationStatus: TaskStatus) => {
    set({ videoGenerationStatus })
    get().syncStatusAndStageState()
  },
  setFinalGenerationStatus: (finalGenerationStatus: TaskStatus) => {
    set({ finalGenerationStatus })
    get().syncStatusAndStageState()
  },
  syncStatusAndStageState: () => {
    const { status, parseGenerationStatus, storyGenerationStatus, assetGenerationStatus, soundGenerationStatus, musicGenerationStatus, voiceGenerationStatus, imageGenerationStatus, videoGenerationStatus, finalGenerationStatus } = get()

    // note: we don't really have "stages" since some things run in parallel,
    // and some parallel tasks may finish before the others
    // still, we need to estimate how long things should take, so it has some usefulness
    let stage: GenerationStage =
      parseGenerationStatus === "generating" ? "parse" :
      storyGenerationStatus === "generating" ? "story" :
      assetGenerationStatus === "generating" ? "entities" :
      musicGenerationStatus === "generating" ? "music" :
      soundGenerationStatus === "generating" ? "sounds" :
      voiceGenerationStatus === "generating" ? "voices" :
      imageGenerationStatus === "generating" ? "images" :
      videoGenerationStatus === "generating" ? "videos" :
      finalGenerationStatus === "generating" ? "final" :
      "idle"


    // I think we still need the global status
    // that is because we can have parallelism
    const isBusy = stage !== "idle" || status === "generating"
    

  const statusMessage = isBusy ? (
    // note: some of those tasks are running in parallel,
    // and some are super-slow (like music or video)
    // by carefully selecting in which order we set the ternaries,
    // we can create the illusion that we just have a succession of reasonably-sized tasks
    storyGenerationStatus === "generating" ? "Writing story.."
    : parseGenerationStatus === "generating" ? "Loading the project.."
    : assetGenerationStatus === "generating" ? "Casting characters.."
    : imageGenerationStatus === "generating" ? "Creating storyboards.."
    : soundGenerationStatus === "generating" ? "Recording sounds.."
    : videoGenerationStatus === "generating" ? "Filming shots.."
    : musicGenerationStatus === "generating" ? "Producing music.."
    : voiceGenerationStatus === "generating" ? "Recording dialogues.."
    : finalGenerationStatus === "generating" ? "Editing final cut.."
    : "Please wait.."
  ) : ""

    set({ isBusy, stage, statusMessage })
  },
  setCurrentClap: (currentClap?: ClapProject) => { set({ currentClap }) },
  setCurrentVideo: async (currentVideo: string): Promise<void> => {
    set({
      currentVideo,
    })
    const { currentVideoOrientation } = get()
    let orientation: ClapMediaOrientation = currentVideoOrientation
    try {
      let newOrientation = await getVideoOrientation(currentVideo)
      if (newOrientation) {
        orientation = newOrientation
      }
    } catch (err) {
      console.error(`failed to get the media orientation`)
    }
    set({
      currentVideoOrientation: orientation
    })

    // get().syncStatusAndStageState()
  },
  setProgress: (progress: number) => { set({ progress }) },
  setError: (error: string) => { set({ error }) },
  saveVideo: async (): Promise<void> => {
    const { currentVideo, storyPrompt } = get()

    if (!currentVideo) { throw new Error(`cannot save a video.. if there is no video`) }

    const currentClapBlob: Blob = await fetch(currentVideo).then(r => r.blob())
   
    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(currentClapBlob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    const firstPartOfStoryPrompt = storyPrompt // .split(",").shift() || ""

    const cleanStoryPrompt = firstPartOfStoryPrompt.replace(/([^a-z0-9, ]+)/gi, "_")

    const cleanName = `${cleanStoryPrompt.slice(0, 120)}`

    anchor.download = `${cleanName}.mp4`

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  },
  saveClap: async (): Promise<void> => {
    const { currentClap , storyPrompt, currentVideo } = get()

    if (!currentClap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    currentClap.meta.description = storyPrompt

    // make sure we update the total duration
    for (const s of currentClap.segments) {
      if (s.endTimeInMs > currentClap.meta.durationInMs) {
        currentClap.meta.durationInMs = s.endTimeInMs
      }
    }

    const alreadyAnEmbeddedFinalVideo = currentClap.segments.filter(s =>
      s.category === ClapSegmentCategory.VIDEO &&
      s.status === "completed" &&
      s.startTimeInMs === 0 &&
      s.endTimeInMs === currentClap.meta.durationInMs &&
      s.assetUrl).at(0)

    // inject the final mp4 video file into the .clap
    if (alreadyAnEmbeddedFinalVideo) {
      console.log(`editing the clap to update the final video`)
      alreadyAnEmbeddedFinalVideo.assetUrl = currentVideo
    } else {
      console.log(`editing the clap to add a new final video`)
      currentClap.segments.push(newSegment({
        category: ClapSegmentCategory.VIDEO,
        status: "completed",
        startTimeInMs: 0,
        endTimeInMs: currentClap.meta.durationInMs,
        assetUrl: currentVideo,
        assetDurationInMs: currentClap.meta.durationInMs,
        assetSourceType: getClapAssetSourceType(currentVideo),
        outputGain: 1.0,
      }))
    }
    const currentClapBlob: Blob = await serializeClap(currentClap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(currentClapBlob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    const firstPartOfStoryPrompt = storyPrompt // .split(",").shift() || ""

    const cleanStoryPrompt = firstPartOfStoryPrompt.replace(/([^a-z0-9, ]+)/gi, " ")

    const cleanName = `${cleanStoryPrompt.slice(0, 160)}`

    anchor.download = `${cleanName}.clap`

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  },
  loadClap: async (blob: Blob, fileName: string = "untitled_story.clap"): Promise<{
    clap: ClapProject
    regenerateVideo: boolean
  }> => {
    if (!blob) {
      throw new Error(`missing blob`)
    }

    const currentClap: ClapProject | undefined = await parseClap(blob)

    if (!currentClap) { throw new Error(`failed to import the clap`) }

    const storyPrompt = currentClap.meta.description.split("||").pop() || ""

    putTextInTextAreaElement(
      document.getElementById("story-prompt-draft") as HTMLTextAreaElement,
      storyPrompt
    )

    const orientation = parseMediaOrientation(currentClap.meta.orientation)

    currentClap.meta.height = orientation === ClapMediaOrientation.LANDSCAPE ? RESOLUTION_SHORT : RESOLUTION_LONG
    currentClap.meta.width = orientation === ClapMediaOrientation.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG

    const embeddedFinalVideoAssetUrl = currentClap.segments.filter(s =>
      s.category === ClapSegmentCategory.VIDEO &&
      s.status === "completed" &&
      s.startTimeInMs === 0 &&
      s.endTimeInMs === currentClap.meta.durationInMs &&
      s.assetUrl).map(s => s.assetUrl).at(0)

    set({
      currentClap,
      storyPrompt,
      orientation,
      currentVideo: embeddedFinalVideoAssetUrl || get().currentVideo,
      currentVideoOrientation: orientation,
    })

    return {
      clap: currentClap,
      regenerateVideo: !embeddedFinalVideoAssetUrl,
    }
  },
}))