import { useStore } from "@/app/store"
import { CharacterButton } from "./character-button"

export function Characters() {
  const fullClap = useStore(s => s.fullClap)
  

  return (
    <div className="flex flex-row space-x-0">
      {fullClap && fullClap.entities?.length > 0
        // now: we only support displaying ONE entity for now
        ? fullClap.entities.slice(0, 1).map(entity =>
          <CharacterButton key={entity.id} entity={entity} />
        )
        : <CharacterButton />
      }
    </div>
  )
}