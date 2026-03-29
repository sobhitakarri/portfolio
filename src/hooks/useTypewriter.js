import { useState, useEffect, useRef } from 'react'

/**
 * Custom typewriter hook — cycles through an array of strings
 * @param {string[]} texts - Array of strings to cycle through
 * @param {number} typeSpeed - Ms per character when typing
 * @param {number} deleteSpeed - Ms per character when deleting
 * @param {number} pauseTime - Ms to hold the completed word
 */
export function useTypewriter(texts, typeSpeed = 60, deleteSpeed = 35, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const currentText = texts[textIndex]

    const tick = () => {
      if (isPaused) {
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseTime)
        return
      }

      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
          timeoutRef.current = setTimeout(tick, typeSpeed)
        } else {
          setIsPaused(true)
          timeoutRef.current = setTimeout(tick, 0)
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
          timeoutRef.current = setTimeout(tick, deleteSpeed)
        } else {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
          timeoutRef.current = setTimeout(tick, 400)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, typeSpeed)
    return () => clearTimeout(timeoutRef.current)
  }, [displayText, isDeleting, isPaused, textIndex, texts, typeSpeed, deleteSpeed, pauseTime])

  return displayText
}
