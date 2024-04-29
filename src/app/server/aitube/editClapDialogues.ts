"use server"

import { ClapProject } from "@aitube/clap"
import { editClapDialogues as apiEditClapDialogues } from "@aitube/client"

import { getToken } from "./getToken"

export async function editClapDialogues({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  const newClap: ClapProject = await apiEditClapDialogues({
    clap,
    token: await getToken()
  })

  return newClap
}