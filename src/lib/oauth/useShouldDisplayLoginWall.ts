import { useDynamicConfig } from "../config/useDynamicConfig"

export function useShouldDisplayLoginWall() {
  const { config, isConfigReady } = useDynamicConfig()

  const clientId = config.oauthClientId
  const enableOAuth = config.enableHuggingFaceOAuth
  const enableOAuthWall = config.enableHuggingFaceOAuthWall

  const isConfigEnablingOAuthWall = Boolean(
    clientId &&
    enableOAuth &&
    enableOAuthWall
  )

  const shouldDisplayLoginWall =
  isConfigReady &&
  isConfigEnablingOAuthWall

  return shouldDisplayLoginWall
}