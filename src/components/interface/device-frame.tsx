import { ReactNode } from "react"
import Image from "next/image"

import { DeviceFrameset } from "react-device-frameset"
import "react-device-frameset/styles/marvel-devices.min.css"

import { useOrientation } from "@/lib/hooks"
import { cn } from "@/lib/utils"

import HFLogo from "../../app/hf-logo.svg"

export function DeviceFrame({ children, companion, showFrame = false }: {
  children?: ReactNode
  companion?: ReactNode
  showFrame?: boolean
}) {

  const { isLandscape, isPortrait } = useOrientation()

  if (!showFrame) {
    return children
  }

  return (
    <div className={cn(`
      -mt-8 md:mt-0
      transition-all duration-200 ease-in-out
    `,
    isLandscape
      ? `scale-[0.9] md:scale-[0.75] lg:scale-[0.9] xl:scale-[1.0] 2xl:scale-[1.1]`
      : `scale-[0.8] md:scale-[0.9] lg:scale-[1.1]`
      )}>
      <DeviceFrameset
        device="Nexus 5"
        // color="black"

        landscape={isLandscape}

        // note 1: videos are generated in 1024x576 or 576x1024
        // so we need to keep the same ratio here

        // note 2: width and height are fixed, if width always stays 512
        // that's because the landscape={} parameter will do the switch for us

        width={288}
        height={512}
      >
        <div className="
        flex flex-col items-center justify-center
        w-full h-full
        bg-black text-white
        ">
          {children}
        </div>

        <div className={cn(`
          fixed
          flex flex-row items-center justify-center
          bg-transparent
          font-sans
          -mb-0
          `,
          isLandscape ? 'h-4' : 'h-14'
        )}
          style={{ width: isPortrait ? 288 : 512 }}>
          <span className="text-stone-100/50 text-4xs"
            style={{ textShadow: "rgb(0 0 0 / 80%) 0px 0px 2px" }}>
            Powered by
          </span>
          <span className="ml-1 mr-0.5">
            <Image src={HFLogo} alt="Hugging Face" width={14} height={13} />
          </span>
          <span className="text-stone-100/80 text-3xs font-semibold"
            style={{ textShadow: "rgb(0 0 0 / 80%) 0px 0px 2px" }}>Hugging Face</span>
    
        </div>
      </DeviceFrameset>
      
      {companion}
    </div>
  )
}