"use server"

import { ClapProject } from "@aitube/clap"
import { editClapEntities as apiEditClapEntities, ClapCompletionMode, ClapEntityPrompt } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapEntities({
  clap,
  entityPrompts = []
}: {
  clap: ClapProject
  entityPrompts?: ClapEntityPrompt[]
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapEntities({
    clap,
    entityPrompts,
    completionMode: ClapCompletionMode.FULL,
    token: await getToken()
  })

  return newClap
}