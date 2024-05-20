import { ClapEntity } from "@aitube/clap"
import { HiCog6Tooth } from "react-icons/hi2"
import { MdFace2 } from "react-icons/md"
import { FaWrench } from "react-icons/fa6"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useEntityPicture } from "@/lib/hooks/useEntityPicture"
import { cn } from "@/lib/utils"

export function CharacterButton({
  entity
}: {
  entity?: ClapEntity
}) {
  const { picture, openFilePicker } = useEntityPicture(entity)

  return (
    <Tooltip>
      <TooltipTrigger asChild><div className={cn(`
      flex flex-row

      justify-between items-center
      cursor-pointer
      transition-all duration-150 ease-in-out
      hover:scale-110 active:scale-150
    text-stone-800
      hover:text-stone-950
      active:text-black
      group
      `,
      // picture ? ` opacity-100 ` : `opacity-60`
      )}
      onClick={openFilePicker}>
      
        {picture
        ? <div className={cn(`
          flex
          w-10 h-10 rounded-full
          overflow-hidden
        `,
        picture
        ? `
        border-2 group-hover:border
        border-stone-950/70 dark:border-stone-950/70
        group-hover:shadow-md
        `
        : ``
        )}>
            <img
            className="object-cover"
            src={picture}
            />
          </div>: <MdFace2 size={24} />}
 
        <div className="
        -ml-2 mt-10
        flex flex-row items-center justify-center
        transition-all duration-150 ease-out
        group-hover:animate-swing
        opacity-0 group-hover:opacity-100
        scale-0 group-hover:scale-100
        "
        >
          {picture
          ? <FaWrench size={16} />
          : null
          }
        </div>
      </div></TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs font-normal text-stone-100/90 text-center">
        Add a picture of yourself<br/>to be part of the story!
        </p>
      </TooltipContent>
    </Tooltip> 
  )
}