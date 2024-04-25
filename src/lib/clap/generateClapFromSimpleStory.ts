import { newClap } from "./newClap"
import { newSegment } from "./newSegment"
import { ClapProject } from "./types"

let defaultSegmentDurationInMs = 2500 // 2584

const fishDemoStory = [
  "Siamese fighting fish, bokeh, underwater, coral, lively, bubbles, translucency, perfect",
  
  // this one is magnificient!
  "princess parrot fish, bokeh, underwater, coral, lively, bubbles, translucency, perfect",
  
  "pacific ocean perch, bokeh, underwater, coral, lively, bubbles, translucency, perfect",
  
  "Queen angelfish, bokeh, underwater, coral, lively, bubbles, translucency, perfect",
  
  "sea turtle, bokeh, underwater, coral, lively, bubbles, translucency, perfect",

  "hippocampus, bokeh, underwater, coral, lively, bubbles, translucency, perfect",
]

let demoStory = [
  ...fishDemoStory,

  // "portrait of one man news anchor, 60yo, thin, fit, american, mustache, beard, wearing a suit, medium-shot, central park, outside, serious, bokeh, perfect",
  
  // "screenshot from Call of Duty, FPS game, nextgen, videogame screenshot, unreal engine, raytracing, perfect",

  // "screenshot from a flight simulator, nextgen, videogame screenshot, unreal engine, raytracing, perfect",
  // "screenshot from fallout3, fallout4, western, wasteland, 3rd person RPG, nextgen, videogame screenshot, unreal engine, raytracing, perfect",
  // "portrait of single influencer woman, 30yo, thin, fit, american, wearing a red tshirt, medium-shot, central park, outside, serious, bokeh, perfect",
]


export function generateClapFromSimpleStory({
  story = demoStory,
  showIntroPoweredByEngine = false,
  showIntroDisclaimerAboutAI = false,
}: {
  story?: string[]
  showIntroPoweredByEngine?: boolean
  showIntroDisclaimerAboutAI?: boolean
} = {
  story: demoStory,
  showIntroPoweredByEngine: false,
  showIntroDisclaimerAboutAI: false,
}): ClapProject {

  const clap = newClap({
    meta: {
      title: "Interactive Demo",
      isInteractive: true,
      isLoop: true,
    }
  })

  let currentElapsedTimeInMs = 0
  let currentSegmentDurationInMs = defaultSegmentDurationInMs

  if (showIntroPoweredByEngine) {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "interface",
      prompt: "<BUILTIN:POWERED_BY_ENGINE>",
      label: "disclaimer",
      outputType: "interface",
    }))
    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  if (showIntroDisclaimerAboutAI) {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "interface",
      prompt: "<BUILTIN:DISCLAIMER_ABOUT_AI>",
      label: "disclaimer",
      outputType: "interface",
    }))
    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  /*
  clap.segments.push(
    newSegment({
      // id: string
      // track: number
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "interface",
      // modelId: string
      // sceneId: string
      prompt: "a hello world",
      label: "hello world",
      outputType: "interface"
      // renderId: string
      // status: ClapSegmentStatus
      // assetUrl: string
      // assetDurationInMs: number
      // createdBy: ClapAuthor
      // editedBy: ClapAuthor
      // outputGain: number
      // seed: number
    })
  )

  currentElapsedTimeInMs += currentSegmentDurationInMs
  */
  
 

  for (let prompt of story) {

    clap.segments.push(newSegment({
      track: 0,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "video",
      prompt: "",
      label: "video",
      outputType: "video",
    }))
    clap.segments.push(newSegment({
      track: 1,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "generic",
      prompt,
      label: prompt,
      outputType: "text",
    }))
    clap.segments.push(newSegment({
      track: 2,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "camera",
      prompt: "medium-shot",
      label: "medium-shot",
      outputType: "text",
    }))

    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  clap.meta.durationInMs = currentElapsedTimeInMs

  return clap
}