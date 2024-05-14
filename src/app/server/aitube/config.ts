
export const serverHuggingfaceApiKey = `${process.env.HF_API_TOKEN || ""}`

// initially I used 1024x512 (a 2:1 ratio)
// but that is a bit too extreme, most phones only take 16:9
// we can also try this
// > 896x512
export const RESOLUTION_LONG = 896 // 832 // 768
export const RESOLUTION_SHORT = 512 // 448 // 384

// ValueError: `height` and `width` have to be divisible by 8 but are 512 and 1.