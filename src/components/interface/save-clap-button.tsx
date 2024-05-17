"use client"

import React from "react"

import { Button } from "@/components/ui/button"

import { useStore } from "../../app/store"
import { cn } from "@/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsBusy, useStoryPromptDraft } from "@/lib/hooks"

export function SaveClapButton() {
  const { isBusy } = useIsBusy()
  const currentClap = useStore(s => s.currentClap)
  const saveClap = useStore(s => s.saveClap)
  const { storyPromptDraft } = useStoryPromptDraft()

  return (
      <Tooltip>
        <TooltipTrigger asChild><Button
      onClick={() => saveClap()}
      disabled={!currentClap || isBusy}
      // variant="ghost"
      className={cn(
        `text-xs md:text-sm lg:text-base`,
        `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
        `font-bold`,
        `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
        storyPromptDraft ? "opacity-100" : "opacity-80"
      )}
    >
      <span className="hidden xl:inline mr-1">Save .clap</span>
      <span className="inline xl:hidden mr-1">Save .clap</span>
    </Button></TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs font-normal text-stone-100/90 text-center">
        Clap is a new AI format,<br/>check out the academy<br/>to learn more about it.
        </p>
      </TooltipContent>
    </Tooltip> 
  )
}