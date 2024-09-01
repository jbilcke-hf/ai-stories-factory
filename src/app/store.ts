"use client"

import { ClapProject, parseClap, serializeClap, ClapImageRatio, parseImageRatio, ClapSegmentCategory, newSegment, getClapAssetSourceType, ClapSegmentStatus } from "@aitube/clap"
import { create } from "zustand"

import { GenerationStage, GlobalStatus, TaskStatus } from "@/types"
import { getImageRatio } from "@/lib/utils/getImageRatio"

import { RESOLUTION_LONG, RESOLUTION_SHORT } from "./server/config"
import { putTextInTextAreaElement } from "@/lib/utils/putTextInTextAreaElement"
import { defaultPrompt } from "./config"

export const useStore = create<{
  mainCharacterImage: string
  mainCharacterVoice: string
  storyPrompt: string

  // the desired imageRatio for the next video
  // but this won't impact the actual imageRatio of the fake device container
  imageRatio: ClapImageRatio

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

  // a clap file stripped of all its image, video and audio assets
  // this lightweight clap (which can still grow large)
  // is best suited for doing API calls
  skeletonClap?: ClapProject

  // the full clap file, with all the binary assets
  fullClap?: ClapProject

  currentVideo: string

  // imageRatio of the currently loaded video (which can be different from `imageRatio`)
  // it will impact the actual imageRatio of the fake device container
  currentImageRatio: ClapImageRatio
  progress: number
  error: string
  showAuthWall: boolean
  setShowAuthWall: (showAuthWall: boolean) => void
  toggleOrientation: () => void
  setImageRatio: (imageRatio: ClapImageRatio) => void
  setCurrentVideoOrientation: (currentImageRatio: ClapImageRatio) => void
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
  setSkeletonClap: (fullClap?: ClapProject) => void
  setFullClap: (fullClap?: ClapProject) => void

  // note: this will preload the video, and compute the imageRatio too
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
  imageRatio: ClapImageRatio.PORTRAIT,
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
  skeletonClap: undefined,
  fullClap: undefined,
  currentVideo: "",
  currentImageRatio: ClapImageRatio.PORTRAIT,
  progress: 0,
  error: "",
  showAuthWall: false,
  setShowAuthWall: (showAuthWall: boolean) => { set({ showAuthWall }) },
  toggleOrientation: () => {
    const { imageRatio: previousOrientation, currentImageRatio, currentVideo } = get()
    const imageRatio =
      previousOrientation === ClapImageRatio.LANDSCAPE
      ? ClapImageRatio.PORTRAIT
      : ClapImageRatio.LANDSCAPE

    set({
      imageRatio,

      // we normally don't touch the currentImageRatio since it will already contain a video
      currentImageRatio:
        currentVideo
        ? currentImageRatio
        : imageRatio
    })
  },
  setImageRatio: (imageRatio: ClapImageRatio) => {
    const { currentImageRatio, currentVideo } = get()

    set({
      imageRatio,

      // we normally don't touch the currentImageRatio since it will already contain a video
      currentImageRatio:
        currentVideo
        ? currentImageRatio
        : imageRatio
    })
  },
  setCurrentVideoOrientation: (currentImageRatio: ClapImageRatio) => { set({ currentImageRatio }) },
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
  setSkeletonClap: (skeletonClap?: ClapProject) => { set({ skeletonClap }) },
  setFullClap: (fullClap?: ClapProject) => { set({ fullClap }) },
  setCurrentVideo: async (currentVideo: string): Promise<void> => {
    set({
      currentVideo,
    })
    const { currentImageRatio } = get()
    let imageRatio: ClapImageRatio = currentImageRatio
    try {
      let newOrientation = await getImageRatio(currentVideo)
      if (newOrientation) {
        imageRatio = newOrientation
      }
    } catch (err) {
      console.error(`failed to get the media imageRatio`)
    }
    set({
      currentImageRatio: imageRatio
    })

    // get().syncStatusAndStageState()
  },
  setProgress: (progress: number) => { set({ progress }) },
  setError: (error: string) => { set({ error }) },
  saveVideo: async (): Promise<void> => {
    const { currentVideo, storyPrompt } = get()

    if (!currentVideo) { throw new Error(`cannot save a video.. if there is no video`) }

    const fullClapBlob: Blob = await fetch(currentVideo).then(r => r.blob())
   
    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(fullClapBlob)
  
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
    const { fullClap , storyPrompt, currentVideo } = get()

    if (!fullClap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    fullClap.meta.description = storyPrompt

    // make sure we update the total duration
    for (const s of fullClap.segments) {
      if (s.endTimeInMs > fullClap.meta.durationInMs) {
        fullClap.meta.durationInMs = s.endTimeInMs
      }
    }

    const alreadyAnEmbeddedFinalVideo = fullClap.segments.filter(s =>
      s.category === ClapSegmentCategory.VIDEO &&
      s.status === ClapSegmentStatus.COMPLETED &&
      s.startTimeInMs === 0 &&
      s.endTimeInMs === fullClap.meta.durationInMs &&
      s.assetUrl).at(0)

    // inject the final mp4 video file into the .clap
    if (alreadyAnEmbeddedFinalVideo) {
      console.log(`editing the clap to update the final video`)
      alreadyAnEmbeddedFinalVideo.assetUrl = currentVideo
    } else {
      console.log(`editing the clap to add a new final video`)
      fullClap.segments.push(newSegment({
        category: ClapSegmentCategory.VIDEO,
        status: ClapSegmentStatus.COMPLETED,
        startTimeInMs: 0,
        endTimeInMs: fullClap.meta.durationInMs,
        assetUrl: currentVideo,
        assetDurationInMs: fullClap.meta.durationInMs,
        assetSourceType: getClapAssetSourceType(currentVideo),
        outputGain: 1.0,
      }))
    }
    const fullClapBlob: Blob = await serializeClap(fullClap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(fullClapBlob)
  
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

    const fullClap: ClapProject | undefined = await parseClap(blob)

    if (!fullClap) { throw new Error(`failed to import the clap`) }

    const storyPrompt = fullClap.meta.description.split("||").pop() || ""

    putTextInTextAreaElement(
      document.getElementById("story-prompt-draft") as HTMLTextAreaElement,
      storyPrompt
    )

    const imageRatio = parseImageRatio(fullClap.meta.imageRatio)

    fullClap.meta.height = imageRatio === ClapImageRatio.LANDSCAPE ? RESOLUTION_SHORT : RESOLUTION_LONG
    fullClap.meta.width = imageRatio === ClapImageRatio.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG

    const embeddedFinalVideoAssetUrl = fullClap.segments.filter(s =>
      s.category === ClapSegmentCategory.VIDEO &&
      s.status === ClapSegmentStatus.COMPLETED &&
      s.startTimeInMs === 0 &&
      s.endTimeInMs === fullClap.meta.durationInMs &&
      s.assetUrl).map(s => s.assetUrl).at(0)

    set({
      fullClap,
      storyPrompt,
      imageRatio,
      currentVideo: embeddedFinalVideoAssetUrl || get().currentVideo,
      currentImageRatio: imageRatio,
    })

    return {
      clap: fullClap,
      regenerateVideo: !embeddedFinalVideoAssetUrl,
    }
  },
}))