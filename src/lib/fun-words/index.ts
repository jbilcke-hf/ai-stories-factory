import funWordList from "fun-word-list"
import { filterSensitiveContent, sensitiveTopics } from "./filterSensitiveContent"

const {
  addons, // Fragments to add to the end of sentences for different moods. Many include preceding commas or periods.
  adjectives,  // For use with `nouns` or `concepts`
  concepts: rawConcepts, // Complex nouns
  descriptions, // For use with `locations`
  gametypes, // Video game genres/playstyles/feels
  locations, // Nouns that represent places
  nouns: rawNouns, // Simple things that can act or be acted upon
  superlatives, // Adjectives that express the extremes of something. For use with `nouns`, `concepts`, or `locations`
  verbs: {  // All verbs in this list are used for acting in relation to another thing.
    secondPerson: verbSecondPerson,  // Verbs for use with "you" or "they" as in "you help the aardvark" or "they fight a bird"
    secondConcepts: verbSecondConcepts,  // Verbs for use with "you" or "they" in combination with `concepts` as in "you are helped by the King" or "they fight against traditions"
    thirdPerson: verbThirdPerson, // Verbs for use with `nouns` as in "The aardvark anticipates rain"
  }
} = funWordList

const nouns = rawNouns.filter(x => !sensitiveTopics.includes(x[0].toLowerCase().trim()))
const concepts = filterSensitiveContent(rawConcepts)

export {
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
}