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

    // the vertical video look 🤳
    height: 1024,
    width: 512,

    token: await getToken()
  })

  return clap
}
