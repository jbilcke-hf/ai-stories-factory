import { ClapMediaOrientation } from "@aitube/clap"

/**
 * Determine the video orientation from a video URL (data-uri or hosted)
 * 
 * @param url 
 * @returns 
 */
export async function getVideoOrientation(url: string): Promise<ClapMediaOrientation> {
  return new Promise<ClapMediaOrientation>(resolve => {
    const video = document.createElement('video')
    video.addEventListener( "loadedmetadata", function () {
      resolve(
        this.videoHeight < this.videoWidth ? ClapMediaOrientation.LANDSCAPE :
        this.videoHeight > this.videoWidth ? ClapMediaOrientation.PORTRAIT :
        ClapMediaOrientation.SQUARE
      )
    }, false)
    video.src = url
  })
}
