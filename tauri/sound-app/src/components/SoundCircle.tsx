import { useState } from "react"
import useGamepads, { Gamepads } from "./GameInput"
import { soundService } from "../resource"

export const SoundCircle = () => {
  const sounds = soundService.getSounds()

  const [gamepads, setGamepads] = useState<Gamepads>({})
  useGamepads((gamepads) => setGamepads(gamepads))

  const gamepad = gamepads[0]

  const targetPos = gamepad
    ? { x: gamepad.axes[2], y: gamepad.axes[3] }
    : { x: 0, y: 0 }

  const pressed = gamepad ? gamepad.buttons[0].pressed : false

  const direction = decide8direction(targetPos)

  if (pressed) {
    soundService.play(sounds[direction].fileName)
  }

  return (
    <div className="ring">
      <span
        className="target"
        style={{
          transform: `translate(-50%, -50%) translateX(${
            targetPos.x * 15
          }rem) translateY(${targetPos.y * 15}rem)`,
        }}
      >
        ✪
      </span>

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
              <span data-active={i === direction}>
                <a>{sound.text}</a>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function decide8direction(pos: { x: number; y: number }) {
  const angle = Math.atan2(pos.y, pos.x)
  const angle360 = (angle * 180) / Math.PI + 180
  const angle45 = angle360 / 45
  const direction = Math.round(angle45) % 8
  // console.log(`direction: ${direction}`)
  return direction
}
