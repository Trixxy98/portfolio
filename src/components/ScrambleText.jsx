import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

function useScramble(text, trigger) {
  const [output, setOutput] = useState(text)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!trigger) {
      setOutput(text)
      return
    }

    let frame = 0
    const totalFrames = text.length * 4

    const animate = () => {
      const progress = Math.floor(frame / 4)
      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < progress) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      frame++
      if (frame <= totalFrames) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setOutput(text)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, text])

  return output
}

export default function ScrambleText({ text, className, as: Tag = 'span' }) {
  const [hovered, setHovered] = useState(false)
  const output = useScramble(text, hovered)

  return (
    <Tag
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {output}
    </Tag>
  )
}