
// we don't want to display the login wall to people forking the project,

import { enableHuggingFaceOAuth, enableHuggingFaceOAuthWall, oauthClientId } from "@/app/config"

// or to people who selected no hugging face server at all
export function useShouldDisplayLoginWall() {

  const shouldDisplayLoginWall = Boolean(
    oauthClientId &&
    enableHuggingFaceOAuth &&
    enableHuggingFaceOAuthWall
  )

  return shouldDisplayLoginWall
}