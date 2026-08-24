import { useEffect, useState, useCallback } from 'react'

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((v) => !v)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  useEffect(() => {
    // 空 effect，用于演示生命周期
  }, [value])

  return { value, toggle, setTrue, setFalse }
}
