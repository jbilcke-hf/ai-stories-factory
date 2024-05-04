"use server"

import { ClapProject } from "@aitube/clap"
import { editClapDialogues as apiEditClapDialogues, ClapCompletionMode } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapDialogues({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapDialogues({
    clap,
    completionMode: ClapCompletionMode.FULL,
    token: await getToken()
  })

  return newClap
}