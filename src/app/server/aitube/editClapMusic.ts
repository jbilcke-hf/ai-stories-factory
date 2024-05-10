"use server"

import { ClapProject } from "@aitube/clap"
import { editClapMusic as apiEditClapMusic, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapMusic({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapMusic({
    clap,
    completionMode: ClapCompletionMode.MERGE,
    turbo,
    token: await getToken()
  })

  return newClap
}