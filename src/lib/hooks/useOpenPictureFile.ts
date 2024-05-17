import { useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"

export function useOpenPictureFile() {
  const [picture, setPicture] = useState("")

  const { openFilePicker, filesContent } = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
  })
  const fileData = filesContent[0]

  useEffect(() => {
    if (!fileData?.name) { return }
    setPicture(fileData.content)
  }, [fileData?.name])

  return { file: picture, openFilePicker }
}