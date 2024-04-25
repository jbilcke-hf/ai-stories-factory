export function addBase64HeaderToPng(base64Data: string) {
  if (typeof base64Data !== "string" || !base64Data) {
    return ""
  }
  if (base64Data.startsWith('data:')) {
    if (base64Data.startsWith('data:image/png;base64,')) {
      return base64Data
    } else {
      throw new Error("fatal: the input string is NOT a PNG image!")
    }
  } else {
    return `data:image/png;base64,${base64Data}`
  }
}