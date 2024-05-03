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
    // initially I used 1024x512 (a 2:1 ratio)
    // but that is a bit too extreme, most phones only take 16:9
    height: 1024,
    width: 576,

    token: await getToken()
  })

  return clap
}
