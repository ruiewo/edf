import { useEffect, useState } from "react"

export const useGamepad = () => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null)

  const handleGamepad = (event: GamepadEvent) => {
    setGamepad(event.gamepad)
  }

  useEffect(() => {
    window.addEventListener("gamepadconnected", handleGamepad)
    window.addEventListener("gamepaddisconnected", handleGamepad)

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepad)
      window.removeEventListener("gamepaddisconnected", handleGamepad)
    }
  }, [])

  return gamepad
}

function updateStatus() {
  const gamepads = navigator.getGamepads()
  for (const gamepad of gamepads) {
    if (gamepad) {
      console.log(gamepad.id)
      console.log(gamepad.buttons)
      console.log(gamepad.axes)
    }
  }
}
