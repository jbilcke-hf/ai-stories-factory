import { VideoOrientation } from "@/app/types"

/**
 * Determine the video orientation from a video URL (data-uri or hosted)
 * 
 * @param url 
 * @returns 
 */
export async function getVideoOrientation(url: string): Promise<VideoOrientation> {
  return new Promise<VideoOrientation>(resolve => {
    const video = document.createElement('video')
    video.addEventListener( "loadedmetadata", function () {
      resolve(
        this.videoHeight < this.videoWidth ? VideoOrientation.LANDSCAPE :
        this.videoHeight > this.videoWidth ? VideoOrientation.PORTRAIT :
        VideoOrientation.SQUARE
      )
    }, false)
    video.src = url
  })
}
