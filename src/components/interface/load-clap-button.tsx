"use client"

import React from "react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useImportClap, useIsBusy, useStoryPromptDraft } from "@/lib/hooks"

export function LoadClapButton() {
  const { isBusy } = useIsBusy()
  const { openClapFilePicker } = useImportClap()
  const { storyPromptDraft } = useStoryPromptDraft()
  
  return (
    <Tooltip>
      <TooltipTrigger asChild><Button
  
        onClick={openClapFilePicker}
        disabled={isBusy}
        // variant="ghost"
        className={cn(
          `text-xs md:text-sm lg:text-base`,
          `bg-stone-800/90 text-amber-400/100 dark:bg-stone-800/90 dark:text-amber-400/100`,
          `font-bold`,
          `hover:bg-stone-800/100 hover:text-amber-300/100 dark:hover:bg-stone-800/100 dark:hover:text-amber-300/100`,
          storyPromptDraft ? "opacity-100" : "opacity-80"
        )}
      >
        <span className="hidden xl:inline mr-1">Load .clap</span>
        <span className="inline xl:hidden mr-1">Load .clap</span>
      </Button></TooltipTrigger>
    <TooltipContent side="top">
      <p className="text-xs font-normal text-stone-100/90 text-center">
        Clap is a new AI format,<br/>check out the academy<br/>to learn more about it.
      </p>
    </TooltipContent>
  </Tooltip>
  )
}