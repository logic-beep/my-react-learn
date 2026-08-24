import { useState, useEffect, useCallback } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(
  url: string | null,
  options?: RequestInit
): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!url) return

    let isCancelled = false

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`HTTP 错误: ${response.status}`)
        }
        const result = (await response.json()) as T
        if (!isCancelled) {
          setState({ data: result, loading: false, error: null })
        }
      } catch (err) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : '未知错误',
          })
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, [url, refetchTrigger, options])

  return { ...state, refetch }
}
