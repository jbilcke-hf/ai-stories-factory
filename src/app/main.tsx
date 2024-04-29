"use client"

import React, { useTransition } from 'react'
import { ClapProject } from '@aitube/clap'
import Image from "next/image"
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

export function Main() {
  const [_isPending, startTransition] = useTransition()
  const storyPromptDraft = useStore(s => s.storyPromptDraft)
  const storyPrompt = useStore(s => s.storyPrompt)
  const status = useStore(s => s.status)
  const storyGenerationStatus = useStore(s => s.storyGenerationStatus)
  const voiceGenerationStatus = useStore(s => s.voiceGenerationStatus)
  const imageGenerationStatus = useStore(s => s.imageGenerationStatus)
  const videoGenerationStatus = useStore(s => s.videoGenerationStatus)
  const generatedClap = useStore(s => s.generatedClap)
  const generatedVideo = useStore(s => s.generatedVideo)
  const setStoryPromptDraft = useStore(s => s.setStoryPromptDraft)
  const setStoryPrompt = useStore(s => s.setStoryPrompt)
  const setStatus = useStore(s => s.setStatus)
  const setStoryGenerationStatus = useStore(s => s.setStoryGenerationStatus)
  const setVoiceGenerationStatus = useStore(s => s.setVoiceGenerationStatus)
  const setImageGenerationStatus = useStore(s => s.setImageGenerationStatus)
  const setVideoGenerationStatus = useStore(s => s.setVideoGenerationStatus)
  const setGeneratedClap = useStore(s => s.setGeneratedClap)
  const setGeneratedVideo = useStore(s => s.setGeneratedVideo)

  const hasPendingTasks =
    storyGenerationStatus === "generating" ||
    voiceGenerationStatus === "generating" ||
    imageGenerationStatus === "generating" ||
    videoGenerationStatus === "generating"

  const isBusy = status === "generating" || hasPendingTasks

  const handleSubmit = async () => {
    const prompt = storyPromptDraft

    setStatus("generating")
    setStoryGenerationStatus("generating")
    setStoryPrompt(prompt)

    startTransition(async () => {
      console.log(`handleSubmit(): generating a clap using prompt = "${prompt}" `)

      let clap: ClapProject | undefined = undefined
      try {
        clap = await createClap({ prompt })

        if (!clap) { throw new Error(`failed to create the clap`) }

        console.log(`handleSubmit(): received a clap = `, clap)
        setGeneratedClap(clap)
        setStoryGenerationStatus("finished")
      } catch (err) {
        setStoryGenerationStatus("error")
        setStatus("error")
        return
      }
      if (!clap) {
        return
      }

      // TODO Julian
      console.log("handleSubmit(): TODO Julian: generate images in parallel of the dialogue using Promise.all()")

      try {
        setImageGenerationStatus("generating")
        clap = await editClapStoryboards({ clap })

        if (!clap) { throw new Error(`failed to edit the storyboards`) }

        console.log(`handleSubmit(): received a clap with images = `, clap)
        setGeneratedClap(clap)
        setImageGenerationStatus("finished")
      } catch (err) {
        setImageGenerationStatus("error")
        setStatus("error")
        return
      }
      if (!clap) {
        return
      }

      
      try {
        setVoiceGenerationStatus("generating")
        clap = await editClapDialogues({ clap })

        if (!clap) { throw new Error(`failed to edit the dialogues`) }

        console.log(`handleSubmit(): received a clap with dialogues = `, clap)
        setGeneratedClap(clap)
        setVoiceGenerationStatus("finished")
      } catch (err) {
        setVoiceGenerationStatus("error")
        setStatus("error")
        return
      }
      if (!clap) {
        return
      }

      let assetUrl = ""
      try {
        setVideoGenerationStatus("generating")
        assetUrl = await exportClapToVideo({ clap })

        console.log(`handleSubmit(): received a video:`, assetUrl)
        setVideoGenerationStatus("finished")
      } catch (err) {
        setVideoGenerationStatus("error")
        setStatus("error")
        return
      }
      if (!assetUrl) {
        return
      }

      setGeneratedVideo(assetUrl)
      setStatus("finished")
    })
  }

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
                    >Make vertical video stories using AI ✨</p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <div className="
                  flex flex-col
                  transition-all duration-200 ease-in-out
                  space-y-2 md:space-y-4 mt-0
                  ">
                    <TextareaField
                      // label="My story:"
                      // disabled={modelState != 'ready'}
                      onChange={(e) => {
                        setStoryPromptDraft(e.target.value)
                      }}
                      placeholder="Yesterday I was at my favorite pizza place and.."
                      inputClassName="
                      transition-all duration-200 ease-in-out
                      h-32 md:h-56 lg:h-64
                      "
                      disabled={isBusy}
                      value={storyPromptDraft}
                    />
                </div>
                <div className="flex-flex-row space-y-3 pt-4">
                  <div className="flex flex-row justify-end items-center">
                    <div className="
                    w-full
                    flex flex-row
                    justify-end items-center
                    space-x-3">
                      {/*
                      <Button
                        onClick={handleSubmit}
                        disabled={!storyPromptDraft || isBusy || !generatedClap}
                        // variant="ghost"
                        className={cn(
                          `text-sm md:text-base lg:text-lg`,
                          `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
                          `font-bold`,
                          `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
                          storyPromptDraft ? "opacity-100" : "opacity-80"
                        )}
                      >
                       <span className="mr-1">Save</span>
                      </Button>
                      */}

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
                  </div>
                    <div className="
                    text-stone-900/90 dark:text-stone-100/90
                    text-sm md:text-base lg:text-lg
                    w-full text-right">
                    {isBusy
                      ? (
                        storyGenerationStatus === "generating" ? "Enhancing the story.."
                        : imageGenerationStatus === "generating" ? "Generating storyboards.."
                        : voiceGenerationStatus === "generating" ? "Generating voices.."
                        : videoGenerationStatus === "generating" ? "Assembling final video.."
                        : "Please wait.."
                      )
                      : <span>&nbsp;</span> // to prevent layout changes
                     }
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
          <div className={cn(
            `flex flex-col items-center justify-center`,
            `flex-1 h-full`,
            // `transition-all duration-200 ease-in-out`

            `-mt-[100px] -mb-[90px] md:-mt-0 md:-mb-0`,
          )}>
            
            <div className={cn(`
              -mt-24 md:mt-0
              transition-all duration-200 ease-in-out
              scale-[0.7] md:scale-[0.9] lg:scale-[1.2]
            `)}>
              <DeviceFrameset
                device="Nexus 5"
                // color="black"

                // note: videos are generated in 512x1024
                // so we need to keep the same ratio here
                width={256}
                height={512}
              >
                <div className="
                flex flex-col items-center justify-center
                w-full h-full
                bg-black text-white
                ">
                  {generatedVideo && <video
                    src={generatedVideo}
                    controls
                    autoPlay
                    playsInline
                    muted
                    loop
                    className="object-cover"
                    style={{
                    }}
                  />}
                </div>
              </DeviceFrameset>
            </div>
          </div>
        </div>

        <div className="
        flex flex-row items-center justify-end
        w-full p-6
        font-sans">
          <span className="text-stone-950/60 text-2xs"
            style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}>
            Powered by
          </span>
          <span className="ml-1.5 mr-1">
            <Image src={HFLogo} alt="Hugging Face" width="16" height="16" />
          </span>
          <span className="text-stone-950/60 text-xs font-bold"
            style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}>Hugging Face</span>
    
        </div>
      </div>
      <Toaster />
    </div>
  );
}
