import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import "./App.css"
import { soundService } from "./resource"

function App() {
  const [greetMsg, setGreetMsg] = useState("")
  const [name, setName] = useState("")

  const sounds = soundService.getSounds()

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }))
  }

  return (
    <main className="container">
      <div className="ring">
        <div className="cancel">
          <span>✪</span>
        </div>
        <div className="menu-wrapper">
          {new Array(8).fill(0).map((_, i) => {
            const sound = sounds[i] || { fileName: "", text: i, keyword: [] }

            return (
              <div
                key={i}
                className="menu"
                data-index={i}
                onClick={() => soundService.play(sound.fileName)}
              >
                <span>
                  <a>{sound.text}</a>
                </span>
                {/* <span>{sound.text}</span> */}
              </div>
            )
          })}
        </div>
      </div>

      <div className="ui-wrapper">
        <span className="button ctrl">★</span>
        <ul className="tip ctrl">
              
          <li className="slice">
            <span>✦asdf</span>
          </li>
              
          <li className="slice">
            <span>✿</span>
          </li>
              
          <li className="slice">
            <span>✵</span>
          </li>
              
          <li className="slice">
            <span>✪</span>
          </li>
              
          <li className="slice">
            <span>✪</span>
          </li>
        </ul>
      </div>

      <audio controls src="/TIKYUU6_VOICE.JA#16376.mp3"></audio>
      <a href="/TIKYUU6_VOICE.JA#16376.mp3">16376</a>

      {sounds.map((sound) => {
        return (
          <button
            key={sound.fileName}
            onClick={() => soundService.play(sound.fileName)}
          >
            {sound.text}
          </button>
        )
      })}

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          greet()
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  )
}

export default App
