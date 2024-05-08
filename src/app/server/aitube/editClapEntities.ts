"use server"

import { ClapProject } from "@aitube/clap"
import { editClapEntities as apiEditClapEntities, ClapCompletionMode, ClapEntityPrompt } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapEntities({
  clap,
  entityPrompts = [],
  turbo = false,
}: {
  clap: ClapProject
  entityPrompts?: ClapEntityPrompt[]
  turbo?: boolean
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapEntities({
    clap,
    entityPrompts,
    completionMode: ClapCompletionMode.FULL,
    turbo,
    token: await getToken()
  })

  return newClap
}