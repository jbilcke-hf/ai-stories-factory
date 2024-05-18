import { ReactNode } from "react"
import { FaCloudDownloadAlt } from "react-icons/fa"

import { cn } from "@/lib/utils"

export function DownloadVideo({
  video = "",
  disabled = false,
  onClick,
  children = <>Download</>
}: {
  video?: string
  disabled?: boolean
  onClick: () => void
  children?: ReactNode
}) {

  return (
    <>{
      (video && video.length > 128)
      ? <div
      className={cn(`
      w-full
      flex flex-row
      items-center justify-center
      transition-all duration-150 ease-in-out

    text-stone-800

      group
      pt-2 md:pt-4
      `, 
      disabled ? 'opacity-50' : 'cursor-pointer opacity-100 hover:scale-110 active:scale-150 hover:text-stone-950 active:text-black'
      )}
      style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}
      onClick={disabled ? undefined : onClick}
    >
      <div className="
      text-base md:text-lg lg:text-xl
      transition-all duration-150 ease-out
      group-hover:animate-swing
      "><FaCloudDownloadAlt /></div>
      <div className="text-xs md:text-sm lg:text-base">&nbsp;{children}</div>
    </div> : null}</>
  )
}