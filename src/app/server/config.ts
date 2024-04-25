
export const serverHuggingfaceApiKey = `${process.env.HF_API_TOKEN || ""}`

export const aitubeUrl = `${process.env.AI_TUBE_URL || "" }`
export const aitubeApiUrl = aitubeUrl + (aitubeUrl.endsWith("/") ? "" : "/") + "api/"

console.log("debug:", {
  aitubeUrl,
  aitubeApiUrl,
})