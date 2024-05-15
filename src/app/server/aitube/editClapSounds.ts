"use server"

import { ClapProject } from "@aitube/clap"
import { editClapSounds as apiEditClapSounds, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"
import { Workaround } from "./types"

export async function editClapSounds({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapSounds({
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