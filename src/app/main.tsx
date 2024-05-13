"use client"

import React, { useEffect, useRef, useTransition } from 'react'
import { IoMdPhonePortrait } from 'react-icons/io'
import { GiRollingDices } from 'react-icons/gi'
import { FaCloudDownloadAlt } from "react-icons/fa"
import { useLocalStorage } from "usehooks-ts"
import { ClapProject, ClapMediaOrientation, ClapSegmentCategory, updateClap } from '@aitube/clap'
import Image from 'next/image'
import { useFilePicker } from 'use-file-picker'
import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { TextareaField } from '@/components/form/textarea-field'
import { cn } from '@/lib/utils/cn'

import { createClap } from './server/aitube/createClap'
import { editClapEntities } from './server/aitube/editClapEntities'
import { editClapDialogues } from './server/aitube/editClapDialogues'
import { editClapStoryboards } from './server/aitube/editClapStoryboards'
import { editClapMusic } from './server/aitube/editClapMusic'
import { editClapVideos } from './server/aitube/editClapVideos'
import { exportClapToVideo } from './server/aitube/exportClapToVideo'

import { useStore } from './store'
import HFLogo from "./hf-logo.svg"
import { Input } from '@/components/ui/input'
import { Field } from '@/components/form/field'
import { Label } from '@/components/form/label'
import { getParam } from '@/lib/utils/getParam'
import { GenerationStage } from '@/types'
import { FileContent } from 'use-file-picker/dist/interfaces'
import { generateRandomStory } from '@/lib/utils/generateRandomStory'

export function Main() {
  const [storyPromptDraft, setStoryPromptDraft] = useLocalStorage<string>(
    "AI_STORIES_FACTORY_STORY_PROMPT_DRAFT",
    "Yesterday I was walking in SF when I saw a zebra"
  )
  const promptDraftRef = useRef("")
  promptDraftRef.current = storyPromptDraft

  const [_isPending, startTransition] = useTransition()

  const storyPrompt = useStore(s => s.storyPrompt)
  const mainCharacterImage = useStore(s => s.mainCharacterImage)
  const mainCharacterVoice = useStore(s => s.mainCharacterVoice)
  const orientation = useStore(s => s.orientation)
  const status = useStore(s => s.status)
  const parseGenerationStatus = useStore(s => s.parseGenerationStatus)
  const storyGenerationStatus = useStore(s => s.storyGenerationStatus)
  const assetGenerationStatus = useStore(s => s.assetGenerationStatus)
  const musicGenerationStatus = useStore(s => s.musicGenerationStatus)
  const voiceGenerationStatus = useStore(s => s.voiceGenerationStatus)
  const imageGenerationStatus = useStore(s => s.imageGenerationStatus)
  const videoGenerationStatus = useStore(s => s.videoGenerationStatus)
  const finalGenerationStatus = useStore(s => s.finalGenerationStatus)
  const currentClap = useStore(s => s.currentClap)
  const currentVideo = useStore(s => s.currentVideo)
  const currentVideoOrientation = useStore(s => s.currentVideoOrientation)
  const setStoryPrompt = useStore(s => s.setStoryPrompt)
  const setMainCharacterImage = useStore(s => s.setMainCharacterImage)
  const setMainCharacterVoice = useStore(s => s.setMainCharacterVoice)
  const setStatus = useStore(s => s.setStatus)
  const toggleOrientation = useStore(s => s.toggleOrientation)
  const error = useStore(s => s.error)
  const setError = useStore(s => s.setError)
  const setParseGenerationStatus = useStore(s => s.setParseGenerationStatus)
  const setStoryGenerationStatus = useStore(s => s.setStoryGenerationStatus)
  const setAssetGenerationStatus = useStore(s => s.setAssetGenerationStatus)
  const setMusicGenerationStatus = useStore(s => s.setMusicGenerationStatus)
  const setVoiceGenerationStatus = useStore(s => s.setVoiceGenerationStatus)
  const setImageGenerationStatus = useStore(s => s.setImageGenerationStatus)
  const setVideoGenerationStatus = useStore(s => s.setVideoGenerationStatus)
  const setFinalGenerationStatus = useStore(s => s.setFinalGenerationStatus)
  const setCurrentClap = useStore(s => s.setCurrentClap)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)
  const progress = useStore(s => s.progress)
  const setProgress = useStore(s => s.setProgress)
  const saveVideo = useStore(s => s.saveVideo)
  const saveClap = useStore(s => s.saveClap)
  const loadClap = useStore(s => s.loadClap)

  // let's disable this for now
  const canSeeBetaFeatures = false // true // getParam<boolean>("beta", false)

  const isBusy = useStore(s => s.isBusy)

  const importStory = async (fileData: FileContent<ArrayBuffer>): Promise<ClapProject> => {
    if (!fileData?.name) { throw new Error(`invalid file (missing file name)`) }

    const {
      setStatus,
      setProgress,
      setParseGenerationStatus,
    } = useStore.getState()

    let clap: ClapProject | undefined = undefined

    setParseGenerationStatus("generating")

    try {
      const blob = new Blob([fileData.content])
      clap = await loadClap(blob, fileData.name)

      if (!clap) { throw new Error(`failed to load the clap file`) }
      setParseGenerationStatus("finished")
      setCurrentClap(clap)
      return clap
    } catch (err) {
      console.error("failed to load the Clap file:", err)
      setParseGenerationStatus("error")
      throw err
    }
  }


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

        turbo: true,
      })

      if (!clap) { throw new Error(`failed to create the clap`) }

      if (clap.segments.length <= 1) { throw new Error(`failed to generate more than one segments`) }

      console.log(`handleSubmit(): received a clap = `, clap)
      setCurrentClap(clap)
      setStoryGenerationStatus("finished")

      console.log("-------- GENERATED STORY --------")
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
      })

      if (!clap) { throw new Error(`failed to edit the entities`) }

      console.log(`handleSubmit(): received a clap with entities = `, clap)
      setCurrentClap(clap)
      setAssetGenerationStatus("finished")
      console.log("-------- GENERATED ENTITIES --------")
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


  const generateMusic = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(30)
      setMusicGenerationStatus("generating")

      clap = await editClapMusic({
        clap,
        turbo: true
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the music`) }

      console.log(`handleSubmit(): received a clap with music = `, clap)
      setCurrentClap(clap)
      setMusicGenerationStatus("finished")
      console.log("-------- GENERATED MUSIC --------")
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
        // the turbo is mandatory here,
        // since this uses a model with character consistency,
        // which is not the case for the non-turbo one
        turbo: true
      }).then(r => r.promise)

      if (!clap) { throw new Error(`failed to edit the storyboards`) }

      // const fusion = 
      console.log(`handleSubmit(): received a clap with images = `, clap)
      setCurrentClap(clap)
      setImageGenerationStatus("finished")
      console.log("-------- GENERATED STORYBOARDS --------")
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

      console.log(`handleSubmit(): received a clap with videos = `, clap)
      setCurrentClap(clap)
      setVideoGenerationStatus("finished")
      console.log("-------- GENERATED VIDEOS --------")
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

  const generateDialogues = async (clap: ClapProject): Promise<ClapProject> => {
    try {
      // setProgress(70)
      setVoiceGenerationStatus("generating")
      clap = await editClapDialogues({
        clap,
        turbo: true
      })

      if (!clap) { throw new Error(`failed to edit the dialogues`) }

      console.log(`handleSubmit(): received a clap with dialogues = `, clap)
      setCurrentClap(clap)
      setVoiceGenerationStatus("finished")
      console.log("-------- GENERATED DIALOGUES --------")
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
        turbo: true
      })

      setCurrentVideo(assetUrl)

      if (assetUrl.length < 128) { throw new Error(`handleSubmit(): the generated video is too small, so we failed`) }

      console.log(`handleSubmit(): received a video: ${assetUrl.slice(0, 60)}...`)
      setFinalGenerationStatus("finished")
      return assetUrl
    } catch (err) {
      setFinalGenerationStatus("error")
      throw err
    }
  }
  
  const handleSubmit = async () => {

    startTransition(async () => {
      console.log(`handleSubmit(): generating a clap using prompt = "${promptDraftRef.current}" `)

      try {
        let clap = await generateStory()
        
        const claps = await Promise.all([
          generateMusic(clap),
          generateVideos(clap)
        ])

        console.log("finished processing the 2 tasks in parallel")

        for (const newerClap of claps) {
          clap = await updateClap(clap, newerClap, {
            overwriteMeta: false,
            inlineReplace: true,
          })
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


  const { openFilePicker, filesContent } = useFilePicker({
    accept: '.clap',
    readAs: "ArrayBuffer"
  })
  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      if (!fileData?.name) { return }

      const { setStatus, setProgress } = useStore.getState()

      setProgress(0)
      setStatus("generating")

      try {
        let clap = await importStory(fileData)
             
        const claps = await Promise.all([
          generateMusic(clap),
          generateVideos(clap)
        ])

        // console.log("finished processing the 2 tasks in parallel")

        for (const newerClap of claps) {
          clap = await updateClap(clap, newerClap, {
            overwriteMeta: false,
            inlineReplace: true,
          })
        }

        await generateFinalVideo(clap)

        setStatus("finished")
        setProgress(100)
        setError("")
      } catch (err) {
        console.error(`failed to import: `, err)
        setStatus("error")
        setError(`${err}`)
      }
     
    }
    fn()
  }, [fileData?.name])
  
  // note: we are interested in the *current* video orientation,
  // not the requested video orientation requested for the next video
  const isLandscape = currentVideoOrientation === ClapMediaOrientation.LANDSCAPE
  const isPortrait = currentVideoOrientation === ClapMediaOrientation.PORTRAIT
  const isSquare = currentVideoOrientation === ClapMediaOrientation.SQUARE

  const runningRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const timerFn = async () => {
    const { isBusy, progress, stage } = useStore.getState()

    clearTimeout(timerRef.current)
    if (!isBusy || stage === "idle") {
      return
    }

    /*
    console.log("progress function:", {
      stage,
      delay: progressDelayInMsPerStage[stage],
      progress,
    })
    */
    useStore.setState({
      // progress: Math.min(maxProgressPerStage[stage], progress + 1) 
      progress: Math.min(100, progress + 1) 
    })

    // timerRef.current = setTimeout(timerFn, progressDelayInMsPerStage[stage])
    timerRef.current = setTimeout(timerFn, 1000)
  }

  useEffect(() => {
    timerFn()
    clearTimeout(timerRef.current)
    if (!isBusy) { return }
    timerRef.current = setTimeout(timerFn, 0)
  }, [isBusy])

  return (
    <div className={cn(
      `fixed`,
      // `bg-zinc-800`,
      // old style, more "amber"
      // `bg-gradient-to-br from-amber-600 to-yellow-500`, 

      // nice style!
      // `bg-gradient-to-br from-amber-700 to-yellow-300`, 

      // warm orange, a bit flash but not bad, not bad at all
      // `bg-gradient-to-br from-orange-700 to-yellow-400`, 
   
      // nice "AiTube" vibe
      // `bg-gradient-to-br from-red-700 to-yellow-400`, 
   
      // pretty cool lime!
      `bg-gradient-to-br from-lime-700 to-yellow-400`, 

      // new style, pretty "fresh" - maybe too bright? 
      // use a dark logo for this one
      // `bg-gradient-to-br from-yellow-200 to-yellow-500`, 
      
      // too pastel
      // `bg-gradient-to-br from-yellow-200 to-red-300`, 
      
      // `bg-gradient-to-br from-sky-400 to-sky-300/30`, 
      `w-screen h-full overflow-y-scroll md:overflow-hidden`,
    )}
    style={{ boxShadow: "inset 0 0px 250px 0 rgb(0 0 0 / 60%)" }}>
      <div className="flex flex-col w-screen h-screen">
        <div className="
        flex flex-col md:flex-row w-full
        items-center md:justify-center
        flex-1
        "
        >
          <div className={cn(
            `flex flex-col md:h-full md:items-center md:justify-center`,
            `w-full md:w-1/2`,
            `transition-all duration-200 ease-in-out`,
            `ml-0`,
            `pt-4 sm:pt-0`,
          )}>
            <Card className={cn(
             //  `shadow-2xl z-30 rounded-3xl`,
             `shadow-none`,
             `w-full md:ml-[12%] md:w-[95%]`,
              `transition-all duration-200 ease-in-out`,
              `bg-transparent dark:bg-transparent`,
             // `backdrop-blur-2xl dark:backdrop-blur-2xl`,
              // `bg-amber-500 dark:bg-amber-500`,
                   
              `border-transparent`,
              // `bg-stone-50/90 dark:bg-stone-50/90`,
              // `border-yellow-100 dark:border-yellow-100`,
              // `bg-yellow-500 dark:bg-yellow-500`,
              // `border-yellow-400 dark:border-yellow-400`,

            )}>
              <CardHeader>
                <div className="flex flex-col justify-start">
                  <div className="
                    flex flex-row
                    items-center justify-center
                    transition-all duration-200 ease-in-out
                    px-3
                    
                    rounded-full">
                    <div
                    className="
                      flex
                      transition-all duration-200 ease-in-out
                      items-center justify-center text-center
                      w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
                      text-3xl md:text-4xl lg:text-5xl
                      rounded-lg
                      mr-2
                      font-sans
                      bg-amber-400 dark:bg-amber-400
                     
                      text-stone-950/80 dark:text-stone-950/80 font-bold
                      "
                      >AI</div>
                      <div
                        className="
                        transition-all duration-200 ease-in-out
                        text-amber-400 dark:text-amber-400
                        text-3xl md:text-4xl lg:text-5xl
                        "

                        style={{ textShadow: "#00000035 0px 0px 2px" }}
                    
                        /*
                        className="
                        text-5xl
                        bg-gradient-to-br from-yellow-300 to-yellow-500
                        inline-block text-transparent bg-clip-text
                        py-6
                        "
                        */
                      >Stories Factory</div>
                    </div>

                    <p
                      className="
                      transition-all duration-200 ease-in-out
                      text-stone-900/90 dark:text-stone-100/90
                      text-lg md:text-xl lg:text-2xl
                      text-center 
                      pt-2 md:pt-4
                      "
                      style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}
                    >Make video stories using AI ✨</p>
                  </div>
                </CardHeader>
                <CardContent
                  className="flex flex-col space-y-3"
                  >
                  
                  {/* LEFT MENU BUTTONS + MAIN PROMPT INPUT */}
                  <div className="flex flex-row space-x-3 w-full">
                  
                 
                    {/*

                    TODO: To finish by Julian a bit later

                    <div className="
                      flex flex-col
                      
                      w-32 bg-yellow-600
                      transition-all duration-200 ease-in-out
                      space-y-2 md:space-y-4
                    ">
                       <Input
                          type="file"
                          className=""
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              const newImageBase64 = await fileToBase64(file)
                              setMainCharacterImage(newImageBase64)
                            }
                          }}
                          accept="image/*"
                        />
                    </div>
                    */}

                    {/* MAIN PROMPT INPUT */}
                    <div className="
                      flex flex-col
                      flex-1
                      transition-all duration-200 ease-in-out
                      space-y-2 md:space-y-4
                    ">
                      <TextareaField
                        id="story-prompt-draft"
                        // label="My story:"
                        // disabled={modelState != 'ready'}
                        onChange={(e) => {
                          setStoryPromptDraft(e.target.value)
                          promptDraftRef.current = e.target.value
                        }}
                        placeholder="Yesterday I was at my favorite pizza place and.."
                        inputClassName="
                        transition-all duration-200 ease-in-out
                        h-32 md:h-56 lg:h-64
                     
                        "
                        disabled={isBusy}
                        value={storyPromptDraft}
                      />
     
                    
                    {/* END OF MAIN PROMPT INPUT */}
                    </div>

                    {/* END OF LEFT MENU BUTTONS + MAIN PROMPT INPUT */}
                  </div>

                  {/* ACTION BAR */}

                  <div className="
                    w-full
                    flex flex-row
                    justify-between items-center
                    space-x-3">
              
                    {/*
                      <Button
                        onClick={() => load()}
                        disabled={isBusy}
                        // variant="ghost"
                        className={cn(
                          `text-sm md:text-base lg:text-lg`,
                          `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
                          `font-bold`,
                          `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
                          storyPromptDraft ? "opacity-100" : "opacity-80"
                        )}
                      >
                       <span className="mr-1">Load project</span>
                      </Button>
                    */}

                    <div className="
               
                    flex flex-row
                    justify-between items-center
                    space-x-3">
                      
                    {/*
                    <Button
                      onClick={openFilePicker}
                      disabled={isBusy}
                      // variant="ghost"
                      className={cn(
                        `text-sm md:text-base lg:text-lg`,
                        `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
                        `font-bold`,
                        `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
                        storyPromptDraft ? "opacity-100" : "opacity-80"
                      )}
                    >
                      <span className="hidden xl:inline mr-1">Load</span>
                      <span className="inline xl:hidden mr-1">Load</span>
                    </Button>
                    */}
   
  
                    {canSeeBetaFeatures ?
                    <Button
                      onClick={() => saveClap()}
                      disabled={!currentClap || isBusy}
                      // variant="ghost"
                      className={cn(
                        `text-sm md:text-base lg:text-lg`,
                        `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
                        `font-bold`,
                        `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
                        storyPromptDraft ? "opacity-100" : "opacity-80"
                      )}
                    >
                      <span className="hidden xl:inline mr-1">Save</span>
                      <span className="inline xl:hidden mr-1">Save</span>
                    </Button> : <div></div>
                    }
                    </div>
  
                    <div className=" 
                    flex flex-row
                    justify-between items-center
                    space-x-3
                    select-none
                    ">

 
                      {/* RANDOMNESS SWITCH */}
                      <div className=" 
                      flex flex-row
                      justify-between items-center
                      cursor-pointer
                      transition-all duration-150 ease-in-out
                      hover:scale-110 active:scale-150
                     text-stone-800
                      hover:text-stone-950
                      active:text-black
                      group
                      "
                      onClick={() => {
                        const randomStory = generateRandomStory()
                        setStoryPromptDraft(randomStory)
                        promptDraftRef.current = randomStory
                      }}>
                        <div>
                        </div>
                        <div className="
                        w-6 h-8
                        flex flex-row items-center justify-center
                        transition-all duration-150 ease-out
                        group-hover:animate-swing
                        "
                        >
                          <GiRollingDices size={24} />
                        </div>
                      </div>
                      {/* END OF RANDOMNESS SWITCH */}


                      {/* ORIENTATION SWITCH */}
                      <div className=" 
                      flex flex-row
                      justify-between items-center
                      cursor-pointer
                      transition-all duration-150 ease-out
                      hover:scale-110 active:scale-150
                      text-stone-800
                      hover:text-stone-950
                      active:text-black
                      group
                      "
                      onClick={() => toggleOrientation()}>
                        <div>
                        </div>
                        <div className="
                        w-8 h-8
                        flex flex-row items-center justify-center
                        transition-all duration-150 ease-in-out
                        group-hover:animate-swing
                        "
                        >
                          <div className={cn(
                            `transition-all duration-200 ease-in-out`,
                            orientation === ClapMediaOrientation.LANDSCAPE ? `rotate-90` : `rotate-0`
                          )}>
                            <IoMdPhonePortrait size={24} />
                          </div>
                        </div>
                      </div>
                      {/* END OF ORIENTATION SWITCH */}
                      <Button
                        onClick={handleSubmit}
                        disabled={!storyPromptDraft || isBusy}
                        // variant="ghost"
                        className={cn(
                          `text-base md:text-lg lg:text-xl xl:text-2xl`,
                          `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
                          `font-bold`,
                          `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
                          storyPromptDraft ? "opacity-100" : "opacity-80"
                        )}
                      >
                      <span className="mr-1.5">Create</span><span className="hidden md:inline">👉</span><span className="inline md:hidden">👇</span>
                      </Button>
                    </div>

                  {/* END OF ACTION BAR */}
                  </div>

              </CardContent>
            </Card>
          </div>
          <div className={cn(
            `flex flex-col items-center justify-center`,
            `flex-1 h-full`,
            // `transition-all duration-200 ease-in-out`

            `-mt-[20px] -mb-[90px] md:-mt-0 md:-mb-0`,
          )}>
            
            <div className={cn(`
              -mt-8 md:mt-0
              transition-all duration-200 ease-in-out
            `,
             isLandscape
              ? `scale-[0.9] md:scale-[0.75] lg:scale-[0.9] xl:scale-[1.0] 2xl:scale-[1.1]`
              : `scale-[0.8] md:scale-[0.9] lg:scale-[1.1]`
              )}>
              <DeviceFrameset
                device="Nexus 5"
                // color="black"

                landscape={isLandscape}

                // note 1: videos are generated in 1024x576 or 576x1024
                // so we need to keep the same ratio here

                // note 2: width and height are fixed, if width always stays 512
                // that's because the landscape={} parameter will do the switch for us

                width={288}
                height={512}
              >
                <div className="
                flex flex-col items-center justify-center
                w-full h-full
                bg-black text-white
                ">
                  {isBusy ? <div className="
                  flex flex-col 
                  items-center justify-center
                  text-center space-y-1.5">
                    <p className="text-2xl font-bold">{progress}%</p> 
                    <p className="text-base text-white/70">{isBusy
                      ? (
                        storyGenerationStatus === "generating" ? "Writing story.."
                        : parseGenerationStatus === "generating" ? "Loading the project.."
                        : assetGenerationStatus === "generating" ? "Casting characters.."
                        : musicGenerationStatus === "generating" ? "Producing music.."
                        : imageGenerationStatus === "generating" ? "Creating storyboards.."
                        : videoGenerationStatus === "generating" ? "Filming shots.."
                        : voiceGenerationStatus === "generating" ? "Recording dialogues.."
                        : finalGenerationStatus === "generating" ? "Assembling final cut.."
                        : "Please wait.."
                      )
                      : status === "error"
                      ? <span>{error || ""}</span>
                      : <span>{error ? error : <span>&nbsp;</span>}</span> // to prevent layout changes
                     }</p>
                    </div>
                  : (currentVideo && currentVideo?.length > 128) ? <video
                    src={currentVideo}
                    controls
                    playsInline
                    // I think we can't autoplay with sound,
                    // so let's disable auto-play
                    // autoPlay
                    // muted
                    loop
                    className="object-cover"
                    style={{
                    }}
                  /> : <div  className="
                  flex flex-col 
                  items-center justify-center
                  text-lg text-center"></div>}
                </div>

                <div className={cn(`
                  fixed
                  flex flex-row items-center justify-center
                  bg-transparent
                  font-sans
                  -mb-0
                  `,
                  isLandscape ? 'h-4' : 'h-14'
                 )}
                  style={{ width: isPortrait ? 288 : 512 }}>
                  <span className="text-stone-100/50 text-4xs"
                    style={{ textShadow: "rgb(0 0 0 / 80%) 0px 0px 2px" }}>
                    Powered by
                  </span>
                  <span className="ml-1 mr-0.5">
                    <Image src={HFLogo} alt="Hugging Face" width="14" height="14" />
                  </span>
                  <span className="text-stone-100/80 text-3xs font-semibold"
                    style={{ textShadow: "rgb(0 0 0 / 80%) 0px 0px 2px" }}>Hugging Face</span>
            
                </div>
              </DeviceFrameset>
              
              {(currentVideo && currentVideo.length > 128) ? <div
                className={cn(`
                w-full
                flex flex-row
                items-center justify-center
                transition-all duration-150 ease-in-out
 
               text-stone-800
          
                group
                pt-2 md:pt-4
                `, 
                  isBusy ? 'opacity-50' : 'cursor-pointer opacity-100 hover:scale-110 active:scale-150 hover:text-stone-950 active:text-black'
                )}
                style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}
                onClick={isBusy ? undefined : saveVideo}
              >
                <div className="
                text-base md:text-lg lg:text-xl
                transition-all duration-150 ease-out
                group-hover:animate-swing
                "><FaCloudDownloadAlt /></div>
                <div className="text-xs md:text-sm lg:text-base">&nbsp;Download</div>
              </div> : null}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
