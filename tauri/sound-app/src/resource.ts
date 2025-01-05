import Data from "./data.json" with { type: "json" }

type Sound = {
  fileName: string
  text: string
  keyword: string[]
}

export const sounds: Sound[] = Data

let isPlaying = false
export const soundService = {
  getSounds: () => sounds,
  getSound: (keyword: string) => sounds.find(sound => sound.keyword.includes(keyword)),
  play: async (fileName: string) => {
    if (!fileName) return
    if (isPlaying) return
    
    isPlaying = true

    try {
      const audio = new Audio(`./${fileName}`)
      audio.onended = () => isPlaying = false

      await audio.play()      
    } catch (error) {
      console.error(`Error playing ${fileName}`)
      isPlaying = false
    }
  }
}