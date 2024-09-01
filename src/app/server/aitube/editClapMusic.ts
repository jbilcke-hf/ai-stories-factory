"use server"

import { ClapProject, ClapCompletionMode } from "@aitube/clap"
import { editClapMusic as apiEditClapMusic } from "@aitube/api-client"

import { getToken } from "./getToken"
import { Workaround } from "./types"

export async function editClapMusic({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapMusic({
      clap,
      completionMode: ClapCompletionMode.MERGE,
      turbo,
      token: await getToken()
    })
  }
  return { 
    promise: promise()
  }
}