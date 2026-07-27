import { useRef, useState } from 'react'

interface SwipeableCardProps {
  children: React.ReactNode
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onLongPress?: () => void
}

export function SwipeableCard({ children, className = '', onSwipeLeft, onSwipeRight, onLongPress }: SwipeableCardProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const pointerStartX = useRef<number | null>(null)
  const longPressTimer = useRef<number | null>(null)

  function clearTimer() {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX
    setIsDragging(true)
    longPressTimer.current = window.setTimeout(() => {
      onLongPress?.()
    }, 450)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || pointerStartX.current === null) {
      return
    }

    const deltaX = event.clientX - pointerStartX.current
    if (Math.abs(deltaX) > 10) {
      clearTimer()
    }

    setOffsetX(Math.max(-120, Math.min(120, deltaX)))
  }

  function handlePointerUp() {
    if (offsetX < -80) {
      onSwipeLeft?.()
    } else if (offsetX > 80) {
      onSwipeRight?.()
    }

    pointerStartX.current = null
    setIsDragging(false)
    setOffsetX(0)
    clearTimer()
  }

  return (
    <div
      className={`touch-pan-y ${className}`}
      style={{ transform: `translateX(${offsetX}px)`, transition: isDragging ? 'none' : 'transform 200ms ease-out' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {children}
    </div>
  )
}
