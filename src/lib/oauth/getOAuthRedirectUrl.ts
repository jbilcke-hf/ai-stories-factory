export function getOAuthRedirectUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000"
  }

  return (
    window.location.hostname === "aistoriesfactory.app" ? "https://aistoriesfactory.app"
    : window.location.hostname === "jbilcke-hf-ai-stories-factory.hf.space" ? "https://jbilcke-hf-ai-stories-factory.hf.space"
    : "http://localhost:3000"
  )
}