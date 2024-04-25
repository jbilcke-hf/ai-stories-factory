export function addBase64HeaderToJpeg(base64Data: string) {
  if (typeof base64Data !== "string" || !base64Data) {
    return ""
  }
  if (base64Data.startsWith('data:')) {
    if (base64Data.startsWith('data:image/jpeg;base64,')) {
      return base64Data
    } else {
      throw new Error("fatal: the input string is NOT a JPEG image!")
    }
  } else {
    return `data:image/jpeg;base64,${base64Data}`
  }
}