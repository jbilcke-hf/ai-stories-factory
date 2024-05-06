
export const serverHuggingfaceApiKey = `${process.env.HF_API_TOKEN || ""}`

// initially I used 1024x512 (a 2:1 ratio)
// but that is a bit too extreme, most phones only take 16:9
export const RESOLUTION_LONG = 1024
export const RESOLUTION_SHORT = 576
