import { DynamicConfig } from "./config"

export const getDefaultDynamicConfig = (): DynamicConfig => ({
  oauthClientId: "",
  oauthScopes: "openid profile inference-api",
  enableHuggingFaceOAuth: false,
  enableHuggingFaceOAuthWall: false,
})