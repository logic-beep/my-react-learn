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
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案）；修改下方演示卡片的真实 hook 调用/逻辑时请同步更新。
// -----------------------------------------------------
const USECOUNTER_DEMO_SOURCE = `// 📄 上方 1️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为骨架形态）
function UseCounterDemo() {
  const counter = useCounter({ initialValue: 0, min: -10, max: 10 })

  return (
    <div>
      <h3>1️⃣ useCounter - 自定义计数器 Hook</h3>
      当前值：{counter.count}
      <button onClick={counter.decrement}>- 1</button>
      <button onClick={counter.increment}>+ 1</button>
      <button onClick={counter.reset}>重置</button>
      <button onClick={() => counter.setCount(5)}>设为 5</button>
    </div>
  )
}

// ─── 自定义 Hook 核心实现（完整文件见 src/hooks/useCounter.ts）───
export function useCounter(options: UseCounterOptions = {}) {
  const { initialValue = 0, step = 1, min, max } = options
  const [count, setCountState] = useState(initialValue)

  // clamp：把数值钳制在 [min, max] 区间内，其余操作都依赖它保证不越界
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
// … 其余见完整实现：src/hooks/useCounter.ts`

// -----------------------------------------------------
// UseLocalStorageDemo 源码快照：供 2️⃣ useLocalStorage 卡片底部「查看源码」折叠块展示。
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案）；修改下方演示卡片的真实 hook 调用/逻辑时请同步更新。
// -----------------------------------------------------
const USELOCALSTORAGE_DEMO_SOURCE = `// 📄 上方 2️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为骨架形态；页面上其它卡片共用的 state 未包含）
function UseLocalStorageDemo() {
  const [storedName, setStoredName, removeStoredName] = useLocalStorage<string>('demo-name', '')
  const [nameInput, setNameInput] = useState('')
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')
  return (
    <div>
      <h3>2️⃣ useLocalStorage - 本地存储持久化</h3>
      存储的名字：{storedName || '(空)'} <button onClick={removeStoredName}>删除存储</button>
      <input type="text" placeholder="输入名字后点击保存" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
      <button onClick={() => setStoredName(nameInput)} disabled={!nameInput}>
        保存到 localStorage
      </button>
      主题：{theme}
      <button onClick={() => setTheme('light')}>设置浅色</button> <button onClick={() => setTheme('dark')}>设置深色</button>
    </div>
  )
}

// ─── 自定义 Hook 核心实现（完整文件见 src/hooks/useLocalStorage.ts）───
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 读：从 localStorage 读取，不存在或 JSON 解析失败时回退 initialValue
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // 写：state 与 localStorage 同步更新（支持函数式更新）
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // 写入失败（如隐私模式）时静默忽略
    }
  }, [key, storedValue])

  // 删：state 复位并移除存储
  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    window.localStorage.removeItem(key)
  }, [key, initialValue])

  // 跨标签同步：其它标签写入同一 key 时自动更新本页 state
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null)
        setStoredValue(JSON.parse(e.newValue) as T)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [storedValue, setValue, removeValue] as const
}
// … 其余见完整实现：src/hooks/useLocalStorage.ts`

// -----------------------------------------------------
// UseDebounceDemo 源码快照：供 3️⃣ useDebounce 卡片底部「查看源码」折叠块展示。
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案）；修改下方演示卡片的真实 hook 调用/逻辑时请同步更新。
// -----------------------------------------------------
const USEDEBOUNCE_DEMO_SOURCE = `// 📄 上方 3️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为骨架形态；页面上其它卡片共用的 state 未包含）
function UseDebounceDemo() {
  const [nameInput, setNameInput] = useState('')
  const debouncedName = useDebounce(nameInput, 500)

  return (
    <div>
      <h3>3️⃣ useDebounce - 防抖 Hook</h3>
      实时输入值：{nameInput || '(空)'}
      防抖后的值（500ms）：{debouncedName || '(空)'}
      <p>💡 试着快速输入文字，观察两个值的变化差异</p>
    </div>
  )
}

// ─── 自定义 Hook 核心实现（完整文件见 src/hooks/useDebounce.ts）───
import { useState, useEffect, useRef } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 每次 value/delay 变化：先清掉旧定时器再重新计时
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
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案）；修改下方演示卡片的真实 hook 调用/逻辑时请同步更新。
// -----------------------------------------------------
const USETOGGLE_DEMO_SOURCE = `// 📄 上方 4️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为骨架形态）
function UseToggleDemo() {
  const modal = useToggle(false)

  return (
    <div>
      <h3>4️⃣ useToggle - 开关 Hook</h3>
      模态框状态：{modal.value ? '打开' : '关闭'}
      <button onClick={modal.toggle}>切换</button>
      <button onClick={modal.setTrue}>打开</button>
      <button onClick={modal.setFalse}>关闭</button>

      {modal.value && <div>这是模拟的模态框内容！</div>}
    </div>
  )
}

// ─── 自定义 Hook 核心实现（完整文件见 src/hooks/useToggle.ts）───
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

  return { value, toggle, setTrue, setFalse }
}
// … 其余见完整实现：src/hooks/useToggle.ts`

// -----------------------------------------------------
// UseFetchDemo 源码快照：供 5️⃣ useFetch 卡片底部「查看源码」折叠块展示。
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案）；修改下方演示卡片的真实 hook 调用/逻辑时请同步更新。
// -----------------------------------------------------
const USEFETCH_DEMO_SOURCE = `// 📄 上方 5️⃣ 卡片的实际代码（节选自 src/pages/HooksPage.tsx，整理为骨架形态）
interface Todo { id: number; title: string; completed: boolean }

function UseFetchDemo() {
  const { data: todos, loading, error, refetch } = useFetch<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos?_limit=5'
  )

  return (
    <div>
      <h3>5️⃣ useFetch - 网络请求 Hook</h3>
      <button onClick={refetch}>🔄 重新请求</button>
      {loading && <p>加载中...</p>}
      {error && <p>错误: {error}</p>}
      {todos && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.completed ? '✅' : '⬜'} {todo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── 自定义 Hook 核心实现（完整文件见 src/hooks/useFetch.ts）───
export function useFetch<T>(url: string | null, options?: RequestInit) {
  const [state, setState] = useState({ data: null, loading: false, error: null })
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!url) return
    // isCancelled 模式：请求返回前若组件卸载/参数变化，丢弃过期结果
    let isCancelled = false
    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(\`HTTP 错误: \${response.status}\`)
        const result = (await response.json()) as T
        if (!isCancelled) setState({ data: result, loading: false, error: null })
      } catch (err) {
        if (!isCancelled) {
          setState({ data: null, loading: false, error: err instanceof Error ? err.message : '未知错误' })
        }
      }
    }
    fetchData()

    return () => { isCancelled = true } // 卸载/重新请求时丢弃过期响应
  }, [url, refetchTrigger, options])

  return { ...state, refetch }
}
// … 其余见完整实现：src/hooks/useFetch.ts`

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
