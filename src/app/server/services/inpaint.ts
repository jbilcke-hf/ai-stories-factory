"use server"

import { InpaintingParams } from "@/types"

import { addBase64HeaderToPng } from "../utils/addBase64HeaderToPng"
import { segmentToInpaintingMask } from "../utils/segmentToInpaintingMask"

const gradioApi = `https://jbilcke-hf-inpainting-api.hf.space`
const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

export async function inpaint({
  imageAsBase64,
  maskAsBase64,
  positivePrompt = "",
  negativePrompt = "",
  guidanceScale = 7.5,
  numInferenceSteps = 20,
  strength = 0.99,
  scheduler = "EulerDiscreteScheduler"
}: InpaintingParams): Promise<string> {

  const posPrompt = [
    positivePrompt,
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

  // the segmentation mask is a RGB color one (that's how we can split layers)
  // so we first convert it to either black or white
  const inpaintingMaskAsBase64 = await segmentToInpaintingMask(maskAsBase64)
  
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
        inpaintingMaskAsBase64,
        posPrompt,
        negPrompt,
        guidanceScale,
        numInferenceSteps,
        strength,
        scheduler,
      ],
    }),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  const { data } = await res.json()
  
  // console.log("data:", data)
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

  return addBase64HeaderToPng(base64Content)
}