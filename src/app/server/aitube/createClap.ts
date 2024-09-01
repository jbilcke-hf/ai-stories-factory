"use server"


import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { ClapProject, ClapImageRatio } from "@aitube/clap"
import { createClap as apiCreateClap } from "@aitube/client"

import { getToken } from "./getToken"
import { RESOLUTION_LONG, RESOLUTION_SHORT, MAX_PROMPT_LENGTH_IN_CHARS } from "../config"
import { getRateLimit } from "../redis/getRateLimit"

const rateLimit = getRateLimit()

export async function createClap({
  prompt = "",
  imageRatio = ClapImageRatio.PORTRAIT,
  turbo = false,
}: {
  prompt: string
  imageRatio?: ClapImageRatio
  turbo?: boolean
}): Promise<ClapProject> {

  // TODO: use 

  /*
  if (process.env.ENABLE_RATE_LIMIT) {
    const user = "anon"
    const userRateLimitResult = await rateLimit.limit(user)

    // result.limit
    if (!userRateLimitResult.success) {
      console.log(`blocking user ${user} who requested "${prompt}${prompt.length > 60 ? "..." : ""}"`)
      throw new Error(`Rate Limit Reached`)
    } else {
      console.log(`allowing user ${user}: who requested "${prompt}${prompt.length >630 ? "..." : ""}"`)
    }
  }
  */

  const clap: ClapProject = await apiCreateClap({
    prompt: prompt.slice(0, MAX_PROMPT_LENGTH_IN_CHARS),

    height: imageRatio === ClapImageRatio.PORTRAIT ? RESOLUTION_LONG : RESOLUTION_SHORT,
    width: imageRatio === ClapImageRatio.PORTRAIT ? RESOLUTION_SHORT : RESOLUTION_LONG,

    turbo,

    token: await getToken()
  })

  return clap
}
