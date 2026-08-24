import { useState, useCallback } from 'react'

interface UseCounterOptions {
  initialValue?: number
  step?: number
  min?: number
  max?: number
}

interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (value: number) => void
}

export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const { initialValue = 0, step = 1, min, max } = options
  const [count, setCountState] = useState(initialValue)

  const clamp = useCallback(
    (value: number) => {
      let result = value
      if (min !== undefined) result = Math.max(min, result)
      if (max !== undefined) result = Math.min(max, result)
      return result
    },
    [min, max]
  )

  const increment = useCallback(() => {
    setCountState((prev) => clamp(prev + step))
  }, [step, clamp])

  const decrement = useCallback(() => {
    setCountState((prev) => clamp(prev - step))
  }, [step, clamp])

  const reset = useCallback(() => {
    setCountState(clamp(initialValue))
  }, [initialValue, clamp])

  const setCount = useCallback(
    (value: number) => {
      setCountState(clamp(value))
    },
    [clamp]
  )

  return { count, increment, decrement, reset, setCount }
}
