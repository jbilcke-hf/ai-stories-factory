import { useStore } from "@/app/store"
import { ClapImageRatio } from "@aitube/clap"

export function useOrientation() {
  const imageRatio = useStore(s => s.imageRatio)
  const setImageRatio = useStore(s => s.setImageRatio)
  const currentImageRatio = useStore(s => s.currentImageRatio)
  const toggleOrientation = useStore(s => s.toggleOrientation)
  // note: we are interested in the *current* video imageRatio,
  // not the requested video imageRatio requested for the next video
  const isLandscape = currentImageRatio === ClapImageRatio.LANDSCAPE
  const isPortrait = currentImageRatio === ClapImageRatio.PORTRAIT
  const isSquare = currentImageRatio === ClapImageRatio.SQUARE

  return {
    imageRatio,
    setImageRatio,
    currentImageRatio,
    toggleOrientation,
    isLandscape,
    isPortrait,
    isSquare
  }
}