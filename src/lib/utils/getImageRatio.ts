import { ClapImageRatio } from "@aitube/clap"

/**
 * Determine the video imageRatio from a video URL (data-uri or hosted)
 * 
 * @param url 
 * @returns 
 */
export async function getImageRatio(url: string): Promise<ClapImageRatio> {
  return new Promise<ClapImageRatio>(resolve => {
    const video = document.createElement('video')
    video.addEventListener( "loadedmetadata", function () {
      resolve(
        this.videoHeight < this.videoWidth ? ClapImageRatio.LANDSCAPE :
        this.videoHeight > this.videoWidth ? ClapImageRatio.PORTRAIT :
        ClapImageRatio.SQUARE
      )
    }, false)
    video.src = url
  })
}
