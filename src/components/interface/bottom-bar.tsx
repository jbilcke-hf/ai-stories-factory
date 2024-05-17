"use client"

import React from "react"
import { FaDiscord } from "react-icons/fa"
import { GiSpellBook } from "react-icons/gi"

export function BottomBar() {

  return (
    <div
      className="
        fixed
      
        left-4 md:left-8
        bottom-4
        flex flex-col md:flex-row
        md:items-center justify-center
        space-y-4 md:space-x-4 md:space-y-0
    
      ">
      <a
        className="
        flex
        no-underline
        animation-all duration-150 ease-in-out
        group
        text-stone-950/60 hover:text-stone-950/80 scale-95 hover:scale-100"
        href="https://discord.gg/AEruz9B92B"
        target="_blank">
        <div className="
          text-base md:text-lg lg:text-xl
          transition-all duration-150 ease-out
          group-hover:animate-swing
        "><FaDiscord /></div>
        <div className="text-xs md:text-sm lg:text-base ml-1.5">
          <span className="hidden md:block">Chat on Discord</span>
          <span className="block md:hidden">Discord</span>
        </div>
      </a>
      <a
        className="
        flex
        no-underline
        animation-all duration-150 ease-in-out
        group
        text-stone-950/60 hover:text-stone-950/80 scale-95 hover:scale-100"
        href="https://latent-store.notion.site/AI-Stories-Academy-8e3ce6ff2d5946ffadc94193619dd5cd"
        target="_blank">
        <div className="
          text-base md:text-lg lg:text-xl
          transition-all duration-150 ease-out
          group-hover:animate-swing
        "><GiSpellBook /></div>
        <div className="text-xs md:text-sm lg:text-base ml-1.5">
          <span className="hidden md:block">Prompt academy</span>
          <span className="block md:hidden">Academy</span>
        </div>
      </a>
    </div>
  );
}
