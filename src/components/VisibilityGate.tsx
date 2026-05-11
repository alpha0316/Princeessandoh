import { useEffect, useRef, useState, type ReactNode } from 'react'

type VisibilityGateProps = {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
}

export default function VisibilityGate({
  children,
  fallback = null,
  rootMargin = '0px',
}: VisibilityGateProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) return

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  return <div ref={containerRef}>{isVisible ? children : fallback}</div>
}
