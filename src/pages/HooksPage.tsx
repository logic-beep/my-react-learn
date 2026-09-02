import { useState } from 'react'
import { SourceCode } from '../components/SourceCode'
import { useCounter } from '../hooks/useCounter'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useDebounce } from '../hooks/useDebounce'
import { useToggle } from '../hooks/useToggle'
import { useFetch } from '../hooks/useFetch'

interface Todo {
  id: number
  title: string
  completed: boolean
}

// -----------------------------------------------------
// UseCounterDemo 源码快照：供 1️⃣ useCounter 卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示卡片的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USECOUNTER_DEMO_SOURCE = `// 📄 上方 1️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为独立示例形态；页面上其它卡片共用的 state 未包含）
function UseCounterDemo() {
  const counter = useCounter({ initialValue: 0, min: -10, max: 10 })

  return (
    <div className="card">
      <h3>1️⃣ useCounter - 自定义计数器 Hook</h3>
      <p className="info-text">
        支持 step、min、max 配置，封装加减重置逻辑
      </p>
      <div className="count-display" style={{ fontSize: '2rem' }}>
        {counter.count}
      </div>
      <button onClick={counter.decrement}>- 1</button>
      <button className="primary" onClick={counter.increment}>
        + 1
      </button>
      <button onClick={counter.reset}>重置</button>
      <button onClick={() => counter.setCount(5)}>设为 5</button>
    </div>
  )
}

// ─── 自定义 Hook 完整源码：src/hooks/useCounter.ts ───
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
}`

// -----------------------------------------------------
// UseLocalStorageDemo 源码快照：供 2️⃣ useLocalStorage 卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示卡片的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USELOCALSTORAGE_DEMO_SOURCE = `// 📄 上方 2️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为独立示例形态；页面上其它卡片共用的 state 未包含）
function UseLocalStorageDemo() {
  const [storedName, setStoredName, removeStoredName] = useLocalStorage<string>(
    'demo-name',
    ''
  )
  const [nameInput, setNameInput] = useState('')
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')

  return (
    <div className="card">
      <h3>2️⃣ useLocalStorage - 本地存储持久化</h3>
      <p className="info-text">
        自动将状态同步到 localStorage，刷新页面不会丢失
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <strong>存储的名字：</strong>
        <span className="tag">{storedName || '(空)'}</span>
        <button onClick={removeStoredName} className="danger">
          删除存储
        </button>
      </div>

      <input
        type="text"
        placeholder="输入名字后点击保存"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <button
        className="primary"
        onClick={() => setStoredName(nameInput)}
        disabled={!nameInput}
      >
        保存到 localStorage
      </button>

      <div style={{ marginTop: '1rem' }}>
        <strong>主题设置（localStorage 持久化）：</strong>
        <span className="tag">{theme}</span>
        <button onClick={() => setTheme('light')}>设置浅色</button>
        <button onClick={() => setTheme('dark')}>设置深色</button>
      </div>
    </div>
  )
}

// ─── 自定义 Hook 完整源码：src/hooks/useLocalStorage.ts ───
import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(\`读取 localStorage key "\${key}" 失败:\`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(\`写入 localStorage key "\${key}" 失败:\`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(\`删除 localStorage key "\${key}" 失败:\`, error)
    }
  }, [key, initialValue])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return
      try {
        setStoredValue(JSON.parse(e.newValue) as T)
      } catch {
        // 忽略解析错误
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue] as const
}`

// -----------------------------------------------------
// UseDebounceDemo 源码快照：供 3️⃣ useDebounce 卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示卡片的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USEDEBOUNCE_DEMO_SOURCE = `// 📄 上方 3️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为独立示例形态；页面上其它卡片共用的 state 未包含）
function UseDebounceDemo() {
  const [nameInput, setNameInput] = useState('')
  const debouncedName = useDebounce(nameInput, 500)

  return (
    <div className="card">
      <h3>3️⃣ useDebounce - 防抖 Hook</h3>
      <p className="info-text">
        常用于搜索框输入，延迟 500ms 后才更新 debouncedValue
      </p>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <strong>实时输入值：</strong>
          <span className="tag">{nameInput || '(空)'}</span>
        </div>
        <div>
          <strong>防抖后的值（500ms）：</strong>
          <span className="tag">{debouncedName || '(空)'}</span>
        </div>
      </div>
      <p className="info-text" style={{ marginTop: '1rem' }}>
        💡 试着快速输入文字，观察两个值的变化差异
      </p>
    </div>
  )
}

// ─── 自定义 Hook 完整源码：src/hooks/useDebounce.ts ───
import { useState, useEffect, useRef } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}`

// -----------------------------------------------------
// UseToggleDemo 源码快照：供 4️⃣ useToggle 卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示卡片的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USETOGGLE_DEMO_SOURCE = `// 📄 上方 4️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为独立示例形态；页面上其它卡片共用的 state 未包含）
function UseToggleDemo() {
  const modal = useToggle(false)

  return (
    <div className="card">
      <h3>4️⃣ useToggle - 开关 Hook</h3>
      <p className="info-text">封装布尔值的切换逻辑</p>
      <div>
        <strong>模态框状态：</strong>
        <span className="tag">{modal.value ? '打开' : '关闭'}</span>
      </div>
      <button className="primary" onClick={modal.toggle}>
        切换
      </button>
      <button onClick={modal.setTrue}>打开</button>
      <button onClick={modal.setFalse}>关闭</button>

      {modal.value && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#646cff22',
            borderRadius: '8px',
            border: '1px solid #646cff',
          }}
        >
          这是模拟的模态框内容！点击关闭按钮可以隐藏
        </div>
      )}
    </div>
  )
}

// ─── 自定义 Hook 完整源码：src/hooks/useToggle.ts ───
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
}`

// -----------------------------------------------------
// UseFetchDemo 源码快照：供 5️⃣ useFetch 卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示卡片的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USEFETCH_DEMO_SOURCE = `// 📄 上方 5️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为独立示例形态；页面上其它卡片共用的 state 未包含）
interface Todo {
  id: number
  title: string
  completed: boolean
}

function UseFetchDemo() {
  const {
    data: todos,
    loading,
    error,
    refetch,
  } = useFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')

  return (
    <div className="card">
      <h3>5️⃣ useFetch - 网络请求 Hook</h3>
      <p className="info-text">封装 loading、error、data 状态和 refetch</p>
      <button className="primary" onClick={refetch}>
        🔄 重新请求
      </button>

      {loading && <p style={{ color: '#646cff' }}>加载中...</p>}
      {error && <p style={{ color: '#f87171' }}>错误: {error}</p>}
      {todos && (
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: todo.completed ? '#4ade80' : '#fbbf24' }}>
                {todo.completed ? '✅' : '⬜'}
              </span>{' '}
              {todo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── 自定义 Hook 完整源码：src/hooks/useFetch.ts ───
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
          throw new Error(\`HTTP 错误: \${response.status}\`)
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
}`

function HooksPage() {
  const counter = useCounter({ initialValue: 0, min: -10, max: 10 })
  const [storedName, setStoredName, removeStoredName] = useLocalStorage<string>(
    'demo-name',
    ''
  )
  const [nameInput, setNameInput] = useState('')
  const debouncedName = useDebounce(nameInput, 500)
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')
  const modal = useToggle(false)
  const {
    data: todos,
    loading,
    error,
    refetch,
  } = useFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')

  return (
    <div>
      <div className="card">
        <h3>1️⃣ useCounter - 自定义计数器 Hook</h3>
        <p className="info-text">
          支持 step、min、max 配置，封装加减重置逻辑
        </p>
        <div className="count-display" style={{ fontSize: '2rem' }}>
          {counter.count}
        </div>
        <button onClick={counter.decrement}>- 1</button>
        <button className="primary" onClick={counter.increment}>
          + 1
        </button>
        <button onClick={counter.reset}>重置</button>
        <button onClick={() => counter.setCount(5)}>设为 5</button>

        <SourceCode label="UseCounterDemo（1️⃣ useCounter 示例）" code={USECOUNTER_DEMO_SOURCE} />
      </div>

      <div className="card">
        <h3>2️⃣ useLocalStorage - 本地存储持久化</h3>
        <p className="info-text">
          自动将状态同步到 localStorage，刷新页面不会丢失
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <strong>存储的名字：</strong>
          <span className="tag">{storedName || '(空)'}</span>
          <button onClick={removeStoredName} className="danger">
            删除存储
          </button>
        </div>

        <input
          type="text"
          placeholder="输入名字后点击保存"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <button
          className="primary"
          onClick={() => setStoredName(nameInput)}
          disabled={!nameInput}
        >
          保存到 localStorage
        </button>

        <div style={{ marginTop: '1rem' }}>
          <strong>主题设置（localStorage 持久化）：</strong>
          <span className="tag">{theme}</span>
          <button onClick={() => setTheme('light')}>设置浅色</button>
          <button onClick={() => setTheme('dark')}>设置深色</button>
        </div>

        <SourceCode label="UseLocalStorageDemo（2️⃣ useLocalStorage 示例）" code={USELOCALSTORAGE_DEMO_SOURCE} />
      </div>

      <div className="card">
        <h3>3️⃣ useDebounce - 防抖 Hook</h3>
        <p className="info-text">
          常用于搜索框输入，延迟 500ms 后才更新 debouncedValue
        </p>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <strong>实时输入值：</strong>
            <span className="tag">{nameInput || '(空)'}</span>
          </div>
          <div>
            <strong>防抖后的值（500ms）：</strong>
            <span className="tag">{debouncedName || '(空)'}</span>
          </div>
        </div>
        <p className="info-text" style={{ marginTop: '1rem' }}>
          💡 试着快速输入文字，观察两个值的变化差异
        </p>

        <SourceCode label="UseDebounceDemo（3️⃣ useDebounce 示例）" code={USEDEBOUNCE_DEMO_SOURCE} />
      </div>

      <div className="card">
        <h3>4️⃣ useToggle - 开关 Hook</h3>
        <p className="info-text">封装布尔值的切换逻辑</p>
        <div>
          <strong>模态框状态：</strong>
          <span className="tag">{modal.value ? '打开' : '关闭'}</span>
        </div>
        <button className="primary" onClick={modal.toggle}>
          切换
        </button>
        <button onClick={modal.setTrue}>打开</button>
        <button onClick={modal.setFalse}>关闭</button>

        {modal.value && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#646cff22',
              borderRadius: '8px',
              border: '1px solid #646cff',
            }}
          >
            这是模拟的模态框内容！点击关闭按钮可以隐藏
          </div>
        )}

        <SourceCode label="UseToggleDemo（4️⃣ useToggle 示例）" code={USETOGGLE_DEMO_SOURCE} />
      </div>

      <div className="card">
        <h3>5️⃣ useFetch - 网络请求 Hook</h3>
        <p className="info-text">封装 loading、error、data 状态和 refetch</p>
        <button className="primary" onClick={refetch}>
          🔄 重新请求
        </button>

        {loading && <p style={{ color: '#646cff' }}>加载中...</p>}
        {error && <p style={{ color: '#f87171' }}>错误: {error}</p>}
        {todos && (
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: todo.completed ? '#4ade80' : '#fbbf24' }}>
                  {todo.completed ? '✅' : '⬜'}
                </span>{' '}
                {todo.title}
              </li>
            ))}
          </ul>
        )}

        <SourceCode label="UseFetchDemo（5️⃣ useFetch 示例）" code={USEFETCH_DEMO_SOURCE} />
      </div>
    </div>
  )
}

export default HooksPage
