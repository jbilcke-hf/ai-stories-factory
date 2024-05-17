import { useRef } from "react"

import { useStore } from "@/app/store"

export function useIsBusy() {
  const isBusy = useStore(s => s.isBusy)
  const busyRef = useRef(isBusy)
  busyRef.current = isBusy

  return {isBusy, busyRef }
}