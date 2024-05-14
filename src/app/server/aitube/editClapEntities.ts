"use server"

import { ClapProject } from "@aitube/clap"
import { editClapEntities as apiEditClapEntities, ClapCompletionMode, ClapEntityPrompt } from "@aitube/client"

import { getToken } from "./getToken"
import { Workaround } from "./types"

export async function editClapEntities({
  clap,
  entityPrompts = [],
  turbo = false,
}: {
  clap: ClapProject
  entityPrompts?: ClapEntityPrompt[]
  turbo?: boolean
}):  Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapEntities({
      clap,
      entityPrompts,
      completionMode: ClapCompletionMode.MERGE,
      turbo,
      token: await getToken()
    })
  }

  return { 
    promise: promise()
  }
}