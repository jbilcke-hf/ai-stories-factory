"use server"

import { DynamicConfig } from "@/lib/config/config"
import { getValidBoolean } from "@/lib/utils/getValidBoolean"

export async function getDynamicConfig(): Promise<DynamicConfig> {
  const config = {
    //oauthClientId: getValidString(process.env.HUGGING_FACE_OAUTH_CLIENT_ID, ""),
    oauthClientId: `${process.env.NEXT_PUBLIC_HUGGING_FACE_OAUTH_CLIENT_ID || ""}`,

    oauthScopes: "openid profile inference-api",
    enableHuggingFaceOAuth: getValidBoolean(process.env.NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH, false),
    enableHuggingFaceOAuthWall: getValidBoolean(process.env.NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH_WALL, false),
  }

  return config
}