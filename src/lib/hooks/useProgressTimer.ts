"use client"

import { useStore } from "@/app/store"
import { useEffect, useRef } from "react"
import { useIsBusy } from "./useIsBusy"

export function useProgressTimer() {
  const runningRef = useRef(false)
  const timerRef = useRef<Timer>()

  const progress = useStore(s => s.progress)
  const stage = useStore(s => s.stage)
  const { isBusy, busyRef } = useIsBusy()

  const timerFn = async () => {
    const { progress, stage } = useStore.getState()

    let isBusy = busyRef.current

    clearTimeout(timerRef.current)
    if (!isBusy || stage === "idle") {
      return
    }

    /*
    console.log("progress function:", {
      stage,
      delay: progressDelayInMsPerStage[stage],
      progress,
    })
    */
    useStore.setState({
      // progress: Math.min(maxProgressPerStage[stage], progress + 1) 
      progress: Math.min(100, progress + 1) 
    })

    // timerRef.current = setTimeout(timerFn, progressDelayInMsPerStage[stage])
    timerRef.current = setTimeout(timerFn, 1600)
  }

  // const running = useRef(false)

  useEffect(() => {
    timerFn()
    clearTimeout(timerRef.current)
    let isBusy = busyRef.current
    if (!isBusy) {
      return
    }/* else if (running.current) {
      return
    }
    */
    // running.current = true
    timerRef.current = setTimeout(timerFn, 0)
  }, [isBusy])

  return { isBusy, busyRef, progress, stage }
}