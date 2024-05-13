declare module 'fun-word-list' {
  import * as funWordList from 'fun-word-list';

  type FunWordList = {
    addons: string[] // Fragments to add to the end of sentences for different moods. Many include preceding commas or periods.
    adjectives: string[]  // For use with `nouns` or `concepts`
    concepts: string[] // Complex nouns
    descriptions: string[] // For use with `locations`
    gametypes: string[] // Video game genres/playstyles/feels
    locations: string[] // Nouns that represent places
    nouns: string[][]  // Simple things that can act or be acted upon

    superlatives: string[] // Adjectives that express the extremes of something. For use with `nouns`, `concepts`, or `locations`
    verbs: {  // All verbs in this list are used for acting in relation to another thing.
      secondPerson: string[]  // Verbs for use with "you" or "they" as in "you help the aardvark" or "they fight a bird"
      secondConcepts: string[]  // Verbs for use with "you" or "they" in combination with `concepts` as in "you are helped by the King" or "they fight against traditions"
      thirdPerson: string[] // Verbs for use with `nouns` as in "The aardvark anticipates rain"
    }
  }

 export default funWordList as FunWordList
}
