"use client"

import { Button } from "@/components/ui/button"
import { useOAuth } from "@/lib/oauth/useOAuth"

function Login() {
  const { login } = useOAuth()
  return <Button
    variant="ghost"
    onClick={login}
    className="
    text-xs
    bg-lime-500 dark:bg-lime-500
    text-stone-950/80 dark:text-stone-950/80
    hover:bg-lime-400 dark:hover:bg-lime-400
    hover:text-stone-950/100 dark:hover:text-stone-950/100
    ">Login with Hugging Face</Button>
}

export default Login