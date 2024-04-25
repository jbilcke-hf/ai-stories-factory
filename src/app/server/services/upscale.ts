"use server"

import { generateSeed } from "@/lib/generateSeed"
import { UpscalingParams } from "@/types"

import { addBase64HeaderToPng } from "../utils/addBase64HeaderToPng"

const gradioApi = `https://jbilcke-hf-image-upscaling-api.hf.space`
const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

export async function upscale({
  imageAsBase64,
  prompt,
  negativePrompt,
  scaleFactor,
  nbSteps,
  seed,
}: UpscalingParams): Promise<string> {

  const addedPrompt = [
    "clean",
    "high-resolution",
    "8k",
    "best quality",
    "masterpiece",
    "crisp",
    "sharp",
    "intricate details"
  ].join(", ")
  
  const negPrompt = [
    negativePrompt,
    "pixelated",
    "pixels",
    "noise",
    "blur",
    "motion blur",
    "lowres",
    "oversmooth",
    "longbody",
    "bad anatomy",
    "bad hands",
    "missing fingers",
    "extra digit",
    "fewer digits",
    "cropped",
    "worst quality",
    "low quality",
    "artificial",
    "unrealistic",
    "watermark",
    "trademark",
    "error",
    "mistake"
  ].join(", ")

  const conditioningScale = 1.4
  const classifierFreeGuidance = 9.5
  
  // remember: a space needs to be public for the classic fetch() to work
  const res = await fetch(gradioApi + (gradioApi.endsWith("/") ? "" : "/") + "api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${hfApiToken}`,
    },
    body: JSON.stringify({
      fn_index: 0, // <- is it 0 or 1?
      data: [
        microserviceApiKey,
        imageAsBase64, 	// blob in 'parameter_5' Image component		
				prompt, // string  in 'Prompt' Textbox component		
				addedPrompt, // string  in 'Added Prompt' Textbox component		
				negPrompt, // string  in 'Negative Prompt' Textbox component		
				nbSteps, // number (numeric value between 10 and 50) in 'Denoise Steps' Slider component		
				scaleFactor, // number (numeric value between 1 and 4) in 'Upsample Scale' Slider component		
				conditioningScale, // number (numeric value between 0.5 and 1.5) in 'Conditioning Scale' Slider component		
				classifierFreeGuidance, // number (numeric value between 0.1 and 10.0) in 'Classier-free Guidance' Slider component		
				seed || generateSeed(), // number (numeric value between -1 and 2147483647) in 'Seed' Slider component
      ],
    }),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  const { data } = await res.json()
 
  // Recommendation: handle errors
  if (res.status !== 200 || !Array.isArray(data)) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data (status: ${res.status})`)
  }
  // console.log("data:", data.slice(0, 50))

  const base64Content = (data?.[0] || "") as string

  if (!base64Content) {
    throw new Error(`invalid response (no content)`)
  }
 
  // console.log("upscaling base64Content:", addBase64HeaderToPng(base64Content).slice(0, 50))

  return addBase64HeaderToPng(base64Content)
}