import { useEffect, useRef } from 'react'

/**
 * Editorial scroll reveal — fades up + unblurs once in view.
 * rootMargin keeps the trigger slightly lazy (more of the block visible).
 */
export function useScrollFade(threshold = 0.18) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -12% 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
