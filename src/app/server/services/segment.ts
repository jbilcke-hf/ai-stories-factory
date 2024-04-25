"use server"

import { SemanticLayer, SemanticLayers } from "@/lib/config"

import { addBase64HeaderToPng } from "../utils/addBase64HeaderToPng"
import { segmentsToInpaintingMasks } from "../utils/segmentsToInpaintingMasks"
import { alphaToWhite } from "../utils/alphaToWhite"

const gradioApi = `https://jbilcke-hf-segmentation-api.hf.space`
const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

export type SegmentationResult = {
  id: number
  box: number[] // [299.63092041015625, 111.72967529296875, 661.6744384765625, 692.8449096679688],
  label: string
  score: number
  color: number[] // [0.8506358185563304, 0.9904733533937202, 0.32005103765589715, 1.0]
}

type SegmentationApiResponse = {
  data: SegmentationResult[]
  bitmap: string // base64 png
}

export type SegmentationResults = {
  data: Partial<Record<SemanticLayer, SegmentationResult>>
  bitmap: string // base64 png
}

export async function segment({
  imageAsBase64,
  layers,
}:  {
  imageAsBase64: string
  layers: SemanticLayers
}): Promise<SemanticLayers> {

  const emptyResponse: SemanticLayers = {}

  Object.entries(layers).forEach(([key, value]) => {
    emptyResponse[key as SemanticLayer] = ""
  })

  // console.log(`calling `+ gradioApi + (gradioApi.endsWith("/") ? "" : "/") + "api/predict")

  const detectionPrompt = Object.keys(layers).map(x => x.trim().toLowerCase()).join(" . ")

  // min 0, max 1, value 0.3, step 0.001
  const boxThreshold = 0.3

  // min 0, max 1, value 0.25, step 0.001
  const textThreshold = 0.25

  // min 0, max 1, value 0.8, step 0.001
  const iouThreshold = 0.8

  // SAM is finicky, it doesn't work on images with an alpha channel
  // so we first need to remove that
  let imageToSegmentInBase64 = ""
  imageToSegmentInBase64 = imageAsBase64
  /*
  try {
    imageToSegmentInBase64 = await alphaToWhite(imageAsBase64)
  } catch (err) {
    console.error(`failed to get a valid imageToSegmentInBase64:`, err)
    return emptyResponse
  }
  */

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
        imageToSegmentInBase64,
        detectionPrompt,
        boxThreshold,
        textThreshold,
        iouThreshold,
      ],
    }),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  const layeredResults = {} as Partial<Record<SemanticLayer, SegmentationResult>>

  const { data } = await res.json()
  
  // console.log("data:", data)
  // Recommendation: handle errors
  if (res.status !== 200 || !Array.isArray(data)) {
    // This will activate the closest `error.js` Error Boundary
    console.error(`Failed to fetch data (${res.status} error: ${res.statusText})`, res)
    return emptyResponse
  }
  // console.log("data:", data.slice(0, 50))

  let apiResponse: SegmentationApiResponse = {
    data: [],
    bitmap: ""
  }
  
  try {
    apiResponse = JSON.parse((data?.[0] || "{}")) as SegmentationApiResponse
  } catch (err) {
    console.error(`Failed to parse api response`, err)
    return emptyResponse
  }

  // console.log("segmentation", segmentation)
  // console.log("segmentation.data:", segmentation.data)
  const items = [...(apiResponse.data || [])]
  // console.log("items:", items)

  const bitmap = apiResponse.bitmap ? addBase64HeaderToPng(apiResponse.bitmap) : ""

  Object.entries(layers).forEach(([key, value]) => {
    const match = items.find(x => `${key || ""}`.trim().toLowerCase() === `${x.label || ""}`.trim().toLowerCase())
    if (match) {
      layeredResults[key as SemanticLayer] = match
    }
  })

  const maskLayers = await segmentsToInpaintingMasks({
    data: layeredResults,
    bitmap,
  })

  return maskLayers
}