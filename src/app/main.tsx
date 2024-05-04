"use client"

import React, { useEffect, useRef, useTransition } from 'react'
import { IoMdPhoneLandscape, IoMdPhonePortrait } from 'react-icons/io'
import { ClapProject } from '@aitube/clap'
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
import { editClapDialogues } from './server/aitube/editClapDialogues'
import { editClapStoryboards } from './server/aitube/editClapStoryboards'
import { exportClapToVideo } from './server/aitube/exportClapToVideo'

import { useStore } from './store'
import HFLogo from "./hf-logo.svg"
import { fileToBase64 } from '@/lib/base64/fileToBase64'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/form/field'
import { Label } from '@/components/form/label'
import { VideoOrientation } from './types'

export function Main() {
  const [_isPending, startTransition] = useTransition()
  const storyPromptDraft = useStore(s => s.storyPromptDraft)
  const promptDraft = useRef("")
  promptDraft.current = storyPromptDraft
  const storyPrompt = useStore(s => s.storyPrompt)
  const orientation = useStore(s => s.orientation)
  const status = useStore(s => s.status)
  const storyGenerationStatus = useStore(s => s.storyGenerationStatus)
  const voiceGenerationStatus = useStore(s => s.voiceGenerationStatus)
  const imageGenerationStatus = useStore(s => s.imageGenerationStatus)
  const videoGenerationStatus = useStore(s => s.videoGenerationStatus)
  const currentClap = useStore(s => s.currentClap)
  const currentVideo = useStore(s => s.currentVideo)
  const currentVideoOrientation = useStore(s => s.currentVideoOrientation)
  const setStoryPromptDraft = useStore(s => s.setStoryPromptDraft)
  const setStoryPrompt = useStore(s => s.setStoryPrompt)
  const setStatus = useStore(s => s.setStatus)
  const toggleOrientation = useStore(s => s.toggleOrientation)
  const error = useStore(s => s.error)
  const setError = useStore(s => s.setError)
  const setStoryGenerationStatus = useStore(s => s.setStoryGenerationStatus)
  const setVoiceGenerationStatus = useStore(s => s.setVoiceGenerationStatus)
  const setImageGenerationStatus = useStore(s => s.setImageGenerationStatus)
  const setVideoGenerationStatus = useStore(s => s.setVideoGenerationStatus)
  const setCurrentClap = useStore(s => s.setCurrentClap)
  const setGeneratedVideo = useStore(s => s.setGeneratedVideo)
  const progress = useStore(s => s.progress)
  const setProgress = useStore(s => s.setProgress)
  const saveClap = useStore(s => s.saveClap)
  const loadClap = useStore(s => s.loadClap)

  const hasPendingTasks =
    storyGenerationStatus === "generating" ||
    voiceGenerationStatus === "generating" ||
    imageGenerationStatus === "generating" ||
    videoGenerationStatus === "generating"

  const isBusy = status === "generating" || hasPendingTasks


  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.clap',
    readAs: "ArrayBuffer"
  })

  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      if (fileData?.name) {
        try {
          const blob = new Blob([fileData.content])
          await loadClap(blob, fileData.name)
        } catch (err) {
          console.error("failed to load the Clap file:", err)
        }
      }
    }
    fn()
  }, [fileData?.name])
  
  const handleSubmit = async () => {

    startTransition(async () => {
      console.log(`handleSubmit(): generating a clap using prompt = "${promptDraft.current}" `)

      let clap: ClapProject | undefined = undefined
      try {
        setProgress(5)

        setStatus("generating")
        setStoryGenerationStatus("generating")
        setStoryPrompt(promptDraft.current)

        clap = await createClap({
          prompt: promptDraft.current,
          orientation: useStore.getState().orientation,
        })

        if (!clap) { throw new Error(`failed to create the clap`) }

        if (clap.segments.length <= 1) { throw new Error(`failed to generate more than one segments`) }

        console.log(`handleSubmit(): received a clap = `, clap)
        setCurrentClap(clap)
        setStoryGenerationStatus("finished")
      } catch (err) {
        setStoryGenerationStatus("error")
        setStatus("error")
        setError(`${err}`)
        return
      }
      if (!clap) {
        return
      }

      // TODO Julian
      console.log("handleSubmit(): TODO Julian: generate images in parallel of the dialogue using Promise.all()")
      // this is not trivial to do btw, since we will have to merge the clap together
      // (this could be a helper function inside @aitube/clap)
      try {
        setProgress(25)
        setImageGenerationStatus("generating")
        clap = await editClapStoryboards({ clap })

        if (!clap) { throw new Error(`failed to edit the storyboards`) }

        console.log(`handleSubmit(): received a clap with images = `, clap)
        setCurrentClap(clap)
        setImageGenerationStatus("finished")
      } catch (err) {
        setImageGenerationStatus("error")
        setStatus("error")
        setError(`${err}`)
        return
      }
      if (!clap) {
        return
      }

      
      try {
        setProgress(50)
        setVoiceGenerationStatus("generating")
        clap = await editClapDialogues({ clap })

        if (!clap) { throw new Error(`failed to edit the dialogues`) }

        console.log(`handleSubmit(): received a clap with dialogues = `, clap)
        setCurrentClap(clap)
        setVoiceGenerationStatus("finished")
      } catch (err) {
        setVoiceGenerationStatus("error")
        setStatus("error")
        setError(`${err}`)
        return
      }
      if (!clap) {
        return
      }

      let assetUrl = ""
      try {
        setProgress(75)
        setVideoGenerationStatus("generating")
        assetUrl = await exportClapToVideo({ clap })

        console.log(`handleSubmit(): received a video: ${assetUrl.slice(0, 60)}...`)

        setVideoGenerationStatus("finished")
      } catch (err) {
        setVideoGenerationStatus("error")
        setStatus("error")
        setError(`${err}`)
        return
      }
      if (!assetUrl) {
        return
      }

      setGeneratedVideo(assetUrl)
      setStatus("finished")
      setError("")
    })
  }

  // note: we are interested in the *current* video orientation,
  // not the requested video orientation requested for the next video
  const isLandscape = currentVideoOrientation === VideoOrientation.LANDSCAPE
  const isPortrait = currentVideoOrientation === VideoOrientation.PORTRAIT
  const isSquare = currentVideoOrientation === VideoOrientation.SQUARE

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
     `bg-gradient-to-br from-red-700 to-yellow-400`, 
   
     // pretty cool lime!
     // `bg-gradient-to-br from-lime-700 to-yellow-400`, 

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
                    <div className="
                      flex flex-col
                      
                      w-32 bg-yellow-600
                      transition-all duration-200 ease-in-out
                      space-y-2 md:space-y-4
                    ">
                      put menu here
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
                        // label="My story:"
                        // disabled={modelState != 'ready'}
                        onChange={(e) => {
                          setStoryPromptDraft(e.target.value)
                          promptDraft.current = e.target.value
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

                    {/*
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
                     <span className="mr-1">Save preset</span>
                    </Button>
                    */}
                    <div></div>
  

                    <div className=" 
                    flex flex-row
                    justify-between items-center
                    space-x-3
                    select-none
                    ">
                      {/* ORIENTATION SWITCH */}
                      <div className=" 
                      flex flex-row
                      justify-between items-center
                      cursor-pointer
                      "
                      onClick={() => toggleOrientation()}>
                        <div>Orientation:</div>
                        <div className="
                        w-10 h-10
                        flex flex-row items-center justify-center
                        "
                        >
                          <div className={cn(
                            `transition-all duration-200 ease-in-out`,
                            orientation === VideoOrientation.LANDSCAPE ? `rotate-90` : `rotate-0`
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
                          `text-lg md:text-xl lg:text-2xl`,
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
                        storyGenerationStatus === "generating" ? "Enhancing the story.."
                        : imageGenerationStatus === "generating" ? "Generating storyboards.."
                        : voiceGenerationStatus === "generating" ? "Generating voices.."
                        : videoGenerationStatus === "generating" ? "Assembling final video.."
                        : "Please wait.."
                      )
                      : status === "error"
                      ? <span>{error || ""}</span>
                      : <span>&nbsp;</span> // to prevent layout changes
                     }</p>
                    </div>
                  : currentVideo ? <video
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
                  isLandscape ? 'h-4' : 'h-16'
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
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
