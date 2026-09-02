import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { SourceCode } from '../components/SourceCode'

function BasicHooksPage() {
  return (
    <div>
      <UseStateDemo />
      <UseEffectDemo />
      <UseCallbackDemo />
      <UseMemoDemo />
      <UseRefDemo />
    </div>
  )
}

// -----------------------------------------------------
// UseStateDemo 源码快照：供页面底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USESTATE_DEMO_SOURCE = `function UseStateDemo() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: '', age: 0 })

  const updateAge = () => {
    setUser((prev) => ({ ...prev, age: prev.age + 1 }))
  }

  return (
    <div className="card">
      <h2>1️⃣ useState - 状态管理 Hook</h2>
      <p className="info-text">
        用于在函数组件中声明和管理本地状态。返回状态值和更新它的函数。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>示例 1：基本数值</h4>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#646cff',
              margin: '0.5rem 0',
            }}
          >
            {count}
          </div>
          <button onClick={() => setCount(count - 1)}>-1</button>
          <button className="primary" onClick={() => setCount((c) => c + 1)}>
            +1
          </button>
          <button onClick={() => setCount(0)}>重置</button>
        </div>

        <div>
          <h4>示例 2：对象状态</h4>
          <input
            placeholder="输入姓名"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="年龄"
            value={user.age || ''}
            onChange={(e) =>
              setUser({ ...user, age: Number(e.target.value) || 0 })
            }
            style={{ width: '100px' }}
          />
          <button onClick={updateAge}>年龄+1</button>
          <p style={{ marginTop: '0.5rem' }}>
            {user.name ? \`\${user.name}, \${user.age}岁\` : '(请填写用户信息)'}
          </p>
        </div>
      </div>
    </div>
  )
}`

// =====================================================
// 1. useState 讲解
// =====================================================
function UseStateDemo() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: '', age: 0 })

  const updateAge = () => {
    setUser((prev) => ({ ...prev, age: prev.age + 1 }))
  }

  return (
    <div className="card">
      <h2>1️⃣ useState - 状态管理 Hook</h2>
      <p className="info-text">
        用于在函数组件中声明和管理本地状态。返回状态值和更新它的函数。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>示例 1：基本数值</h4>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#646cff',
              margin: '0.5rem 0',
            }}
          >
            {count}
          </div>
          <button onClick={() => setCount(count - 1)}>-1</button>
          <button className="primary" onClick={() => setCount((c) => c + 1)}>
            +1
          </button>
          <button onClick={() => setCount(0)}>重置</button>
        </div>

        <div>
          <h4>示例 2：对象状态</h4>
          <input
            placeholder="输入姓名"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="年龄"
            value={user.age || ''}
            onChange={(e) =>
              setUser({ ...user, age: Number(e.target.value) || 0 })
            }
            style={{ width: '100px' }}
          />
          <button onClick={updateAge}>年龄+1</button>
          <p style={{ marginTop: '0.5rem' }}>
            {user.name ? `${user.name}, ${user.age}岁` : '(请填写用户信息)'}
          </p>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// 基本用法
const [count, setCount] = useState(0)
setCount(count + 1)
setCount(prev => prev + 1)  // 函数式更新，依赖旧值时推荐

// 对象状态 - 必须展开旧对象再覆盖（不可变更新）
const [user, setUser] = useState({ name: '', age: 0 })
setUser({ ...user, name: '新名字' })  // ❌ 漏掉 age 会丢失
setUser(prev => ({ ...prev, age: prev.age + 1 }))  // ✅ 函数式更安全`}
        </pre>
      </div>

      <SourceCode label="UseStateDemo（1️⃣ useState 示例）" code={USESTATE_DEMO_SOURCE} />
    </div>
  )
}

// -----------------------------------------------------
// UseEffectDemo 源码快照：供页面底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USEEFFECT_DEMO_SOURCE = `function UseEffectDemo() {
  const [count, setCount] = useState(0)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [mountLog, setMountLog] = useState<string[]>([])
  const mountedRef = useRef(0)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    mountedRef.current += 1
    setMountLog((prev) => [\`✅ 组件挂载/更新 (第\${mountedRef.current}次)\`, ...prev].slice(0, 5))
    return () => {
      setMountLog((prev) => [\`🧹 清理函数执行\`, ...prev].slice(0, 5))
    }
  }, [count])

  // 空依赖数组：只在挂载时订阅，卸载时清理
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 模拟防抖搜索：keyword 变化后 500ms 才执行
  useEffect(() => {
    if (!keyword) return
    const timer = setTimeout(() => {
      setMountLog((prev) => [\`🔍 模拟搜索: "\${keyword}"\`, ...prev].slice(0, 5))
    }, 500)
    return () => clearTimeout(timer)
  }, [keyword])

  return (
    <div className="card">
      <h2>2️⃣ useEffect - 副作用 Hook</h2>
      <p className="info-text">
        处理副作用：订阅、DOM 操作、定时器、数据请求等。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>依赖数组不同写法的效果</h4>
          <p>
            <strong>计数：</strong>
            <span style={{ color: '#646cff', fontSize: '1.5rem' }}> {count}</span>
          </p>
          <button onClick={() => setCount((c) => c + 1)}>count +1（触发 effect）</button>
          <p>
            <strong>窗口宽度：</strong> {width}px
            <span className="info-text"> （拖动窗口查看变化）</span>
          </p>
          <input
            placeholder="输入关键词模拟搜索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
        <div>
          <h4>执行日志（最近5条）：</h4>
          <div
            style={{
              backgroundColor: '#0a0a0a',
              padding: '0.5rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              minHeight: '150px',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            {mountLog.length === 0 ? (
              <span style={{ color: '#666' }}>暂无日志...</span>
            ) : (
              mountLog.map((log, i) => (
                <div key={i} style={{ padding: '2px 0' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}`

// =====================================================
// 2. useEffect 讲解
// =====================================================
function UseEffectDemo() {
  const [count, setCount] = useState(0)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [mountLog, setMountLog] = useState<string[]>([])
  const mountedRef = useRef(0)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    mountedRef.current += 1
    setMountLog((prev) => [`✅ 组件挂载/更新 (第${mountedRef.current}次)`, ...prev].slice(0, 5))
    return () => {
      setMountLog((prev) => [`🧹 清理函数执行`, ...prev].slice(0, 5))
    }
  }, [count])

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!keyword) return
    const timer = setTimeout(() => {
      setMountLog((prev) => [`🔍 模拟搜索: "${keyword}"`, ...prev].slice(0, 5))
    }, 500)
    return () => clearTimeout(timer)
  }, [keyword])

  return (
    <div className="card">
      <h2>2️⃣ useEffect - 副作用 Hook</h2>
      <p className="info-text">
        处理副作用：订阅、DOM 操作、定时器、数据请求等。类似生命周期 componentDidMount + componentDidUpdate + componentWillUnmount 的组合。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>依赖数组不同写法的效果</h4>
          <p>
            <strong>计数：</strong>
            <span style={{ color: '#646cff', fontSize: '1.5rem' }}> {count}</span>
          </p>
          <button onClick={() => setCount((c) => c + 1)}>count +1（触发 effect）</button>
          <p>
            <strong>窗口宽度：</strong> {width}px
            <span className="info-text"> （拖动窗口查看变化）</span>
          </p>
          <input
            placeholder="输入关键词模拟搜索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
        <div>
          <h4>执行日志（最近5条）：</h4>
          <div
            style={{
              backgroundColor: '#0a0a0a',
              padding: '0.5rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              minHeight: '150px',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            {mountLog.length === 0 ? (
              <span style={{ color: '#666' }}>暂无日志...</span>
            ) : (
              mountLog.map((log, i) => (
                <div key={i} style={{ padding: '2px 0' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// ① 无依赖数组：每次渲染都执行（慎用！）
useEffect(() => { console.log('每次渲染后') })

// ② 空数组 []：只在挂载时执行1次，卸载时清理
useEffect(() => {
  window.addEventListener('resize', fn)
  return () => window.removeEventListener('resize', fn)  // 清理函数
}, [])

// ③ [dep1, dep2]：挂载 + 依赖变化时执行
useEffect(() => {
  const timer = setTimeout(() => search(keyword), 500)
  return () => clearTimeout(timer)  // 下次执行前先清理
}, [keyword])`}
        </pre>
      </div>

      <SourceCode label="UseEffectDemo（2️⃣ useEffect 示例）" code={USEEFFECT_DEMO_SOURCE} />
    </div>
  )
}

// -----------------------------------------------------
// UseCallbackDemo 源码快照：供页面底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件/配套子组件的逻辑或 UI，请同步更新这里。
// -----------------------------------------------------
const USECALLBACK_DEMO_SOURCE = `function UseCallbackDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const renderCount = useRef({ normal: 0, memoed: 0 })

  // 每次渲染都会生成“新”函数引用
  const normalHandleClick = () => {
    console.log('普通函数被调用')
  }

  // useCallback：依赖不变 → 函数引用永远不变
  const memoedHandleClick = useCallback(() => {
    console.log('useCallback 函数被调用')
  }, [])

  // 用 ref 记录上一次渲染时的引用，据此判断引用是否变化
  const normalPropRef = useRef(normalHandleClick)
  const memoedPropRef = useRef(memoedHandleClick)

  const isNormalSame = normalHandleClick === normalPropRef.current
  const isMemoedSame = memoedHandleClick === memoedPropRef.current

  normalPropRef.current = normalHandleClick
  memoedPropRef.current = memoedHandleClick

  if (!isNormalSame) renderCount.current.normal += 1
  if (!isMemoedSame) renderCount.current.memoed += 1

  const [childState, setChildState] = useState({ a: 1 })

  // 传给 memo 子组件的稳定回调
  const stableCallback = useCallback((delta: number) => {
    setCount((c) => c + delta)
  }, [])

  return (
    <div className="card">
      <h2>3️⃣ useCallback - 缓存函数引用</h2>
      <p className="info-text">
        返回一个<strong>记忆化的回调函数</strong>。当依赖不变时，返回相同的函数引用。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>函数引用对比实验</h4>
          <button onClick={() => setCount((c) => c + 1)}>
            修改 state（触发父组件重渲染）
          </button>
          <p>
            父组件计数：<span style={{ color: '#646cff' }}>{count}</span>
          </p>
          <table style={{ width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th>类型</th>
                <th>引用相同?</th>
                <th>变化次数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>普通函数</td>
                <td style={{ color: isNormalSame ? '#4ade80' : '#f87171' }}>
                  {isNormalSame ? '✅ 相同' : '❌ 变化'}
                </td>
                <td>{renderCount.current.normal}</td>
              </tr>
              <tr>
                <td>useCallback</td>
                <td style={{ color: isMemoedSame ? '#4ade80' : '#f87171' }}>
                  {isMemoedSame ? '✅ 相同' : '❌ 变化'}
                </td>
                <td>{renderCount.current.memoed}</td>
              </tr>
            </tbody>
          </table>
          <input
            placeholder="随便输入也会触发重渲染"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <h4>配合 React.memo 的效果</h4>
          <MemoChild callback={stableCallback} label="稳定函数" data={childState} />
          <button onClick={() => setChildState({ a: Math.random() })}>
            改变传给子组件的 data
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== 配套：memo 子组件（配合 useCallback 使用）=====
interface MemoChildProps {
  callback: (n: number) => void
  label: string
  data: { a: number }
}
const MemoChild = memo(function MemoChild({ callback, label, data }: MemoChildProps) {
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div style={{ border: '1px solid #444', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem' }}>
      <p style={{ margin: 0 }}>
        🧒 memo子组件 [{label}] 渲染次数：
        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{renderCount.current}</span>
      </p>
      <p className="info-text" style={{ margin: '0.25rem 0 0.5rem 0' }}>
        data.a = {data.a.toFixed(2)}
      </p>
      <button onClick={() => callback(5)}>调用 callback(+5)</button>
    </div>
  )
})`

// =====================================================
// 3. useCallback 讲解
// =====================================================
function UseCallbackDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const renderCount = useRef({ normal: 0, memoed: 0 })

  const normalHandleClick = () => {
    console.log('普通函数被调用')
  }

  const memoedHandleClick = useCallback(() => {
    console.log('useCallback 函数被调用')
  }, [])

  const normalPropRef = useRef(normalHandleClick)
  const memoedPropRef = useRef(memoedHandleClick)

  const isNormalSame = normalHandleClick === normalPropRef.current
  const isMemoedSame = memoedHandleClick === memoedPropRef.current

  normalPropRef.current = normalHandleClick
  memoedPropRef.current = memoedHandleClick

  if (!isNormalSame) renderCount.current.normal += 1
  if (!isMemoedSame) renderCount.current.memoed += 1

  const [childState, setChildState] = useState({ a: 1 })

  const stableCallback = useCallback((delta: number) => {
    setCount((c) => c + delta)
  }, [])

  return (
    <div className="card">
      <h2>3️⃣ useCallback - 缓存函数引用</h2>
      <p className="info-text">
        返回一个<strong>记忆化的回调函数</strong>。当依赖不变时，返回相同的函数引用。
        配合子组件的 <code>React.memo</code> 使用时，可以避免不必要的重渲染。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>函数引用对比实验</h4>
          <button onClick={() => setCount((c) => c + 1)}>
            修改 state（触发父组件重渲染）
          </button>
          <p>
            父组件计数：<span style={{ color: '#646cff' }}>{count}</span>
          </p>
          <table style={{ width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th>类型</th>
                <th>引用相同?</th>
                <th>变化次数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>普通函数</td>
                <td style={{ color: isNormalSame ? '#4ade80' : '#f87171' }}>
                  {isNormalSame ? '✅ 相同' : '❌ 变化'}
                </td>
                <td>{renderCount.current.normal}</td>
              </tr>
              <tr>
                <td>useCallback</td>
                <td style={{ color: isMemoedSame ? '#4ade80' : '#f87171' }}>
                  {isMemoedSame ? '✅ 相同' : '❌ 变化'}
                </td>
                <td>{renderCount.current.memoed}</td>
              </tr>
            </tbody>
          </table>
          <input
            placeholder="随便输入也会触发重渲染"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <h4>配合 React.memo 的效果</h4>
          <MemoChild callback={stableCallback} label="稳定函数" data={childState} />
          <button onClick={() => setChildState({ a: Math.random() })}>
            改变传给子组件的 data
          </button>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// ✅ 推荐场景：传给 memo 子组件的回调
const handleAdd = useCallback((item) => {
  setList(prev => [...prev, item])
}, [])  // 依赖为空 → 函数引用永远不变

const Child = memo(function Child({ onAdd }) {
  return <button onClick={onAdd}>添加</button>
})

// ❌ 不要乱用：本地事件处理函数没必要
const handleClick = useCallback(() => setN(n+1), [n])
// ↑ 直接写普通函数更简单，因为 n 一变函数引用也得变`}
        </pre>
      </div>

      <SourceCode label="UseCallbackDemo（3️⃣ useCallback 示例）" code={USECALLBACK_DEMO_SOURCE} />
    </div>
  )
}

interface MemoChildProps {
  callback: (n: number) => void
  label: string
  data: { a: number }
}
const MemoChild = memo(function MemoChild({ callback, label, data }: MemoChildProps) {
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div
      style={{
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '0.5rem',
        backgroundColor: '#1a1a1a',
      }}
    >
      <p style={{ margin: 0 }}>
        🧒 memo子组件 [{label}] 渲染次数：
        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
          {renderCount.current}
        </span>
      </p>
      <p className="info-text" style={{ margin: '0.25rem 0 0.5rem 0' }}>
        data.a = {data.a.toFixed(2)}
      </p>
      <button onClick={() => callback(5)}>调用 callback(+5)</button>
    </div>
  )
})

// -----------------------------------------------------
// UseMemoDemo 源码快照：供页面底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USEMEMO_DEMO_SOURCE = `function UseMemoDemo() {
  const [list] = useState(() =>
    Array.from({ length: 200000 }, (_, i) => i + 1)
  )
  const [filter, setFilter] = useState<'odd' | 'even' | 'all'>('all')
  const [forceRender, setForceRender] = useState(0)

  // ❌ 每次渲染都重新过滤 20 万个元素
  const t1 = performance.now()
  const filteredWithoutMemo = list.filter((n) => {
    if (filter === 'odd') return n % 2 === 1
    if (filter === 'even') return n % 2 === 0
    return true
  })
  const withoutMemoTime = performance.now() - t1

  // ✅ useMemo：依赖 [list, filter] 不变时跳过重算
  const t2 = performance.now()
  const filteredWithMemo = useMemo(() => {
    return list.filter((n) => {
      if (filter === 'odd') return n % 2 === 1
      if (filter === 'even') return n % 2 === 0
      return true
    })
  }, [list, filter])
  const withMemoTime = performance.now() - t2

  const doubled = useMemo(() => filteredWithMemo.slice(0, 5).map((n) => n * 2), [filteredWithMemo])

  return (
    <div className="card">
      <h2>4️⃣ useMemo - 缓存计算结果</h2>
      <p className="info-text">
        返回一个<strong>记忆化的值</strong>。当依赖不变时，跳过昂贵的重新计算。
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <span>筛选模式：</span>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'primary' : ''}>
          全部
        </button>
        <button onClick={() => setFilter('odd')} className={filter === 'odd' ? 'primary' : ''}>
          奇数
        </button>
        <button onClick={() => setFilter('even')} className={filter === 'even' ? 'primary' : ''}>
          偶数
        </button>
        <button onClick={() => setForceRender((n) => n + 1)}>
          🔄 不相关的重渲染 (强制刷新) {forceRender}
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>❌ 不用 useMemo</h4>
          <p>结果数量：<strong>{filteredWithoutMemo.length}</strong></p>
          <p>
            耗时：
            <span style={{ color: '#f87171', fontSize: '1.2rem' }}>
              {withoutMemoTime.toFixed(2)} ms
            </span>
          </p>
        </div>
        <div>
          <h4>✅ 使用 useMemo</h4>
          <p>结果数量：<strong>{filteredWithMemo.length}</strong></p>
          <p>
            耗时：
            <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>
              {withMemoTime.toFixed(2)} ms
            </span>
          </p>
        </div>
      </div>
      <p className="info-text" style={{ marginTop: '0.5rem' }}>
        💡 列表长度 20万。点击「强制刷新」看差异：不相关重渲染时 useMemo 跳过计算耗时接近 0ms！
      </p>
      <p>前5个元素 × 2 = [{doubled.join(', ')}]</p>
    </div>
  )
}`

// =====================================================
// 4. useMemo 讲解
// =====================================================
function UseMemoDemo() {
  const [list] = useState(() =>
    Array.from({ length: 200000 }, (_, i) => i + 1)
  )
  const [filter, setFilter] = useState<'odd' | 'even' | 'all'>('all')
  const [forceRender, setForceRender] = useState(0)

  const t1 = performance.now()
  const filteredWithoutMemo = list.filter((n) => {
    if (filter === 'odd') return n % 2 === 1
    if (filter === 'even') return n % 2 === 0
    return true
  })
  const withoutMemoTime = performance.now() - t1

  const t2 = performance.now()
  const filteredWithMemo = useMemo(() => {
    return list.filter((n) => {
      if (filter === 'odd') return n % 2 === 1
      if (filter === 'even') return n % 2 === 0
      return true
    })
  }, [list, filter])
  const withMemoTime = performance.now() - t2

  const doubled = useMemo(() => filteredWithMemo.slice(0, 5).map((n) => n * 2), [filteredWithMemo])

  return (
    <div className="card">
      <h2>4️⃣ useMemo - 缓存计算结果</h2>
      <p className="info-text">
        返回一个<strong>记忆化的值</strong>。当依赖不变时，跳过昂贵的重新计算。
        类似 Vue 的 computed。
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <span>筛选模式：</span>
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'primary' : ''}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('odd')}
          className={filter === 'odd' ? 'primary' : ''}
        >
          奇数
        </button>
        <button
          onClick={() => setFilter('even')}
          className={filter === 'even' ? 'primary' : ''}
        >
          偶数
        </button>
        <button onClick={() => setForceRender((n) => n + 1)}>
          🔄 不相关的重渲染 (强制刷新) {forceRender}
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>❌ 不用 useMemo</h4>
          <p>结果数量：<strong>{filteredWithoutMemo.length}</strong></p>
          <p>
            耗时：
            <span style={{ color: '#f87171', fontSize: '1.2rem' }}>
              {withoutMemoTime.toFixed(2)} ms
            </span>
          </p>
        </div>
        <div>
          <h4>✅ 使用 useMemo</h4>
          <p>结果数量：<strong>{filteredWithMemo.length}</strong></p>
          <p>
            耗时：
            <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>
              {withMemoTime.toFixed(2)} ms
            </span>
          </p>
        </div>
      </div>
      <p className="info-text" style={{ marginTop: '0.5rem' }}>
        💡 列表长度 20万。点击「强制刷新」看差异：不相关重渲染时 useMemo 跳过计算耗时接近 0ms！
      </p>
      <p>前5个元素 × 2 = [{doubled.join(', ')}]</p>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// 只在 list 或 filter 变化时重新计算
const filtered = useMemo(() => {
  return list.filter(n => n > threshold).sort((a, b) => a - b)
}, [list, threshold])

// 也可用于稳定子组件的 props 引用
const sortedUsers = useMemo(() => [...users].sort(), [users])
<MemoizedTable data={sortedUsers} />  // 引用不变就不重渲染

// ❌ 别滥用：简单运算（如 n*2）不需要 memo，memo 本身有开销`}
        </pre>
      </div>

      <SourceCode label="UseMemoDemo（4️⃣ useMemo 示例）" code={USEMEMO_DEMO_SOURCE} />
    </div>
  )
}

// -----------------------------------------------------
// UseRefDemo 源码快照：供页面底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const USEREF_DEMO_SOURCE = `function UseRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const renderCountRef = useRef(0)
  const [count, setCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [timerSec, setTimerSec] = useState(0)

  // ref.current 自增不会触发重渲染
  renderCountRef.current += 1

  // ① 通过 ref 操作 DOM
  const focusInput = () => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  // ③ 用 ref 保存定时器实例（跨渲染共享，不触发渲染）
  const startTimer = () => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      setTimerSec((s) => s + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    setTimerSec(0)
  }

  return (
    <div className="card">
      <h2>5️⃣ useRef - 持久化引用 / DOM 操作</h2>
      <p className="info-text">
        两个用途：① 获取 DOM 元素引用 ② 在不触发重渲染的情况下存储可变值。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>① DOM 引用 - 操作 input</h4>
          <input ref={inputRef} placeholder="我是被 ref 绑定的 input" />
          <button className="primary" onClick={focusInput}>
            🎯 聚焦并选中
          </button>
          <h4 style={{ marginTop: '1rem' }}>② 存储跨渲染值 (不引起重渲染)</h4>
          <p>组件总渲染次数：<span style={{ color: '#f59e0b' }}>{renderCountRef.current}</span></p>
          <button onClick={() => setCount((c) => c + 1)}>触发重渲染 (count+1)</button>
          <p>当前 state count = {count}</p>
          <p className="info-text">
            渲染计数存在 ref 里，自增但不触发重渲染；只有 state 变化才会触发渲染。
          </p>
        </div>
        <div>
          <h4>③ 保存定时器/订阅实例</h4>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#646cff' }}>
            ⏱️ {timerSec}s
          </p>
          <button className="primary" onClick={startTimer}>
            ▶ 开始
          </button>
          <button onClick={stopTimer}>⏸ 停止</button>
          <button className="danger" onClick={resetTimer}>
            ⟳ 重置
          </button>
          <p className="info-text" style={{ marginTop: '0.5rem' }}>
            定时器 ID 存在 ref 里，卸载时清理（也可以放在 useEffect 清理函数中）。
          </p>
        </div>
      </div>
    </div>
  )
}`

// =====================================================
// 5. useRef 讲解
// =====================================================
function UseRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const renderCountRef = useRef(0)
  const [count, setCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [timerSec, setTimerSec] = useState(0)

  renderCountRef.current += 1

  const focusInput = () => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  const startTimer = () => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      setTimerSec((s) => s + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    setTimerSec(0)
  }

  return (
    <div className="card">
      <h2>5️⃣ useRef - 持久化引用 / DOM 操作</h2>
      <p className="info-text">
        两个用途：① 获取 DOM 元素引用 ② 在不触发重渲染的情况下存储可变值
        （.current 的变化不会引起组件重新渲染！）
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h4>① DOM 引用 - 操作 input</h4>
          <input ref={inputRef} placeholder="我是被 ref 绑定的 input" />
          <button className="primary" onClick={focusInput}>
            🎯 聚焦并选中
          </button>
          <h4 style={{ marginTop: '1rem' }}>② 存储跨渲染值 (不引起重渲染)</h4>
          <p>组件总渲染次数：<span style={{ color: '#f59e0b' }}>{renderCountRef.current}</span></p>
          <button onClick={() => setCount((c) => c + 1)}>触发重渲染 (count+1)</button>
          <p>当前 state count = {count}</p>
          <p className="info-text">
            渲染计数存在 ref 里，自增但不触发重渲染；只有 state 变化才会触发渲染。
          </p>
        </div>
        <div>
          <h4>③ 保存定时器/订阅实例</h4>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#646cff' }}>
            ⏱️ {timerSec}s
          </p>
          <button className="primary" onClick={startTimer}>
            ▶ 开始
          </button>
          <button onClick={stopTimer}>⏸ 停止</button>
          <button className="danger" onClick={resetTimer}>
            ⟳ 重置
          </button>
          <p className="info-text" style={{ marginTop: '0.5rem' }}>
            定时器 ID 存在 ref 里，卸载时清理（也可以放在 useEffect 清理函数中）。
          </p>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// ① DOM 引用
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} />
inputRef.current?.focus()

// ② 保存跨渲染的可变数据（变化不触发渲染）
const cacheRef = useRef<Map<string, Data>>(new Map())
cacheRef.current.set(key, value)  // 不会重渲染！

// ③ 保存不需要响应式的实例
const timerRef = useRef<NodeJS.Timeout | null>(null)
useEffect(() => {
  timerRef.current = setInterval(...)
  return () => clearInterval(timerRef.current!)
}, [])`}
        </pre>
      </div>

      <SourceCode label="UseRefDemo（5️⃣ useRef 示例）" code={USEREF_DEMO_SOURCE} />
    </div>
  )
}

export default BasicHooksPage
