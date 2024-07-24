"use client"

import React, { useState, useTransition } from "react"
import { ClapProject, ClapSegmentCategory, ClapSegmentStatus, filterAssets, getClapAssetSourceType, newEntity, parseClap, serializeClap, updateClap } from "@aitube/clap"

import { logImage } from "@/lib/utils"
import { useIsBusy, useStoryPromptDraft } from "@/lib/hooks"
import { isRateLimitError } from "@/lib/utils/isRateLimitError"
import { useToast } from "@/components/ui/use-toast"

import { createClap } from "@/app/server/aitube/createClap"
import { editClapEntities } from "@/app/server/aitube/editClapEntities"
import { editClapDialogues } from "@/app/server/aitube/editClapDialogues"
import { editClapStory } from "@/app/server/aitube/editClapStory"
import { editClapStoryboards } from "@/app/server/aitube/editClapStoryboards"
import { editClapSounds } from "@/app/server/aitube/editClapSounds"
import { editClapMusic } from "@/app/server/aitube/editClapMusic"
import { editClapVideos } from "@/app/server/aitube/editClapVideos"
import { exportClapToVideo } from "@/app/server/aitube/exportClapToVideo"

import { useStore } from "../../app/store"
import { useOAuth } from "../oauth/useOAuth"
import { removeFinalVideos } from "../utils/removeFinalVideos"

export function useProcessors() {
  const [isLocked, setLocked] = useState(false)
  
  const { storyPromptDraft, setStoryPromptDraft, promptDraftRef } = useStoryPromptDraft()

  const [_isPending, startTransition] = useTransition()

  const mainCharacterImage = useStore(s => s.mainCharacterImage)
  const mainCharacterVoice = useStore(s => s.mainCharacterVoice)

  const skeletonClap = useStore(s => s.skeletonClap)
  const fullClap = useStore(s => s.fullClap)
  const setSkeletonClap = useStore(s => s.setSkeletonClap)
  const setStoryPrompt = useStore(s => s.setStoryPrompt)
  const setMainCharacterImage = useStore(s => s.setMainCharacterImage)
  const setMainCharacterVoice = useStore(s => s.setMainCharacterVoice)
  const setStatus = useStore(s => s.setStatus)
  const setShowAuthWall = useStore(s => s.setShowAuthWall)

  const error = useStore(s => s.error)
  const setError = useStore(s => s.setError)
  const setParseGenerationStatus = useStore(s => s.setParseGenerationStatus)
  const setStoryGenerationStatus = useStore(s => s.setStoryGenerationStatus)
  const setAssetGenerationStatus = useStore(s => s.setAssetGenerationStatus)
  const setSoundGenerationStatus = useStore(s => s.setSoundGenerationStatus)
  const setMusicGenerationStatus = useStore(s => s.setMusicGenerationStatus)
  const setVoiceGenerationStatus = useStore(s => s.setVoiceGenerationStatus)
  const setImageGenerationStatus = useStore(s => s.setImageGenerationStatus)
  const setVideoGenerationStatus = useStore(s => s.setVideoGenerationStatus)
  const setFinalGenerationStatus = useStore(s => s.setFinalGenerationStatus)
  const setFullClap = useStore(s => s.setFullClap)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)
  const setProgress = useStore(s => s.setProgress)

  const { isLoggedIn, enableOAuthWall } = useOAuth()

  const  { isBusy, busyRef } = useIsBusy()

  const { toast } = useToast()

  const generateStory = async (): Promise<ClapProject> => {

    let clap: ClapProject | undefined = undefined
    try {
      setProgress(0)

      setStatus("generating")
      setStoryGenerationStatus("generating")
      setStoryPrompt(promptDraftRef.current)

      clap = await createClap({
        prompt: promptDraftRef.current,
        orientation: useStore.getState().orientation,

        turbo: false,
      })

      if (!clap) { throw new Error(`failed to create the clap`) }

      if (clap.segments.length <= 1) { throw new Error(`failed to generate more than one segments`) }

      console.log(`generateStory(): received a clap = `, clap)

      console.log(`generateStory():  copying over entities from the previous clap`)

      console.log(`generateStory(): later we can add button(s) to clear the project and/or the character(s)`)
      const { fullClap } = useStore.getState()

      clap.entities = Array.isArray(fullClap?.entities) ? fullClap.entities : []

      setFullClap(clap)
      setStoryGenerationStatus("finished")

      console.log("---------------- GENERATED STORY ----------------")
      console.table(clap.segments, [
        // 'startTimeInMs',
        'endTimeInMs',
        // 'track',
        'category',
        'prompt'
      ])
      return clap
    } catch (err) {
      setStoryGenerationStatus("error")
      throw err
    }
  }

  const extendStory = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      setStoryGenerationStatus("generating")

      const prompt = promptDraftRef.current.slice(0, 1024)

      clap = await editClapStory({
        clap,
        prompt,
        // startTimeInMs: 0,
        // endTimeInMs: 0,
        // generating entities requires a "smart" LLM
        turbo: false,
        // turbo: true,
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to create the clap`) }

      if (clap.segments.length <= 1) { throw new Error(`failed to generate more than one segments`) }

      console.log(`generateStory(): received a clap with more shots = `, clap)

      setFullClap(clap)
      setStoryGenerationStatus("finished")

      console.log("---------------- EXTENDED STORY ----------------")
      console.table(clap.segments, [
        // 'startTimeInMs',
        'endTimeInMs',
        // 'track',
        'category',
        'prompt'
      ])
      return clap
    } catch (err) {
      setStoryGenerationStatus("error")
      throw err
    }
  }

  const generateEntities = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(20)
      setAssetGenerationStatus("generating")
      clap = await editClapEntities({
        clap,

        // generating entities requires a "smart" LLM
        turbo: false,
        // turbo: true,
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the entities`) }

      console.log(`generateEntities(): received entities = `, clap)

      if (mainCharacterImage) {
        // we assume the main entity is the first one
        let mainEntity = clap.entities.at(0)
      
        if (mainEntity) {
          console.log(`generateEntities(): replacing the main character's picture..`)
          mainEntity.thumbnailUrl = mainCharacterImage
          mainEntity.imagePrompt = ""
          mainEntity.imageSourceType = getClapAssetSourceType(mainCharacterImage)
          mainEntity.imageEngine = "" 
          mainEntity.imageId = mainCharacterImage
        }
      }

      setAssetGenerationStatus("finished")
      console.log("---------------- GENERATED ENTITIES ----------------")
      console.table(clap.entities, [
        'category',
        'label',
        'imagePrompt',
        'appearance'
      ])
      return clap
    } catch (err) {
      setAssetGenerationStatus("error")
      throw err
    }
  }

  const generateSounds = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(30)
      setSoundGenerationStatus("generating")

      clap = await editClapSounds({
        clap,
        turbo: false,
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the sound`) }

      // console.log(`generateSounds(): received a clap with sound = `, clap)
      setSoundGenerationStatus("finished")
      console.log("---------------- GENERATED SOUND ----------------")
      console.table(clap.segments.filter(s => s.category === ClapSegmentCategory.SOUND), [
        'endTimeInMs',
        'prompt',
        'entityId',
      ])
      return clap
    } catch (err) {
      setSoundGenerationStatus("error")
      throw err
    }
  }

  const generateMusic = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(30)
      setMusicGenerationStatus("generating")

      clap = await editClapMusic({
        clap,
        turbo: false,
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the music`) }

      // console.log(`generateMusic(): received a clap with music = `, clap)
      setMusicGenerationStatus("finished")
      console.log("---------------- GENERATED MUSIC ----------------")
      console.table(clap.segments.filter(s => s.category === ClapSegmentCategory.MUSIC), [
        'endTimeInMs',
        'prompt',
        'entityId',
      ])
      return clap
    } catch (err) {
      setMusicGenerationStatus("error")
      throw err
    }
  }

  const generateStoryboards = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(40)
      setImageGenerationStatus("generating")
      clap = await editClapStoryboards({
        clap,
        // if we use entities, then we MUST use turbo
        // that's because turbo uses PulID,
        // but SDXL doesn't
        turbo: false,
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the storyboards`) }

      // const fusion = 
      console.log(`generateStoryboards(): received storyboards = `, clap)

      setImageGenerationStatus("finished")
      console.log("---------------- GENERATED STORYBOARDS ----------------")
      clap.segments
        .filter(s => s.category === ClapSegmentCategory.STORYBOARD)
        .forEach((s, i) => {
          if (s.status === ClapSegmentStatus.COMPLETED && s.assetUrl) {
            // console.log(`  [${i}] storyboard: ${s.prompt}`)
            logImage(s.assetUrl, 0.35)
          } else {
            console.log(`  [${i}] failed to generate storyboard`)
          }
          // console.log(`------------------`)
        })
      console.table(clap.segments.filter(s => s.category === ClapSegmentCategory.STORYBOARD), [
        'endTimeInMs',
        'prompt',
        'assetUrl'
      ])
      return clap
    } catch (err) {
      setImageGenerationStatus("error")
      throw err
    }
  }

  const generateVideos = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(50)
      setVideoGenerationStatus("generating")

      clap = await editClapVideos({
        clap,
        turbo: false
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the videos`) }

      console.log(`handleCreateStory(): received individual video clips = `, clap)
      setVideoGenerationStatus("finished")
      console.log("---------------- GENERATED VIDEOS ----------------")
      console.table(clap.segments.filter(s => s.category === ClapSegmentCategory.VIDEO), [
        'endTimeInMs',
        'prompt',
        'entityId',
      ])
      return clap
    } catch (err) {
      setVideoGenerationStatus("error")
      throw err
    }
  }

  const generateStoryboardsThenVideos = async (clap: ClapProject): Promise<ClapProject> => {
    clap = await generateStoryboards(clap)
    clap = await generateVideos(clap)
    return clap
  }


  const generateDialogues = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(70)
      setVoiceGenerationStatus("generating")
      clap = await editClapDialogues({
        clap,
        turbo: false,
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the dialogues`) }

      console.log(`generateDialogues(): received dialogues = `, clap)
      setVoiceGenerationStatus("finished")
      console.log("---------------- GENERATED DIALOGUES ----------------")
      console.table(clap.segments.filter(s => s.category === ClapSegmentCategory.DIALOGUE), [
        'endTimeInMs',
        'prompt',
        'entityId',
      ])
      return clap
    } catch (err) {
      setVoiceGenerationStatus("error")
      throw err
    }
  }

  const generateFinalVideo = async (clap: ClapProject): Promise<string> => {

    let assetUrl = ""
    try {
      // setProgress(85)
      setFinalGenerationStatus("generating")
      assetUrl = await exportClapToVideo({
        clap,
        turbo: false,
      })

      setCurrentVideo(assetUrl)

      if (assetUrl.length < 128) { throw new Error(`generateFinalVideo(): the generated video is too small, so we failed`) }

      console.log(`generateFinalVideo(): received a video: ${assetUrl.slice(0, 120)}...`)
      setFinalGenerationStatus("finished")
      return assetUrl
    } catch (err) {
      setFinalGenerationStatus("error")
      throw err
    }
  }
  
  const injectCharacters = async (clap: ClapProject): Promise<void> => {
    const storyboards = clap.segments.filter(s => s.category === ClapSegmentCategory.STORYBOARD)

    let mainCharacter = clap.entities.at(0)

    // let's do something basic for now: we only support 1 entity (character)
    // and we apply it to *all* the storyboards (we can always improve this later)
    if (mainCharacter) {
      console.log(`injectCharacters(): we use the clap's main character's face on all storyboards`)
      storyboards.forEach(storyboard => { storyboard.entityId = mainCharacter!.id })
      logImage(mainCharacter.imageId, 0.35)
    } else if (mainCharacterImage) {
      console.log(`injectCharacters(): declaring a new entity for our main character`)
      const entityName = "person"
      mainCharacter = newEntity({
        category: ClapSegmentCategory.CHARACTER,
        triggerName: entityName,
        label: entityName,
        description: entityName,
        author: "auto",
        thumbnailUrl: mainCharacterImage,
  
        imagePrompt: "",
        imageSourceType: getClapAssetSourceType(mainCharacterImage),
        imageEngine: "", 
        imageId: mainCharacterImage,
        audioPrompt: "",
      })

      clap.entities.push(mainCharacter!)
      console.log(`injectCharacters(): we use the main character's face on all storyboards`)
      
      storyboards.forEach(storyboard => { storyboard.entityId = mainCharacter!.id })
      logImage(mainCharacterImage, 0.35)
    }
  }

  const handleCreateStory = async () => {

    if (busyRef.current) { return }

    if (enableOAuthWall && !isLoggedIn) {
      setShowAuthWall(true)
      return
    }

    setStatus("generating")
    busyRef.current = true

    startTransition(async () => {
      setStatus("generating")
      busyRef.current = true
  
      console.log(`handleCreateStory(): generating a clap using prompt = "${promptDraftRef.current}" `)

      try {
        let clap = await generateStory()
        setFullClap(clap)

        await injectCharacters(clap)

        const tasks = [
          generateMusic(clap),
          generateStoryboardsThenVideos(clap)
        ]

        const claps = await Promise.all(tasks)

        console.log(`finished processing ${tasks.length} tasks in parallel`)

        for (const newerClap of claps) {
          clap = await updateClap(clap, newerClap, {
            overwriteMeta: false,
            inlineReplace: true,
          })
          setFullClap(clap)
        }

        /*
        clap = await claps.reduce(async (existingClap, newerClap) =>
          updateClap(existingClap, newerClap, {
            overwriteMeta: false,
            inlineReplace: true,
          })
        , Promise.resolve(clap)
        */

       
        // We can't have consistent characters with video (yet)
        // clap = await generateEntities(clap)

        /*
        if (mainCharacterImage) {
          console.log("handleCreateStory(): User specified a main character image")
          // various strategies here, for instance we can assume that the first character is the main character,
          // or maybe a more reliable way is to count the number of occurrences.
          // there is a risk of misgendering, so ideally we should add some kind of UI to do this,
          // such as a list of characters.
        }
        */

        // let's skip storyboards for now
        // clap = await generateStoryboards(clap)

        // clap = await generateVideos(clap)
        // clap = await generateDialogues(clap)
     
        
        
        console.log("handleCreateStory(): final clap: ", clap)
        setFullClap(clap)
        await generateFinalVideo(clap)

        setStatus("finished")
        setError("")
      } catch (err) {

        if (isRateLimitError(err)) {
          console.error("Critical error: you are doing too many requests!")
          toast({
            title: "You can generate only one video per minute 👀",
            description: "Don't send too many requests at once 🤗",
          })
          return
        } else {
          console.error(err)
          toast({
            title: "We couldn't generate this video 👀",
            description: "We are currently experiencing a surge in traffic, please try later in the day 🤗",
          })
        }

      }
    })
  }

  const handleExtendStory = async () => {

    if (busyRef.current) { return }

    if (enableOAuthWall && !isLoggedIn) {
      setShowAuthWall(true)
      return
    }

    setStatus("generating")
    busyRef.current = true

    startTransition(async () => {
      setStatus("generating")
      setProgress(0)
      busyRef.current = true
  
      let { fullClap } = useStore.getState()

      if (!fullClap) {
        setStatus("error")
        setError(`cannot extend the story if there is no current clap file`)
        return
      }

      try {
        console.log(`handleExtendStory(): we strip the clap from its final video (don't worry, it will be re-generated)`)
    
        fullClap.segments = removeFinalVideos(fullClap)

        let clap = await extendStory(fullClap)

        if (!clap) {
          setStatus("error")
          setError(`failed to extend the story (received an empty clap)`)
          return
        }

        await injectCharacters(clap)

        console.log(`handleExtendStory(): new clap with extended story = `, clap)

        const tasks = [
          generateMusic(clap),
          generateStoryboardsThenVideos(clap)
        ]

        const claps = await Promise.all(tasks)

        console.log(`finished processing ${tasks.length} tasks in parallel`)

        for (const newerClap of claps) {
          clap = await updateClap(clap, newerClap, {
            overwriteMeta: false,
            inlineReplace: true,
          })
          setFullClap(clap)
        }

        console.log("handleExtendStory(): calling generateFinalVideo(clap)")
            
        await generateFinalVideo(clap)

        setFullClap(clap)

        setStatus("finished")
        setError("")
      } catch (err) {
        console.error(`handleExtendStory(): error: ${err}`)
        setStoryGenerationStatus("error")
        setStatus("error")
      } finally {
        busyRef.current = false
      }
    })
  }
  
  return {
    generateDialogues,
    generateEntities,
    generateFinalVideo,
    generateMusic,
    generateSounds,
    generateStory,
    generateStoryboards,
    generateStoryboardsThenVideos,
    generateVideos,
    handleCreateStory,
    handleExtendStory,
  }
}