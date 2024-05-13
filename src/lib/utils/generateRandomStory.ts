import { pick } from "@/lib/utils/pick"
import {
  addons, // Fragments to add to the end of sentences for different moods. Many include preceding commas or periods.
  adjectives,  // For use with `nouns` or `concepts`
  concepts, // Complex nouns
  descriptions, // For use with `locations`
  gametypes, // Video game genres/playstyles/feels
  locations, // Nouns that represent places
  nouns, // Simple things that can act or be acted upon
  superlatives, // Adjectives that express the extremes of something. For use with `nouns`, `concepts`, or `locations`
  verbSecondPerson,  // Verbs for use with "you" or "they" as in "you help the aardvark" or "they fight a bird"
  verbSecondConcepts,  // Verbs for use with "you" or "they" in combination with `concepts` as in "you are helped by the King" or "they fight against traditions"
  verbThirdPerson, // Verbs for use with `nouns` as in "The aardvark anticipates rain"
} from "@/lib/fun-words"


const moodTypes = [
  "A fantasy",
  "An epic",
  "A beautiful",
  "A science-fiction",
  "A boring",
  "A sad",
  "A cheerful",
  "A funny",
  "A funny",
  "A trending",
  "A cute",
  "An interesting",
  "An outrageous",
  "A dark",
  "A 3D-rendered",
  "An animated",
  "Burlesque",
  "Short",
  "Long",
  "An inspiring",
  "A marketing",
  "A commercial",
  "An internet",
  "A stupid",
  "A vintage",
]

const videoTypes = [
  "fail compilation",
  "influencer meltdown",
  "breaking news",
  "newscast",
  "politician speech",
  "found footage",
  "meme video",
  "rap video",
  "animal documentary",
  "music video",
  "live video",
  "advert",
  "instagram video",
  "short movie",
  "documentary",
  "movie trailer",
  "TikTok video",
]

const locationTypes = [
  "in some",
  // "set somewhere in",
  "near some",
]

export function generateRandomStory() {

  let pickedWords: any[] = []

  function randomize<T>(words: T[]): T {
    const picked = pick(words, '' as T)
    pickedWords.push(picked as any)
    return picked
  } 

  return `${
    pick(moodTypes, '')
  } ${
    pick(videoTypes, '')
  }${
    Math.random() > 0.5 ? "," : ""
  } ${
    pick(locationTypes, '')
  } ${
    randomize(descriptions)
  } and ${
    randomize(descriptions)
  } ${
    randomize(locations)
  }. It is about ${
    randomize(nouns)[1]
  }, ${
    randomize(nouns)[0]
  } ${
    randomize(nouns)[1]
  } and..`
}