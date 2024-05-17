"use client"

import { useLocalStorage } from "usehooks-ts"
import { OAuthResult } from "@huggingface/hub"

import { localStorageHuggingFaceOAuthKey } from "@/app/config"

import { getValidOAuth } from "./getValidOAuth"

export function usePersistedOAuth(): [OAuthResult | undefined, (oauthResult: OAuthResult) => void] {
  const [serializedHuggingFaceOAuth, setSerializedHuggingFaceOAuth] = useLocalStorage<string>(
    localStorageHuggingFaceOAuthKey,
    ""
  )

  const oauthResult = getValidOAuth(serializedHuggingFaceOAuth)

  const setOAuthResult = (oauthResult: OAuthResult) => {
    setSerializedHuggingFaceOAuth(JSON.stringify(oauthResult))
  }

  return [oauthResult, setOAuthResult]
}