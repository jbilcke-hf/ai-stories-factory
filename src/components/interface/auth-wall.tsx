
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Login } from "./login"

export function AuthWall({ show }: { show: boolean }) {
  return (
    <Dialog open={show}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid gap-4 py-4 text-stone-800 text-center text-xl">
        <p className="">
          The AI Stories Factory is an app to generate consistent video stories.
        </p>
        <p>
          By default it uses Hugging Face for story and image generation,<br/>
          our service is free of charge but we would like you to sign-in 👇
         </p>
         <p>
          <Login />
         </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}