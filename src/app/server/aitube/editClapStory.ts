"use server"

import { ClapProject, ClapCompletionMode } from "@aitube/clap"
import { editClapStory as apiEditClapStory } from "@aitube/api-client"

import { getToken } from "./getToken"
import { Workaround } from "./types"
import { MAX_PROMPT_LENGTH_IN_CHARS } from "../config"

export async function editClapStory({
  clap,
  prompt,
  startTimeInMs,
  endTimeInMs,
  turbo = false,
}: {
  clap: ClapProject
  prompt?: string
  startTimeInMs?: number
  endTimeInMs?: number
  turbo?: boolean
}):  Workaround<ClapProject> {
  async function promise() {
    return await apiEditClapStory({
      clap,
      prompt: `${prompt || ""}`.slice(0, MAX_PROMPT_LENGTH_IN_CHARS),
      startTimeInMs,
      endTimeInMs,
      completionMode: ClapCompletionMode.MERGE,
      turbo,
      token: await getToken()
    })
  }

  return { 
    promise: promise()
  }
}