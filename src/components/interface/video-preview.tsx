"use client"

import React from "react"

import { useProgressTimer } from "@/lib/hooks/useProgressTimer"
import { useOAuth } from "@/lib/oauth/useOAuth"

import { useStore } from "../../app/store"
import { Login } from "./login"
import { Video } from "./video"
import { DownloadVideo } from "./download-video"
import { DeviceFrame } from "./device-frame"

export function VideoPreview({
  embed
}: {
  embed?: boolean
}) {

  const { isLoggedIn } = useOAuth()
  const currentVideo = useStore(s => s.currentVideo)
  const statusMessage = useStore(s => s.statusMessage)
  const error = useStore(s => s.error)
  const saveVideo = useStore(s => s.saveVideo)
  const { isBusy, progress } = useProgressTimer()

  return (
    <DeviceFrame
      companion={
        <DownloadVideo
          disabled={isBusy}
          video={currentVideo}
          onClick={saveVideo}
        />
      }
      showFrame={!embed}
    >
    <Video
      video={currentVideo}
      isBusy={isBusy}
      progress={progress}
      status={statusMessage}
      error={error}
    >{
      !isLoggedIn
      ? <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-base text-center text-stone-50/90 dark:text-stone-50/90">
            Please login to generate videos:
          </div>
          <Login />
        </div>
      : null
      }</Video>
    </DeviceFrame>
  )
}