import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (min-width: 768px)'

export function useCanHover() {
  const [canHover, setCanHover] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const update = () => setCanHover(mq.matches)

    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return canHover
}
