"use server"

import { ClapProject } from "@aitube/clap"
import { exportClapToVideo as apiExportClapToVideo } from "@aitube/client"

import { getToken } from "./getToken"
import { removeFinalVideos } from "@/lib/utils/removeFinalVideos"

export async function exportClapToVideo({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Promise<string> {

  // TODO move this safety into apiExportClapToVideo

  // one last precaustion, we make sure to we remove any existing render beforehand, as this eats up space
  clap.segments = removeFinalVideos(clap)

  // we have to leave the rest it, however..
  // ours final render needs all the video and audio clips!

  // TODO: maybe we should return a blob instead,
  // as this could be big eg. a few megabytes
  // or maybe we should convert it to an object id
  const dataUri: string = await apiExportClapToVideo({
    clap,
    format: "mp4",
    turbo,
    token: await getToken()
  })

  return dataUri
}