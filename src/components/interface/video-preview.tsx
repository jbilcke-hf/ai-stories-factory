"use client"

import React from "react"
import { FaCloudDownloadAlt } from "react-icons/fa"
import Image from "next/image"
import { DeviceFrameset } from "react-device-frameset"
import "react-device-frameset/styles/marvel-devices.min.css"

import { useOrientation } from "@/lib/hooks/useOrientation"
import { useProgressTimer } from "@/lib/hooks/useProgressTimer"
import { cn } from "@/lib/utils/cn"

import { useStore } from "../../app/store"
import HFLogo from "../../app/hf-logo.svg"
import { Login } from "./login"
import { useOAuth } from "@/lib/oauth/useOAuth"

export function VideoPreview() {

  const { isLoggedIn, enableOAuthWall } = useOAuth()

  const status = useStore(s => s.status)
  const parseGenerationStatus = useStore(s => s.parseGenerationStatus)
  const storyGenerationStatus = useStore(s => s.storyGenerationStatus)
  const assetGenerationStatus = useStore(s => s.assetGenerationStatus)
  const soundGenerationStatus = useStore(s => s.soundGenerationStatus)
  const musicGenerationStatus = useStore(s => s.musicGenerationStatus)
  const voiceGenerationStatus = useStore(s => s.voiceGenerationStatus)
  const imageGenerationStatus = useStore(s => s.imageGenerationStatus)
  const videoGenerationStatus = useStore(s => s.videoGenerationStatus)
  const finalGenerationStatus = useStore(s => s.finalGenerationStatus)
  const currentVideo = useStore(s => s.currentVideo)

  const error = useStore(s => s.error)

  const saveVideo = useStore(s => s.saveVideo)


  const  { isBusy, progress } = useProgressTimer()

  const {
    isLandscape,
    isPortrait,
  } = useOrientation()

  const placeholder = <div
  className="
  text-base
  text-center
text-stone-50/90 dark:text-stone-50/90
"
>{
  error ? <span>{error}</span> : 
  <span>No video yet</span>
}</div>

  return (
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
          {
            !isLoggedIn ? <div className="
            flex flex-col items-center justify-center
            space-y-2
            ">
              <div className="
              text-base
              text-center
            text-stone-50/90 dark:text-stone-50/90
            ">Please login to generate videos:</div>
              <Login />
              </div>
            : isBusy ? <div className="
          flex flex-col 
          items-center justify-center
          text-center space-y-1.5">
            <p className="text-2xl font-bold">{progress}%</p> 
            <p className="text-base text-white/70">{
            isBusy
              ? (
                // note: some of those tasks are running in parallel,
                // and some are super-slow (like music or video)
                // by carefully selecting in which order we set the ternaries,
                // we can create the illusion that we just have a succession of reasonably-sized tasks
                storyGenerationStatus === "generating" ? "Writing story.."
                : parseGenerationStatus === "generating" ? "Loading the project.."
                : assetGenerationStatus === "generating" ? "Casting characters.."
                : imageGenerationStatus === "generating" ? "Creating storyboards.."
                : soundGenerationStatus === "generating" ? "Recording sounds.."
                : videoGenerationStatus === "generating" ? "Filming shots.."
                : musicGenerationStatus === "generating" ? "Producing music.."
                : voiceGenerationStatus === "generating" ? "Recording dialogues.."
                : finalGenerationStatus === "generating" ? "Editing final cut.."
                : "Please wait.."
              )
              : status === "error"
              ? <span>{error || ""}</span>
              : placeholder // to prevent layout changes
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
          /> : placeholder}
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
            <Image src={HFLogo} alt="Hugging Face" width={14} height={13} />
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
  )
}