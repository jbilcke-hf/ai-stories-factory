import { useStore } from "@/app/store"
import { useEffect, useRef } from "react"
import { useIsBusy } from "./useIsBusy"

export function useProgressTimer() {
  const runningRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const progress = useStore(s => s.progress)
  const stage = useStore(s => s.stage)
  const { isBusy, busyRef } = useIsBusy()

  const timerFn = async () => {
    const { isBusy, progress, stage } = useStore.getState()

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
    timerRef.current = setTimeout(timerFn, 1200)
  }

  useEffect(() => {
    timerFn()
    clearTimeout(timerRef.current)
    if (!isBusy) { return }
    timerRef.current = setTimeout(timerFn, 0)
  }, [isBusy])

  return { isBusy, busyRef, progress, stage }
}