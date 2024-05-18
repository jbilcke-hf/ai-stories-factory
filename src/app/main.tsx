"use client"

import React from "react"
import { IoMdPhonePortrait } from "react-icons/io"
import { GiRollingDices } from "react-icons/gi"
import { ClapMediaOrientation } from "@aitube/clap"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { TextareaField } from "@/components/form/textarea-field"

import { cn, generateRandomStory } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsBusy, useOrientation, useQueryStringParams, useStoryPromptDraft } from "@/lib/hooks"
import { BottomBar, VideoPreview } from "@/components/interface"
import { MainTitle } from "@/components/interface/main-title"
import { LoadClapButton } from "@/components/interface/load-clap-button"
import { SaveClapButton } from "@/components/interface/save-clap-button"
import { useProcessors } from "@/lib/hooks/useProcessors"
import { Characters } from "@/components/interface/characters"
import { useOAuth } from "@/lib/oauth/useOAuth"
import { AuthWall } from "@/components/interface/auth-wall"

import { defaultPrompt } from "./config"
import { useStore } from "./store"

export function Main() {
  const { storyPromptDraft, setStoryPromptDraft, promptDraftRef } = useStoryPromptDraft()
  const  { isBusy } = useIsBusy()
  const { orientation, toggleOrientation } = useOrientation()
  const { handleSubmit } = useProcessors()
  useQueryStringParams()
    
  const showAuthWall = useStore(s => s.showAuthWall)
  const { isLoggedIn, enableOAuthWall } = useOAuth()

  return (
    <TooltipProvider>
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

        // this version is a bit too aggressive on mobile
        // style={{ boxShadow: "inset 0 0px 250px 0 rgb(0 0 0 / 60%)" }}

        style={{ boxShadow: "inset 0 0 10vh 0 rgb(0 0 0 / 50%)" }}
        >
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


                `border-transparent dark:border-transparent`,
                // `bg-stone-50/90 dark:bg-stone-50/90`,
                // `border-yellow-100 dark:border-yellow-100`,
                // `bg-yellow-500 dark:bg-yellow-500`,
                // `border-yellow-400 dark:border-yellow-400`,

              )}>
                <CardHeader>
                    <MainTitle />
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
                          placeholder={defaultPrompt}
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
                      flex flex-col lg:flex-row
                      justify-between items-center
                      space-y-3 lg:space-x-3 lg:space-y-0">
                
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
                        <LoadClapButton />
                        <SaveClapButton />
                        <Characters />
                      </div>
    
                      <div className=" 
                        flex flex-row
                        justify-between items-center
                        space-x-3
                        select-none
                        ">

 {/* RANDOMNESS SWITCH */}
 <Tooltip>
                        <TooltipTrigger asChild><div className=" 
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
                        </div></TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs font-normal text-stone-100/90 text-center">
                          Generate a random prompt.
                          </p>
                        </TooltipContent>
                      </Tooltip> 
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
                          disabled={!storyPromptDraft || isBusy || !isLoggedIn}
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
              <VideoPreview />
            </div>
          </div>
          <BottomBar />
        </div>
        <Toaster />
        <AuthWall show={showAuthWall} />
      </div>
    </TooltipProvider>
  );
}
