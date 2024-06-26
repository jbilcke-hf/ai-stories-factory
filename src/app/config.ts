export const defaultPrompt =
  // "Yesterday I was walking in SF when I saw a zebra"
  // "underwater footage of the loch ness"
  // "beautiful underwater footage of a clownfish swimming around coral" // who discovers a secret pirate treasure chest"
  // "beautiful footage of a Caribbean fishing village and bay, sail ships, during golden hour, no captions"
  "videogame gameplay footage, first person, exploring some mysterious ruins, no commentary"

export const localStorageStoryDraftKey = "AI_STORIES_FACTORY_STORY_PROMPT_DRAFT"

export const localStorageHuggingFaceOAuthKey = "AI_STORIES_FACTORY_HUGGING_FACE_OAUTH"

export const oauthClientId = `${process.env.NEXT_PUBLIC_HUGGING_FACE_OAUTH_CLIENT_ID || ""}`
export const oauthScopes = "openid profile inference-api"
export const enableHuggingFaceOAuth = `${process.env.NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH || ""}` === "true"
export const enableHuggingFaceOAuthWall = `${process.env.NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH_WALL || ""}` === "true"
