"use server"

import { ClapProject } from "@aitube/clap"
import { editClapStoryboards as apiEditClapStoryboards, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapStoryboards({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapStoryboards({
    clap,
    completionMode: ClapCompletionMode.FULL,
    token: await getToken()
  })

  return newClap
}