"use server"

import { parseClap } from "@/lib/clap/parseClap"
import { ClapProject } from "@/lib/clap/types"

import { aitubeApiUrl } from "../config"
import { serializeClap } from "@/lib/clap/serializeClap"

export async function extendClap({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  if (!clap) { throw new Error(`please provide a prompt`) }

  // remember: a space needs to be public for the classic fetch() to work
  const res = await fetch(`${aitubeApiUrl}generate/storyboards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO pass the JWT so that only the AI Stories Factory can call the API
      // Authorization: `Bearer ${hfApiToken}`,
    },
    body: await serializeClap(clap),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  const blob = await res.blob()

  const extendedClap = await parseClap(blob)
  
  return extendedClap
}