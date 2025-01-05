import { Gamepad } from "./components/Gamepad"
import { SoundCircle } from "./components/SoundCircle"
import "./App.css"

export function App() {
  return (
    <main className="container">
      <SoundCircle />
      <Gamepad />
    </main>
  )
}
