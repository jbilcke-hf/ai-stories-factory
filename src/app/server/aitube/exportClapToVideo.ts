"use server"

import { ClapProject } from "@aitube/clap"
import { exportClapToVideo as apiExportClapToVideo } from "@aitube/client"

import { getToken } from "./getToken"

export async function exportClapToVideo({
  clap,
}: {
  clap: ClapProject
}): Promise<string> {
  // TODO: maybe we should return a blob instead,
  // as this could be big eg. a few megabytes
  // or maybe we should convert it to an object id
  const dataUri: string = await apiExportClapToVideo({
    clap,
    format: "mp4",
    token: await getToken()
  })

  return dataUri
}