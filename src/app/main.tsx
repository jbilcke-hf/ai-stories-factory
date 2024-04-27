"use client"

import React, { useEffect, useRef, useState, useTransition } from 'react'
import { ClapProject } from '@aitube/clap'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils/cn'

import { useStore } from './store'
import { TextareaField } from '@/components/form/textarea-field'
import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'
import { createClap } from './server/aitube/createClap'
import { editClapStoryboards } from './server/aitube/editClapStoryboards'
import { exportClapToVideo } from './server/aitube/exportClapToVideo'

export function Main() {
  const [_isPending, startTransition] = useTransition()
  const storyPromptDraft = useStore(s => s.storyPromptDraft)
  const storyPrompt = useStore(s => s.storyPrompt)
  const status = useStore(s => s.status)
  const storyGenerationStatus = useStore(s => s.storyGenerationStatus)
  const voiceGenerationStatus = useStore(s => s.voiceGenerationStatus)
  const imageGenerationStatus = useStore(s => s.imageGenerationStatus)
  const videoGenerationStatus = useStore(s => s.videoGenerationStatus)
  const setStoryPromptDraft = useStore(s => s.setStoryPromptDraft)
  const setStoryPrompt = useStore(s => s.setStoryPrompt)
  const setStatus = useStore(s => s.setStatus)
  const setStoryGenerationStatus = useStore(s => s.setStoryGenerationStatus)
  const setVoiceGenerationStatus = useStore(s => s.setVoiceGenerationStatus)
  const setImageGenerationStatus = useStore(s => s.setImageGenerationStatus)
  const setVideoGenerationStatus = useStore(s => s.setVideoGenerationStatus)

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

        console.log(`handleSubmit(): received a clap = `, clap)
        setStoryGenerationStatus("finished")
      } catch (err) {
        setStoryGenerationStatus("error")
        setStatus("error")
        return
      }
      if (!clap) {
        return
      }

      try {
        setImageGenerationStatus("generating")
        clap = await editClapStoryboards({ clap })

        console.log(`handleSubmit(): received a clap with images = `, clap)
        setImageGenerationStatus("finished")
      } catch (err) {
        setImageGenerationStatus("error")
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
      
      setStatus("finished")
    })
  }

  return (
    <div className={cn(
      `fixed`,
      // `bg-zinc-800`,
      `bg-gradient-to-br from-amber-600 to-yellow-500`, 
      // `bg-gradient-to-br from-sky-400 to-sky-300/30`, 
      `w-screen h-screen overflow-y-scroll md:overflow-hidden`,
    )}
    style={{ boxShadow: "inset 0 0px 250px 0 rgb(0 0 0 / 60%)" }}>
      <div className="flex flex-col w-full">
        <div className="
        flex flex-col md:flex-row w-full
        "
        >
          <div className={cn(
            `flex flex-col w-full md:w-[512px]`,
            `transition-all duration-300 ease-in-out`,
            `ml-0 lg:ml-12`,
            `pt-4 sm:pt-8 md:pt-16 lg:pt-24`,
          )}>
            <Card className={cn(
             //  `shadow-2xl z-30 rounded-3xl`,
             `shadow-none`,
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
                    >Generate video stories using AI ✨</p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <div className="
                  flex flex-col
                  transition-all duration-200 ease-in-out
                  space-y-2 md:space-y-4 mt-0
                  ">
                    <TextareaField
                      label="My story:"
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
                    <div className="flex flex-row justify-between items-center space-x-3">
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
                       <span className="mr-1">Generate</span><span className="hidden md:inline">👉</span><span className="inline md:hidden">👇</span>
                      </Button>
                    </div>
                  </div>
                    <div className="text-stone-900/90 dark:text-stone-100/90 text-xs w-full text-right">
                    {isBusy
                      ? `Generation in progress (${status})`
                      : ""
                     }
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
          <div className={cn(
            `flex flex-col items-center justify-start md:justify-center`,
            `flex-1`,
            `md:h-screen`,
            // `transition-all duration-300 ease-in-out`
          )}>
            
            <div className={cn(`
              -mt-24 md:mt-0
              transition-all duration-200 ease-in-out
              scale-[0.7] md:scale-[0.9] lg:scale-[1.2]
            `)}>
              <DeviceFrameset
                device="Nexus 5"
                // color="black"
              >
                <div className="bg-black w-full h-full text-white">Hello world</div>
              </DeviceFrameset>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
