import { useStore } from "@/app/store"
import { ClapMediaOrientation } from "@aitube/clap"

export function useOrientation() {
  const orientation = useStore(s => s.orientation)
  const setOrientation = useStore(s => s.setOrientation)
  const currentVideoOrientation = useStore(s => s.currentVideoOrientation)
  const toggleOrientation = useStore(s => s.toggleOrientation)
  // note: we are interested in the *current* video orientation,
  // not the requested video orientation requested for the next video
  const isLandscape = currentVideoOrientation === ClapMediaOrientation.LANDSCAPE
  const isPortrait = currentVideoOrientation === ClapMediaOrientation.PORTRAIT
  const isSquare = currentVideoOrientation === ClapMediaOrientation.SQUARE

  return {
    orientation,
    setOrientation,
    currentVideoOrientation,
    toggleOrientation,
    isLandscape,
    isPortrait,
    isSquare
  }
}