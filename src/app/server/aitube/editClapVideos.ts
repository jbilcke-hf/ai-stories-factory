"use server"

import { ClapProject } from "@aitube/clap"
import { editClapVideos as apiEditClapvideos } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapVideos({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapVideos({
    clap,
    token: await getToken()
  })

  return newClap
}