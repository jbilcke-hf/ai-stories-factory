"use client"

import React, { useEffect, useRef, useState, useTransition } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/form/input-field'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

import { useStore } from './store'
import { TextareaField } from '@/components/form/textarea-field'
import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'

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
    storyGenerationStatus === "generating" &&
    voiceGenerationStatus === "generating" &&
    imageGenerationStatus === "generating" &&
    videoGenerationStatus === "generating"

  const isBusy = status === "generating" || hasPendingTasks

  const handleSubmit = async () => {

  }

  return (
    <div className={cn(
      `fixed`,
      // `bg-zinc-800`,
      `bg-gradient-to-br from-amber-600 to-yellow-500`, 
      // `bg-gradient-to-br from-sky-400 to-sky-300/30`, 
      `w-screen h-screen overflow-hidden`,
    )}>
      <div className="flex flex-col w-full">
        <div className="flex flex-col md:flex-row w-full">
          <div className={cn(
            `flex flex-col w-full md:w-[512px]`,
            `transition-all duration-300 ease-in-out`,
            `ml-12 pt-24`,
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
             
                    px-3
                    
                    rounded-full">
                    <div className="
                      flex
                      items-center justify-center text-center
                      w-16 h-16 rounded-lg
                      mr-2
                      font-sans
                      bg-yellow-400 dark:bg-yellow-400
                      text-5xl text-stone-900/80 dark:text-stone-900/80 font-bold
                      ">AI</div>
                      <div className="text-yellow-400 dark:text-yellow-400 text-5xl">Stories Factory</div>
                    </div>

                    <p className="text-stone-900/90 dark:text-stone-100/90 text-2xl text-center pt-4">Generate video stories with AI ✨</p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <div className="flex flex-col space-y-4 mt-0">
                    <TextareaField
                      label="Your story:"
                      // disabled={modelState != 'ready'}
                      onChange={(e) => {
                        setStoryPromptDraft(e.target.value)
                      }}
                      placeholder="Yesterday I was at my favorite pizza place and.."
                      inputClassName="h-80"
                      disabled={isBusy}
                      value={storyPromptDraft}
                    />
                </div>
                <div className="flex-flex-row space-y-3 pt-4">
                  <div className="flex flex-row justify-end items-center">
                    <div className="flex flex-row justify-between items-center space-x-3">
                      <Button
                        onClick={handleSubmit}
                        disabled={isBusy}
                        // variant="ghost"
                        className={cn(
                          `text-xl`,
                          `bg-stone-50/90 text-stone-900/80`,
                          `font-bold`,
                          `hover:bg-stone-50 hover:text-stone-900/90`,
                        )}
                      >
                        🖍️ Write
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
            `flex flex-col items-center justify-center`,
            `flex-1`,
            `h-screen`,
            // `transition-all duration-300 ease-in-out`
          )}>
            
            <div className={cn(`
              scale-[1.2]
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
