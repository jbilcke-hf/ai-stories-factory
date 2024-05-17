import { useStore } from "@/app/store"
import { CharacterButton } from "./character-button"

export function Characters() {
  const currentClap = useStore(s => s.currentClap)
  

  return (
    <div className="flex flex-row space-x-0">
      {currentClap && currentClap.entities?.length > 0
        // now: we only support displaying ONE entity for now
        ? currentClap.entities.slice(0, 1).map(entity =>
          <CharacterButton key={entity.id} entity={entity} />
        )
        : <CharacterButton />
      }
    </div>
  )
}