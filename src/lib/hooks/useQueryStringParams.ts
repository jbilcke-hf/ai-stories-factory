import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ClapMediaOrientation } from "@aitube/clap"

import { useStore } from "@/app/store"

import { useStoryPromptDraft } from "./useStoryPromptDraft"
import { useIsBusy } from "./useIsBusy"
import { useProcessors } from "./useProcessors"

export function useQueryStringParams() {
  const { storyPromptDraft, setStoryPromptDraft, promptDraftRef } = useStoryPromptDraft()
  const { busyRef } = useIsBusy()
  const { handleSubmit } = useProcessors()
  
  const setOrientation = useStore(s => s.setOrientation)
  // this is how we support query string parameters
  // ?prompt=hello <- set a default prompt
  // ?prompt=hello&autorun=true <- automatically run the app
  // ?orientation=landscape <- can be "landscape" or "portrait" (default)
  const searchParams = useSearchParams()
  const queryStringPrompt = (searchParams?.get('prompt') as string) || ""
  const queryStringAutorun = (searchParams?.get('autorun') as string) || ""
  const queryStringOrientation = (searchParams?.get('orientation') as string) || ""

  useEffect(() => {
    if (queryStringOrientation?.length > 1) {
      console.log(`orientation = "${queryStringOrientation}"`)
      const orientation =
        queryStringOrientation.trim().toLowerCase() === "landscape"
        ? ClapMediaOrientation.LANDSCAPE
        : ClapMediaOrientation.PORTRAIT
      setOrientation(orientation)
    }
    if (queryStringPrompt?.length > 1) {
      console.log(`prompt = "${queryStringPrompt}"`)
      if (queryStringPrompt !== promptDraftRef.current) {
        setStoryPromptDraft(queryStringPrompt)
      }
      const maybeAutorun = queryStringAutorun.trim().toLowerCase()
      console.log(`autorun = "${maybeAutorun}"`)

      // note: during development we will be called twice,
      // which is why we have a guard on  busyRef.current
      if (maybeAutorun === "true" || maybeAutorun === "1" && !busyRef.current) {
        handleSubmit()
      }
    }
  }, [queryStringPrompt, queryStringAutorun, queryStringOrientation])

}