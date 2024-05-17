import { useEffect, useRef } from "react"
import { useFilePicker } from "use-file-picker"
import { FileContent } from "use-file-picker/dist/interfaces"
import { ClapProject, updateClap } from "@aitube/clap"

import { useStore } from "../../app/store"
import { useProcessors } from "./useProcessors"

export function useImportClap() {

  const setError = useStore(s => s.setError)
  const setCurrentClap = useStore(s => s.setCurrentClap)
  const loadClap = useStore(s => s.loadClap)

  const {
    generateMusic,
    generateVideos,
    generateFinalVideo,
  } = useProcessors()

  const importStory = async (fileData: FileContent<ArrayBuffer>): Promise<{
    clap: ClapProject
    regenerateVideo: boolean
  }> => {
    if (!fileData?.name) { throw new Error(`invalid file (missing file name)`) }

    const {
      setParseGenerationStatus,
    } = useStore.getState()

    setParseGenerationStatus("generating")

    try {
      const blob = new Blob([fileData.content])
      const res = await loadClap(blob, fileData.name)

      if (!res?.clap) { throw new Error(`failed to load the clap file`) }

      setParseGenerationStatus("finished")
      return res
    } catch (err) {
      console.error("failed to load the Clap file:", err)
      setParseGenerationStatus("error")
      throw err
    }
  }

  const { openFilePicker: openClapFilePicker, filesContent } = useFilePicker({
    accept: '.clap',
    readAs: "ArrayBuffer"
  })
  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      if (!fileData?.name) { return }

      const { setStatus, setProgress } = useStore.getState()

      setProgress(0)
      setStatus("generating")

      try {
        let { clap, regenerateVideo } = await importStory(fileData)
        
        // clap = await generateSounds(clap)

        // setCurrentClap(clap)

        console.log("loadClap(): clap = ", clap)

        // it is important to skip regeneration if we already have a video
        if (regenerateVideo) {
          console.log(`regenerating music and videos..`)
          const claps = await Promise.all([
            generateMusic(clap),
            generateVideos(clap)
          ])

          // console.log("finished processing the 2 tasks in parallel")

          for (const newerClap of claps) {
            clap = await updateClap(clap, newerClap, {
              overwriteMeta: false,
              inlineReplace: true,
            })
          }


          setCurrentClap(clap)

          await generateFinalVideo(clap)

        } else {
          console.log(`skipping music and video regeneration`)
        }

        setStatus("finished")
        setProgress(100)
        setError("")
      } catch (err) {
        console.error(`failed to import: `, err)
        setStatus("error")
        setError(`${err}`)
      }
     
    }
    fn()
  }, [fileData?.name])

  return { openClapFilePicker }
}