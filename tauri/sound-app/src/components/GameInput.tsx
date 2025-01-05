import { useEffect, useRef } from "react"

export type Gamepads = Record<number, Gamepad>
export default function useGamepads(callback: (x: Gamepads) => void) {
  const gamepads = useRef<Record<number, Gamepad>>({})
  const requestRef = useRef<number | undefined>()

  const haveEvents = "ongamepadconnected" in window

  const addGamepad = (gamepad: Gamepad) => {
    gamepads.current = {
      ...gamepads.current,
      [gamepad.index]: gamepad,
    }

    callback(gamepads.current)
  }

  const connectGamepadHandler = (e) => {
    addGamepad(e.gamepad)
  }

  const scanGamepads = () => {
    const detectedGamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : []

    for (const x of detectedGamepads) {
      if (x) {
        addGamepad(x)
      }
    }
  }

  useEffect(() => {
    window.addEventListener("gamepadconnected", connectGamepadHandler)

    return window.removeEventListener("gamepadconnected", connectGamepadHandler)
  })

  const animate: FrameRequestCallback = (time) => {
    if (!haveEvents) scanGamepads()
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  })

  return gamepads.current
}
