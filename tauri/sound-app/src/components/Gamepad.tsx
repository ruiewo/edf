import { useState } from "react"
import useGamepads, { Gamepads } from "./GameInput"
import { GamepadSvg } from "./GamepadSvg"

export const Gamepad = () => {
  const [gamepads, setGamepads] = useState<Gamepads>({})
  useGamepads((gamepads) => setGamepads(gamepads))

  const gamepadDisplay = Object.keys(gamepads).map((gamepadId) => {
    const gamepad = gamepads[gamepadId]
    const buttons =
      gamepad.buttons &&
      gamepad.buttons.map((button, index) => (
        <div>
          {index}: {button.pressed ? "True" : "False"}
        </div>
      ))

    return (
      <div>
        <h2>{gamepad.id}</h2>
        {buttons}
      </div>
    )
  })

  const currentGamepad = gamepads && gamepads[0]

  return (
    <div className="Gamepads">
      <h1>Gamepads</h1>
      {/* {gamepadDisplay} */}
      {currentGamepad && (
        <>
          <GamepadSvg
            directionUp={currentGamepad.buttons[12].pressed}
            directionDown={currentGamepad.buttons[13].pressed}
            directionLeft={currentGamepad.buttons[14].pressed}
            directionRight={currentGamepad.buttons[15].pressed}
            buttonDown={currentGamepad.buttons[0].pressed}
            buttonRight={currentGamepad.buttons[1].pressed}
            buttonLeft={currentGamepad.buttons[2].pressed}
            buttonUp={currentGamepad.buttons[3].pressed}
            select={currentGamepad.buttons[8].pressed}
            start={currentGamepad.buttons[9].pressed}
            analogLeft={
              gamepads[0].axes[0] > 0.3 ||
              gamepads[0].axes[0] < -0.3 ||
              gamepads[0].axes[1] > 0.3 ||
              gamepads[0].axes[1] < -0.3
            }
            analogRight={
              gamepads[0].axes[2] > 0.3 ||
              gamepads[0].axes[2] < -0.3 ||
              gamepads[0].axes[3] > 0.3 ||
              gamepads[0].axes[3] < -0.3
            }
            analogLeftDirection={[
              calcDirectionHorizontal(gamepads[0].axes[0]),
              calcDirectionVertical(gamepads[0].axes[1]),
            ]}
            analogRightDirection={[
              calcDirectionHorizontal(gamepads[0].axes[2]),
              calcDirectionVertical(gamepads[0].axes[3]),
            ]}
          />
          <h3>Player 1</h3>
        </>
      )}
    </div>
  )
}

const calcDirectionVertical = (axe: number) => {
  // Up
  if (axe < -0.2) {
    return "up"
  }
  // Down
  if (axe > 0.2) {
    return "down"
  }
}

const calcDirectionHorizontal = (axe: number) => {
  // Left
  if (axe < -0.2) {
    return "left"
  }
  // Right
  if (axe > 0.2) {
    return "right"
  }
}
