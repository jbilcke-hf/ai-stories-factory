"use server"

import { parseClap } from "@/lib/clap/parseClap"
import { ClapProject } from "@/lib/clap/types"

import { aitubeApiUrl } from "../config"

export async function generateClap({
  prompt = "",
}: {
  prompt: string
}): Promise<ClapProject> {
  if (!prompt) { throw new Error(`please provide a prompt`) }

  // AiTube Stories is nice, but we also need to leave some compute for AiTube Live and AiTube Gaming
  const height = 1024
  const width = 512

  // console.log(`calling `+ gradioApi + (gradioApi.endsWith("/") ? "" : "/") + "api/predict")

  // remember: a space needs to be public for the classic fetch() to work
  const res = await fetch(`${aitubeApiUrl}generate/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO pass the JWT so that only the AI Stories Factory can call the API
      // Authorization: `Bearer ${hfApiToken}`,
    },
    body: JSON.stringify({
      prompt,
      width,
      height
    }),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  const blob = await res.blob()

  const clap = await parseClap(blob)
  
  return clap
}