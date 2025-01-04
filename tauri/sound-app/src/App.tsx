import { soundService } from "./resource"
import "./App.css"

function App() {
  const sounds = soundService.getSounds()

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
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default App
