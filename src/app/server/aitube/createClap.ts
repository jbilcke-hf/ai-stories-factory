"use server"

import { ClapProject } from "@aitube/clap"
import { createClap as apiCreateClap } from "@aitube/client"

import { getToken } from "./getToken"

export async function createClap({
  prompt = "",
}: {
  prompt: string
}): Promise<ClapProject> {
  const clap: ClapProject = await apiCreateClap({
    prompt,
    token: await getToken()
  })

  return clap
}
