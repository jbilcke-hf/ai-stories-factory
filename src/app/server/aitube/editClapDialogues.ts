"use server"

import { ClapProject } from "@aitube/clap"
import { editClapDialogues as apiEditClapDialogues, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapDialogues({
  clap,
  turbo = false,
}: {
  clap: ClapProject
  turbo?: boolean
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapDialogues({
    clap,
    completionMode: ClapCompletionMode.FULL,
    turbo,
    token: await getToken()
  })

  return newClap
}