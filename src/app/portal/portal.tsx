"use client"

import React from "react"

import { useQueryStringParams } from "@/lib/hooks"
import { VideoPreview } from "@/components/interface"

// we are going to need to do the same thing on AiTube's side,
// which is a waste of time of energy.. possibles alternatives are
// to put all the codebase in a shared NPM package, or just move everything
// to AiTube, then display an iframe widget similar to what Hugging
// Face does for Spaces, and call it a day.
//
// we could also make it in a way where only the rendering is done
// on AiTube's side, as if it was a YouTube player or something!
// but the problem is that we would need to POST the .clap, or host it
// (it won't fit in the iframe query params)

export function Portal() {
  useQueryStringParams()
  return (
    <VideoPreview embed />
  );
}
