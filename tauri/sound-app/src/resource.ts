import Data from "./data.json" with { type: "json" }

type Sound = {
  fileName: string
  text: string
  keyword: string[]
}

export const sounds: Sound[] = Data

export const soundService = {
  getSounds: () => sounds,
  getSound: (keyword: string) => sounds.find(sound => sound.keyword.includes(keyword)),
  play: async (fileName: string) => {
    if (!fileName)       return
    
    try {
      const audio = new Audio(`./${fileName}`)
      await audio.play()
    } catch (error) {
      console.error(`Error playing ${fileName}`)
    }
  }
}