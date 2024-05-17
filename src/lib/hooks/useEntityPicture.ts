import { useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"

import { useStore } from "../../app/store"
import { ClapEntity, getClapAssetSourceType } from "@aitube/clap"
import { useOpenPictureFile } from "./useOpenPictureFile"

export function useEntityPicture(entity?: ClapEntity) {
  const defaultPicture = entity?.imageId
  const [currentPicture, setCurrentPicture] = useState(defaultPicture)
  const { file, openFilePicker } = useOpenPictureFile()
  const setMainCharacterImage = useStore(s => s.setMainCharacterImage)

  const newPicture = file || currentPicture || defaultPicture

  useEffect(() => {
    setCurrentPicture(newPicture)
    if (!newPicture) { return }
    
    if (entity) {
      entity.imageId = newPicture
    } else {
      setMainCharacterImage(newPicture)
    }
  }, [newPicture, JSON.stringify(entity)])

  return { picture: newPicture, openFilePicker }
}