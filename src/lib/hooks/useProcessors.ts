"use client"

import React, { useTransition } from "react"
import { ClapProject, ClapSegmentCategory, getClapAssetSourceType, newEntity, updateClap } from "@aitube/clap"

import { logImage } from "@/lib/utils"
import { useIsBusy, useStoryPromptDraft } from "@/lib/hooks"

import { createClap } from "@/app/server/aitube/createClap"
import { editClapEntities } from "@/app/server/aitube/editClapEntities"
import { editClapDialogues } from "@/app/server/aitube/editClapDialogues"
import { editClapStoryboards } from "@/app/server/aitube/editClapStoryboards"
import { editClapSounds } from "@/app/server/aitube/editClapSounds"
import { editClapMusic } from "@/app/server/aitube/editClapMusic"
import { editClapVideos } from "@/app/server/aitube/editClapVideos"
import { exportClapToVideo } from "@/app/server/aitube/exportClapToVideo"

import { useStore } from "../../app/store"

export function useProcessors() {
  const { storyPromptDraft, setStoryPromptDraft, promptDraftRef } = useStoryPromptDraft()

  const [_isPending, startTransition] = useTransition()

  const mainCharacterImage = useStore(s => s.mainCharacterImage)
  const mainCharacterVoice = useStore(s => s.mainCharacterVoice)

  const currentClap = useStore(s => s.currentClap)
  const setStoryPrompt = useStore(s => s.setStoryPrompt)
  const setMainCharacterImage = useStore(s => s.setMainCharacterImage)
  const setMainCharacterVoice = useStore(s => s.setMainCharacterVoice)
  const setStatus = useStore(s => s.setStatus)

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
  const setCurrentClap = useStore(s => s.setCurrentClap)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)
  const setProgress = useStore(s => s.setProgress)

  const  { isBusy, busyRef } = useIsBusy()

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

      console.log(`handleSubmit(): received a clap = `, clap)

      console.log(`handleSubmit():  copying over entities from the previous clap`)

      console.log(`handleSubmit(): later we can add button(s) to clear the project and/or the character(s)`)
      const { currentClap } = useStore.getState()

      clap.entities = Array.isArray(currentClap?.entities) ? currentClap.entities : []

      setCurrentClap(clap)
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

      console.log(`handleSubmit(): received a clap with sound = `, clap)
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

      console.log(`handleSubmit(): received a clap with music = `, clap)
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
      console.log(`handleSubmit(): received storyboards = `, clap)

      setImageGenerationStatus("finished")
      console.log("---------------- GENERATED STORYBOARDS ----------------")
      clap.segments
        .filter(s => s.category === ClapSegmentCategory.STORYBOARD)
        .forEach((s, i) => {
          if (s.status === "completed" && s.assetUrl) {
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

      console.log(`handleSubmit(): received individual video clips = `, clap)
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

      console.log(`handleSubmit(): received dialogues = `, clap)
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
  
  const handleSubmit = async () => {
    setStatus("generating")
    busyRef.current = true

    startTransition(async () => {
      setStatus("generating")
      busyRef.current = true
  
      console.log(`handleSubmit(): generating a clap using prompt = "${promptDraftRef.current}" `)

      try {
        let clap = await generateStory()
        setCurrentClap(clap)

        const storyboards = clap.segments.filter(s => s.category === ClapSegmentCategory.STORYBOARD)

        let mainCharacter = clap.entities.at(0)

        // let's do something basic for now: we only support 1 entity (character)
        // and we apply it to *all* the storyboards (we can always improve this later)
        if (mainCharacter) {
          console.log(`handleSubmit(): we use the clap's main character's face on all storyboards`)
          storyboards.forEach(storyboard => { storyboard.entityId = mainCharacter!.id })
          logImage(mainCharacter.imageId, 0.35)
        } else if (mainCharacterImage) {
          console.log(`handleSubmit(): declaring a new entity for our main character`)
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
          console.log(`handleSubmit(): we use the main character's face on all storyboards`)
          
          storyboards.forEach(storyboard => { storyboard.entityId = mainCharacter!.id })
          logImage(mainCharacterImage, 0.35)
        }

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
          setCurrentClap(clap)
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
          console.log("handleSubmit(): User specified a main character image")
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
     
        
        
        console.log("final clap: ", clap)
        setCurrentClap(clap)
        await generateFinalVideo(clap)

        setStatus("finished")
        setError("")
      } catch (err) {
        console.error(`failed to generate: `, err)
        setStatus("error")
        setError(`Error, please contact an admin on Discord (${err})`)
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
    handleSubmit,
  }
}