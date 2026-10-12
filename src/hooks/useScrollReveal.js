import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook to detect when an element scrolls into view.
 * Perfect for 60fps scroll-triggered animations without heavy libraries.
 *
 * @param {Object} options - IntersectionObserver options
 * @param {number} [options.threshold=0.15] - Percentage of element visible before trigger
 * @param {string} [options.rootMargin='0px 0px -60px 0px'] - Viewport offset margin
 * @param {boolean} [options.once=true] - Trigger once or repeatedly
 * @returns {[import('react').RefObject, boolean]} [ref, isRevealed]
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    once = true
  } = options

  const ref = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Fallback if IntersectionObserver is not supported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          setIsRevealed(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, once])

  return [ref, isRevealed]
}
