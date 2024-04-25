"use server"

import { BackgroundRemovalParams } from "@/types"

import { addBase64HeaderToPng } from "../utils/addBase64HeaderToPng"

const gradioApi = `https://jbilcke-hf-background-removal-api.hf.space`
const microserviceApiKey = `${process.env.MICROSERVICE_API_SECRET_TOKEN || ""}`

export async function removeBackground({
  imageAsBase64,
}: BackgroundRemovalParams): Promise<string> {

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
        imageAsBase64,
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