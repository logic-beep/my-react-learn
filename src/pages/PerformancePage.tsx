import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  lazy,
  Suspense,
  startTransition,
  useTransition,
  useDeferredValue,
  memo,
} from 'react'
import {
  CounterBadgeNoMemo,
  CounterBadgeMemo,
  CallbackButtonMemo,
  TodoList,
  SimpleVirtualList,
  ExpensiveChart,
  ExpensiveLeaderboard,
  buildLeaderboardDataSet,
  useRenderLabel,
} from '../components/PerfDemos'
import { SourceCode } from '../components/SourceCode'
import { CodeBlock } from '../components/CodeBlock'

const HeavyLazyComponent = lazy(() => import('../components/HeavyLazyComponent'))

function PerformancePage() {
  return (
    <div>
      <div className="card">
        <h2>⚡ React 性能优化全景图</h2>
        <p className="info-text" style={{ marginTop: 0 }}>
          优化 = <strong>减少渲染次数</strong> + <strong>缩小渲染范围</strong> +{' '}
          <strong>降低单次渲染开销</strong> + <strong>延迟非关键工作</strong>。
          每个模块都有 <span style={{ color: '#fbbf24' }}>❌ Before</span> vs{' '}
          <span style={{ color: '#4ade80' }}>✅ After</span> 对比，可直接操作观察差异。
        </p>
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '1rem' }}
        >
          {[
            { t: '① React.memo', d: '跳过 props 未变的子组件', c: '#22c55e' },
            { t: '② useCallback', d: '稳定函数引用给 memo 子组件', c: '#3b82f6' },
            { t: '③ useMemo', d: '缓存昂贵计算 / 稳定对象引用', c: '#a855f7' },
            { t: '④ key 正确', d: '列表 diff 不丢状态、不复用错 DOM', c: '#f59e0b' },
            { t: '⑤ 虚拟列表', d: '长列表只渲染可见区域 DOM', c: '#ec4899' },
            { t: '⑥ React.lazy', d: '代码分包 + 按需加载', c: '#14b8a6' },
            { t: '⑦ startTransition', d: '保持 UI 响应不卡输入框', c: '#06b6d4' },
            { t: '⑧ useDeferredValue', d: '值延迟更新 + isStale 陈旧反馈', c: '#f43f5e' },
            { t: '⑨ useTransition', d: 'startTransition + isPending 骨架屏', c: '#8b5cf6' },
            { t: '⑩ ExpensiveChart', d: 'memo/useMemo 综合观察图表重渲染', c: '#94a3b8' },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                border: `1px solid ${x.c}44`,
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: `${x.c}11`,
              }}
            >
              <h4 style={{ margin: 0, color: x.c }}>{x.t}</h4>
              <p className="info-text" style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </div>

      <MemoDemo />
      <UseCallbackDemo />
      <UseMemoExpensiveCalc />
      <ListKeyDemo />
      <VirtualListDemo />
      <LazyLoadDemo />
      <TransitionDemo />
      <UseDeferredValueDemo />
      <UseTransitionDemo />
      <SuspenseRenderCountDemo />
    </div>
  )
}

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const MEMO_DEMO_SOURCE = `const MemoDemo = memo(function MemoDemo() {
  const [relevant, setRelevant] = useState(0)      // 传给子组件的值：变化时两侧子组件都应渲染
  const [irrelevant, setIrrelevant] = useState(0)  // 与 memo 子组件无关：只有「无 memo」侧会跟着渲染
  const renderTag = useRenderLabel('📦 MemoDemo父组件') // 渲染次数徽标（实现见 PerfDemos.tsx）

  return (
    <div>
      <h3>① React.memo — props 相等就跳过子组件渲染</h3>
      <p>memo 对 props 浅比较（shallow equal）：只有 props 引用/值变了才重渲染。</p>
      <div>
        {renderTag}
        <button onClick={() => setRelevant((x) => x + 1)}>➕ relevant +1（两个子组件都变）</button>
        <button onClick={() => setIrrelevant((x) => x + 1)}>➕ irrelevant +1（memo 侧应跳过）</button>
        <p>relevant: {relevant} · irrelevant: {irrelevant}</p>
      </div>
      <h4>❌ 无 memo：父渲染 → 子一定渲染</h4>
      <CounterBadgeNoMemo count={relevant} label="relevant" />
      <CounterBadgeNoMemo count={1000} label="固定值-无关" />
      <h4>✅ memo：props 引用没变 → 跳过</h4>
      <CounterBadgeMemo count={relevant} label="relevant" />
      <CounterBadgeMemo count={1000} label="固定值-无关" />
    </div>
  )
})

// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
// useRenderLabel：useRef 计数渲染次数并返回 🔄 徽标 JSX，每个子组件用它观察是否重渲染。

export function CounterBadgeNoMemo({ count, label }: CounterBadgeProps) {
  const renderBadge = useRenderLabel('无Memo-' + label) // 徽标样式已省略
  return <div>{renderBadge} | 值: {count}</div>
}

export const CounterBadgeMemo = memo(function CounterBadgeMemo({ count, label }: CounterBadgeProps) {
  const renderBadge = useRenderLabel('Memo-' + label)
  return <div>{renderBadge} | 值: {count}</div>
})`

// =========================================================
// ① React.memo
// =========================================================
const MemoDemo = memo(function MemoDemo() {
  const [relevant, setRelevant] = useState(0)
  const [irrelevant, setIrrelevant] = useState(0)
  const renderTag = useRenderLabel('📦 MemoDemo父组件')

  return (
    <div className="card">
      <h3 style={{ color: '#22c55e' }}>
        ① React.memo — props 相等就跳过子组件渲染
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        memo 对 props 做 <strong>浅比较（shallow equal）</strong>：只有 props 引用/值变了才重渲染。
        对「接受 props 但渲染开销大」「被渲染在列表中」的子组件收益最大。
      </p>
      <div style={{ marginBottom: '0.75rem' }}>
        {renderTag}
        <button onClick={() => setRelevant((x) => x + 1)}>
          ➕ relevant +1（两个子组件都变）
        </button>
        <button onClick={() => setIrrelevant((x) => x + 1)}>
          ➕ irrelevant +1（Memo 子组件应该 <span style={{ color: '#4ade80' }}>不渲染</span>）
        </button>
        <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          <strong>relevant:</strong> <span className="tag">{relevant}</span>{' '}
          <strong>irrelevant:</strong> <span className="tag">{irrelevant}</span>
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>
            ❌ 无 memo：父渲染 → 子一定渲染
          </h4>
          <CounterBadgeNoMemo count={relevant} label="relevant" />
          <CounterBadgeNoMemo count={1000} label="固定值-无关" />
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#4ade80' }}>
            ✅ memo：props 引用没变 → 跳过
          </h4>
          <CounterBadgeMemo count={relevant} label="relevant" />
          <CounterBadgeMemo count={1000} label="固定值-无关" />
        </div>
      </div>

      <SourceCode label="MemoDemo（① React.memo 示例）" code={MEMO_DEMO_SOURCE} />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const USECALLBACK_DEMO_SOURCE = `const UseCallbackDemo = memo(function UseCallbackDemo() {
  const [count, setCount] = useState(0)
  const [input, setInput] = useState('')          // 与子组件无关：用来触发父组件重渲染
  const renderTag = useRenderLabel('UseCallback父组件') // 渲染次数徽标（实现见 PerfDemos.tsx）

  const unstableFn = () => setCount((c) => c + 1)              // ❌ 每渲染都是新函数
  const stableFn = useCallback(() => setCount((c) => c + 1), []) // ✅ 引用稳定

  return (
    <div>
      <h3>② useCallback — 给 memo 子组件传回调必须配合</h3>
      <p>
        只写 memo 但回调不用 useCallback 等于白忙：父组件每次渲染都会生成新函数引用，
        浅比较判失败，子组件照旧重渲染。
      </p>
      <div>
        {renderTag}
        <input placeholder="随便输入触发父组件重渲染..." value={input} onChange={(e) => setInput(e.target.value)} />
        <span>count: {count}</span>
      </div>
      <h4>❌ 普通函数（每渲染必变）</h4>
      <CallbackButtonMemo label="不稳定+1" onClick={unstableFn} />
      <h4>✅ useCallback（引用稳定）</h4>
      <CallbackButtonMemo label="稳定+1" onClick={stableFn} />
      <p>💡 在 input 里输入，观察哪个 memo 按钮子组件不会跟着重新渲染</p>
    </div>
  )
})

// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
// CallbackButtonMemo：memo 子组件 + onClick 按钮 + 渲染次数徽标。
export const CallbackButtonMemo = memo(function CallbackButtonMemo({
  label,
  onClick,
}: ButtonChildProps) {
  const renderBadge = useRenderLabel('MemoBtn-' + label)
  return (
    <div>
      {renderBadge}
      <button onClick={onClick}>{label}</button>
    </div>
  )
})`

// =========================================================
// ② useCallback：稳定函数引用配合 memo
// =========================================================
const UseCallbackDemo = memo(function UseCallbackDemo() {
  const [count, setCount] = useState(0)
  const [input, setInput] = useState('')
  const renderTag = useRenderLabel('UseCallback父组件')

  const unstableFn = () => setCount((c) => c + 1)
  const stableFn = useCallback(() => setCount((c) => c + 1), [])

  return (
    <div className="card">
      <h3 style={{ color: '#3b82f6' }}>
        ② useCallback — 给 memo 子组件传回调必须配合
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        只写 <code>memo</code> 但回调不用 <code>useCallback</code> 等于白忙：
        父组件每次渲染都会生成<strong>新函数引用</strong>，浅比较判失败，子组件照旧重渲染。
      </p>
      <div style={{ marginBottom: '1rem' }}>
        {renderTag}
        <input
          placeholder="随便输入触发父组件重渲染..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <span>count: <strong>{count}</strong></span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: 0, color: '#fbbf24' }}>❌ 普通函数 (每渲染必变)</h4>
          <CallbackButtonMemo label="不稳定+1" onClick={unstableFn} />
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#4ade80' }}>✅ useCallback（引用稳定）</h4>
          <CallbackButtonMemo label="稳定+1" onClick={stableFn} />
        </div>
      </div>
      <p className="info-text" style={{ marginBottom: 0 }}>
        💡 在上方 input 里输入，观察哪个 memo 按钮子组件不会跟着重新渲染
      </p>

      <SourceCode label="UseCallbackDemo（② useCallback 示例）" code={USECALLBACK_DEMO_SOURCE} />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const USEMEMO_EXPENSIVE_CALC_SOURCE = `const UseMemoExpensiveCalc = memo(function UseMemoExpensiveCalc() {
  const [size, setSize] = useState(500000)   // 数组长度（10万~80万可选，真实代码有 select 下拉）
  const [keyword, setKeyword] = useState('') // 与排序无关：用来强制父组件重渲染
  const [forceTick, setForceTick] = useState(0)

  // ✅ 只有 size 变了才重新生成数组（否则每次渲染都重建引用/重算）
  const arr = useMemo(() => {
    const a: number[] = []
    for (let i = 0; i < size; i++) a.push(Math.round(Math.random() * 1_000_000))
    return a
  }, [size])

  // ❌ 无缓存：每次渲染都真实执行 sort + slice，用 performance.now() 计时对比
  const t1 = performance.now()
  const sortedTop10Naive = [...arr].sort((a, b) => a - b).slice(0, 10)
  const naiveMs = performance.now() - t1

  // ✅ 缓存：依赖 arr 不变 → 直接复用上次结果，本帧耗时 ≈ 0ms
  const t2 = performance.now()
  const sortedTop10Memo = useMemo(() => {
    return [...arr].sort((a, b) => a - b).slice(0, 10)
  }, [arr])
  const memoMs = performance.now() - t2

  return (
    <div>
      <h3>③ useMemo — 跳过昂贵计算 & 稳定子组件对象 props</h3>
      <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
        <option value={100000}>10万</option>
        <option value={500000}>50万</option>
      </select>
      <input placeholder="不相关输入：❌ 侧会明显卡顿" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={() => setForceTick((x) => x + 1)}>🔄 forceTick {forceTick}</button>
      <h4>❌ 每次渲染都排序（真实耗时）</h4>
      <p>本帧耗时：{naiveMs.toFixed(3)} ms · Top10 最小：{sortedTop10Naive.join(', ')}</p>
      <h4>✅ useMemo([arr]) — 依赖不变直接复用缓存</h4>
      <p>本帧耗时：{memoMs.toFixed(3)} ms · Top10 最小：{sortedTop10Memo.join(', ')}</p>
    </div>
  )
})

// 用法要点（页面 code-block 同款）：
// ✅ 缓存昂贵计算：const sorted = useMemo(() => [...arr].sort((a, b) => a - b).slice(0, 10), [arr])
// ✅ 稳定引用给 memo 子组件：const style = useMemo(() => ({ color: '#f00' }), [])
// ❌ 反模式：useMemo(() => count * 2, [count]) —— memo 本身的开销比计算还大`

// =========================================================
// ③ useMemo：缓存昂贵计算
// =========================================================
const UseMemoExpensiveCalc = memo(function UseMemoExpensiveCalc() {
  const [size, setSize] = useState(500000)
  const [keyword, setKeyword] = useState('')
  const [forceTick, setForceTick] = useState(0)

  const arr = useMemo(() => {
    const a: number[] = []
    for (let i = 0; i < size; i++) a.push(Math.round(Math.random() * 1_000_000))
    return a
  }, [size])

  const t1 = performance.now()
  const sortedTop10Naive = [...arr].sort((a, b) => a - b).slice(0, 10)
  const naiveMs = performance.now() - t1

  const t2 = performance.now()
  const sortedTop10Memo = useMemo(() => {
    return [...arr].sort((a, b) => a - b).slice(0, 10)
  }, [arr])
  const memoMs = performance.now() - t2

  return (
    <div className="card">
      <h3 style={{ color: '#a855f7' }}>
        ③ useMemo — 跳过昂贵计算 & 稳定子组件对象 props
      </h3>
      <div style={{ marginBottom: '0.75rem' }}>
        <label>数组长度 N = </label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ padding: '0.35rem 0.5rem', borderRadius: '6px' }}
        >
          <option value={100000}>10万</option>
          <option value={300000}>30万</option>
          <option value={500000}>50万</option>
          <option value={800000}>80万</option>
        </select>
        <input
          placeholder="不相关输入：强制父组件重渲染（❌ 侧会明显卡顿）"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={() => setForceTick((x) => x + 1)}>🔄 forceTick {forceTick}</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ border: '1px solid #f59e0b', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: 0, color: '#fbbf24' }}>
            ❌ 每次渲染都排序（真实耗时）
          </h4>
          <p className="info-text">
            对 {size.toLocaleString()} 条数据执行 sort + slice，每帧重算。
            输入文字 / 点 forceTick 会明显感觉到输入框卡顿。
          </p>
          <p>
            本帧耗时：
            <span style={{ color: '#fbbf24', fontSize: '1.15rem' }}> {naiveMs.toFixed(3)} ms</span>
          </p>
          <p className="info-text">Top10 最小：{sortedTop10Naive.join(', ')}</p>
        </div>

        <div style={{ border: '1px solid #22c55e', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: 0, color: '#4ade80' }}>
            ✅ useMemo([arr]) — 依赖不变直接复用缓存
          </h4>
          <p className="info-text">
            首次计算一次后，点击 🔄 forceTick 或输入关键词：本块耗时 ≈ 0ms，UI 依然流畅。
          </p>
          <p>
            本帧耗时：
            <span style={{ color: '#4ade80', fontSize: '1.15rem' }}> {memoMs.toFixed(3)} ms</span>
          </p>
          <p className="info-text">Top10 最小：{sortedTop10Memo.join(', ')}</p>
        </div>
      </div>

      <CodeBlock code={`// ✅ 缓存昂贵计算
const sorted = useMemo(() =>
  [...arr].sort((a,b)=>a-b).slice(0,10)
, [arr])       // arr 不变，上面不重算

// ✅ 稳定对象/数组引用给 memo 子组件
const style = useMemo(() => ({ color: '#f00' }), [])
<MemoedView style={style} />  // 父重渲染时 style 引用不变

// ❌ 不要用在 n*1 这种便宜运算上
const doubled = useMemo(() => count * 2, [count])
// ↑ 反模式：memo 本身开销比计算还大`} language="typescript" style={{ marginTop: '1rem' }} />

      <SourceCode
        label="UseMemoExpensiveCalc（③ useMemo 示例）"
        code={USEMEMO_EXPENSIVE_CALC_SOURCE}
      />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const LIST_KEY_DEMO_SOURCE = `const ListKeyDemo = memo(function ListKeyDemo() {
  const [todos, setTodos] = useState([
    { id: 'a', text: '① 写 Bug', done: false },
    { id: 'b', text: '② 修 Bug', done: true },
    { id: 'c', text: '③ 写测试（没写过）', done: false },
  ])
  const renderTag = useRenderLabel('ListKeyDemo父组件') // 渲染次数徽标（实现见 PerfDemos.tsx）

  const toggle = (id: string) =>
    setTodos((arr) => arr.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  // ⬆️ 顶部插入新任务：id 用随机串保证唯一（真实代码 text 还拼时间，此处省略以免模板串）
  const insertTop = () =>
    setTodos((arr) => [
      { id: Math.random().toString(36).slice(2, 8), text: '★ 新任务', done: false },
      ...arr,
    ])

  return (
    <div>
      <h3>④ 列表 key = 唯一稳定 ID，不要 index</h3>
      <p>
        每行子组件初始化时有 useState 随机背景色：顶部插入/勾选后，颜色跟着「文本走」= 对，
        跟着「位置走」= 错 —— React 按 key 复用组件实例，key 错了会复用错的状态与 DOM。
      </p>
      <div>
        {renderTag}
        <button onClick={insertTop}>⬆️ 顶部插入一个新任务（关键操作！）</button>
        <button onClick={() => setTodos((arr) => [...arr].reverse())}>🔀 倒序</button>
        <button onClick={() => setTodos((arr) => arr.slice(1))}>🗑️ 删除第一个</button>
      </div>
      <h4>❌ index 作 key</h4>
      <TodoList todos={todos} useCorrectKey={false} onToggle={toggle} />
      <h4>✅ id 作 key</h4>
      <TodoList todos={todos} useCorrectKey={true} onToggle={toggle} />
      <p>💡 点顶部插入后：index 列表的勾选框状态和颜色都会「错位」，id 列表始终正确。</p>
    </div>
  )
})

// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
// key 的选取是整个演示唯一的分叉点：
//   const key = useCorrectKey ? todo.id : String(idx)  // id vs index
//   <TodoRow key={key} done={todo.done} text={todo.text} onToggle={...} />

// TodoRow：useState 惰性初始化随机背景色（只跑一次；组件实例被复用颜色就不变）。
function TodoRow({ done, text, onToggle }: TodoRowProps) {
  const [inputBg] = useState(() => {
    const hue = Math.floor(Math.random() * 360)
    return 'hsl(' + hue + ', 70%, 22%)' // key 错位时颜色会「跟位置不跟文本」
  })
  return (
    <label style={{ backgroundColor: inputBg }}>
      <input type="checkbox" checked={done} onChange={onToggle} />
      <span>{text}</span>
    </label>
  )
}`

// =========================================================
// ④ 列表 key 对 diff 的影响
// =========================================================
const ListKeyDemo = memo(function ListKeyDemo() {
  const [todos, setTodos] = useState([
    { id: 'a', text: '① 写 Bug', done: false },
    { id: 'b', text: '② 修 Bug', done: true },
    { id: 'c', text: '③ 写测试（没写过）', done: false },
  ])
  const renderTag = useRenderLabel('ListKeyDemo父组件')

  const toggle = (id: string) =>
    setTodos((arr) => arr.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  return (
    <div className="card">
      <h3 style={{ color: '#f59e0b' }}>
        ④ 列表 key = 唯一稳定 ID，不要 index
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        每一行子组件初始化时有 <code>useState</code> 随机背景色：
        勾选 / 顶部插入后，背景色跟着<strong>文本走</strong>就是对的；
        跟着<strong>位置走</strong>（勾选 A 变 B 被勾选）就是错的 —— 因为 React 按 key 复用组件实例。
      </p>
      <div style={{ marginBottom: '0.75rem' }}>
        {renderTag}
        <button
          className="primary"
          onClick={() =>
            setTodos((arr) => [
              {
                id: Math.random().toString(36).slice(2, 8),
                text: `★ 新任务 (${new Date().toLocaleTimeString()})`,
                done: false,
              },
              ...arr,
            ])
          }
        >
          ⬆️ 顶部插入一个新任务（关键操作！）
        </button>
        <button onClick={() => setTodos((arr) => [...arr].reverse())}>
          🔀 倒序
        </button>
        <button className="danger" onClick={() => setTodos((arr) => arr.slice(1))}>
          🗑️ 删除第一个
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TodoList
          title="❌ index 作 key"
          color="#f59e0b"
          todos={todos}
          useCorrectKey={false}
          onToggle={toggle}
        />
        <TodoList
          title="✅ id 作 key"
          color="#22c55e"
          todos={todos}
          useCorrectKey={true}
          onToggle={toggle}
        />
      </div>
      <p className="info-text" style={{ marginBottom: 0 }}>
        💡 点顶部插入后：index 列表中勾选框状态和颜色都会「错位」，id 列表始终正确。
      </p>

      <SourceCode label="ListKeyDemo（④ 列表 key 示例）" code={LIST_KEY_DEMO_SOURCE} />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const VIRTUAL_LIST_DEMO_SOURCE = `const VirtualListDemo = memo(function VirtualListDemo() {
  return (
    <div>
      <h3>⑤ 虚拟列表（Virtual List）— 10万行也丝滑</h3>
      <p>核心思想：只创建可视区域 + 上下缓冲区的 DOM 节点，滚动时改 transform 偏移模拟位置。</p>
      <SimpleVirtualList items={BIG_LIST} itemHeight={36} height={320} />
    </div>
  )
})

// 页面级常量（真实代码）：10 万条示例数据，形如 'Item #0 demo item ★'
// const BIG_LIST = Array.from({ length: 100_000 }, (_, i) => ...)

// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
export function SimpleVirtualList({ items, itemHeight, height }: SimpleVirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight                        // 撑起滚动条的总高度
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - 5) // 可视起点 - 5 行上缓冲
  const visibleCount = Math.ceil(height / itemHeight) + 10             // 可视行数 + 上下缓冲
  const endIdx = Math.min(items.length, startIdx + visibleCount)
  const offsetTop = startIdx * itemHeight // 内容整体下移 offsetTop，模拟已滚过的距离

  const visibleItems = useMemo(() => {
    const slice: { idx: number; text: string }[] = []
    for (let i = startIdx; i < endIdx; i++) slice.push({ idx: i, text: items[i] })
    return slice
  }, [startIdx, endIdx, items])

  return (
    <div onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)} style={{ height, overflow: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: 'translateY(' + offsetTop + 'px)' }}>
          {visibleItems.map(({ idx, text }) => (
            <div key={idx} style={{ height: itemHeight }}>
              #{idx.toString().padStart(5, '0')} {text}
            </div>
          ))}
        </div>
      </div>
      <div>共 {items.length} 行 · 实际只渲染 {visibleItems.length} 个 DOM (start={startIdx} end={endIdx})</div>
    </div>
  )
}`

// =========================================================
// ⑤ 虚拟列表：10万行但只渲染可视 DOM
// =========================================================
const BIG_LIST = Array.from(
  { length: 100_000 },
  (_, i) => `Item #${i} demo item ${'★'.repeat((i % 5) + 1)}`
)

const VirtualListDemo = memo(function VirtualListDemo() {
  return (
    <div className="card">
      <h3 style={{ color: '#ec4899' }}>
        ⑤ 虚拟列表（Virtual List）— 10万行也丝滑
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        核心思想：<strong>只创建可视区域 + 上下缓冲区的 DOM 节点</strong>，
        上下滚动时复用节点、修改 transform 偏移。列表行数超过 500 行就该考虑。
        社区成熟方案：<code>react-window</code> / <code>react-virtuoso</code>。
      </p>
      <SimpleVirtualList items={BIG_LIST} itemHeight={36} height={320} />

      <SourceCode label="VirtualListDemo（⑤ 虚拟列表示例）" code={VIRTUAL_LIST_DEMO_SOURCE} />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const LAZY_LOAD_DEMO_SOURCE = `// 页面顶部的真实加载方式（一行）：
const HeavyLazyComponent = lazy(() => import('../components/HeavyLazyComponent'))

const LazyLoadDemo = memo(function LazyLoadDemo() {
  const [showHeavy, setShowHeavy] = useState(false)   // 开关：动态加载 / 卸载重组件
  const [loadedAt, setLoadedAt] = useState<number | null>(null)

  const triggerClick = () => {
    if (!showHeavy) setLoadedAt(Date.now())
    setShowHeavy((v) => !v)
  }

  return (
    <div>
      <h3>⑥ React.lazy + Suspense — 首屏不加载大组件</h3>
      <p>编译时按动态 import 拆独立 js chunk（看 Network 面板），运行时用户触发才拉代码。</p>
      <button onClick={triggerClick}>
        {showHeavy ? '🔴 卸载重组件' : '🟢 动态加载 HeavyLazyComponent（看 Network）'}
      </button>
      {showHeavy && (
        <Suspense fallback={<div>⏳ Suspense loading...（模拟 chunk 网络加载 700ms）</div>}>
          <HeavyLazyComponent
            onLoaded={() => {
              const elapsed = Date.now() - (loadedAt as number)
              console.log('✅ Heavy chunk 加载完成，耗时', elapsed, 'ms')
            }}
          />
        </Suspense>
      )}
    </div>
  )
})

// ─── 关键节选（完整实现见 src/components/HeavyLazyComponent.tsx）───
export default function HeavyLazyComponent({ onLoaded }: HeavyLazyComponentProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // setTimeout 700ms 模拟 chunk 网络加载 + 大型库初始化
    const timer = setTimeout(() => {
      setReady(true)
      onLoaded?.() // 加载完成后通知父组件（用于记录耗时）
    }, 700)
    return () => clearTimeout(timer)
  }, [onLoaded])

  // 其余为 30 个「Lazy Row #n」的展示网格 + ready 状态徽标（样式见真实文件）
}`

// =========================================================
// ⑥ React.lazy + Suspense 代码分包加载
// =========================================================
const LazyLoadDemo = memo(function LazyLoadDemo() {
  const [showHeavy, setShowHeavy] = useState(false)
  const [loadedAt, setLoadedAt] = useState<number | null>(null)
  const triggerClick = () => {
    if (!showHeavy) setLoadedAt(Date.now())
    setShowHeavy((v) => !v)
  }
  return (
    <div className="card">
      <h3 style={{ color: '#14b8a6' }}>
        ⑥ React.lazy + Suspense — 首屏不加载大组件
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        编译时按动态 import 自动拆成独立 js chunk（DevTools Network 面板能看到加载行为），
        运行时用户触发了才去拉代码。
        适合：弹窗、路由页、富文本编辑器、图表等「非首屏 / 低频组件」。
      </p>
      <button className="primary" onClick={triggerClick}>
        {showHeavy ? '🔴 卸载重组件' : '🟢 动态加载 HeavyLazyComponent（看 Network）'}
      </button>
      {loadedAt && showHeavy && (
        <Suspense
          fallback={
            <div
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px dashed #14b8a6',
                borderRadius: '8px',
                color: '#14b8a6',
              }}
            >
              ⏳ Suspense loading...（模拟 chunk 网络加载 700ms）
            </div>
          }
        >
          {showHeavy && (
            <HeavyLazyComponent
              onLoaded={() => {
                const elapsed = Date.now() - (loadedAt as number)
                console.log('✅ Heavy chunk 加载完成，耗时', elapsed, 'ms')
              }}
            />
          )}
        </Suspense>
      )}

      <SourceCode label="LazyLoadDemo（⑥ React.lazy 示例）" code={LAZY_LOAD_DEMO_SOURCE} />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const TRANSITION_DEMO_SOURCE = `const TransitionDemo = memo(function TransitionDemo() {
  const [keyword, setKeyword] = useState('')   // 紧急 state：输入框用
  const [deferred, setDeferred] = useState('') // 延迟 state：过滤渲染用

  const setWithTransition = (v: string) => {
    setKeyword(v)                           // 紧急：输入框立刻响应
    startTransition(() => setDeferred(v))   // 非紧急：过滤晚点渲染没关系，可被打断
  }

  return (
    <div>
      <h3>⑦ startTransition — 保持输入框不卡，搜索结果晚点更没关系</h3>
      <p>
        把渲染分成紧急（键盘输入、hover）vs 过渡（列表过滤、路由跳转）；
        过渡更新期间可被打断，可配合 useDeferredValue / useTransition 显示骨架。
      </p>
      <input
        placeholder="输入关键字（10万条过滤，非 transition 会卡）"
        value={keyword}
        onChange={(e) => setWithTransition(e.target.value)}
      />
      <TransitionFilterInput keyword={keyword} label="❌ 紧急渲染（关键字原样）" />
      <TransitionFilterInput keyword={deferred} label="✅ startTransition 延迟" />
    </div>
  )
})

// 页面级常量（真实代码）：BIG_LIST = 10 万条字符串，与 ⑤ 相同。

// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
// TransitionFilterInput：memo 子组件，useMemo 内对 10 万条按 keyword 过滤（只取前 100 条），
// 依赖 keyword 变了才重算；真实实现还带渲染次数徽标与滚动列表。
const TransitionFilterInput = memo(function TransitionFilterInput({ keyword, label }: FilterInputProps) {
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return BIG_LIST.slice(0, 100)
    const res: string[] = []
    for (let i = 0; i < BIG_LIST.length && res.length < 100; i++) {
      if (BIG_LIST[i].toLowerCase().includes(kw)) res.push(BIG_LIST[i])
    }
    return res
  }, [keyword])

  return (
    <div>
      <h5>{label}</h5>
      <p>关键词「{keyword || '空'}」匹配 {items.length} / {BIG_LIST.length}</p>
      <div>{items.slice(0, 40).map((x) => <div key={x}>{x}</div>)}</div>
    </div>
  )
})`

// =========================================================
// ⑦ startTransition — 紧急更新 vs 过渡更新
// =========================================================
const TransitionDemo = memo(function TransitionDemo() {
  const [keyword, setKeyword] = useState('')
  const [deferred, setDeferred] = useState('')

  const setWithTransition = (v: string) => {
    setKeyword(v)
    startTransition(() => setDeferred(v))
  }

  return (
    <div className="card">
      <h3 style={{ color: '#06b6d4' }}>
        ⑦ startTransition — 保持输入框不卡，搜索结果晚点更没关系
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        把渲染工作分成 <strong>紧急（urgent）</strong>：键盘输入、hover
        vs <strong>过渡（transition）</strong>：列表过滤、路由跳转等。
        过渡更新期间可被打断，可配合 useDeferredValue / useTransition 显示骨架。
      </p>
      <div style={{ marginBottom: '0.75rem' }}>
        <input
          placeholder="输入关键字（10万条过滤，非 transition 会卡）"
          value={keyword}
          onChange={(e) => setWithTransition(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <TransitionFilterInput
        keyword={keyword}
        label="❌ 紧急渲染（关键字原样）"
        color="#f59e0b"
      />
      <TransitionFilterInput
        keyword={deferred}
        label="✅ startTransition 延迟"
        color="#22c55e"
      />

      <SourceCode label="TransitionDemo（⑦ startTransition 示例）" code={TRANSITION_DEMO_SOURCE} />
    </div>
  )
})

interface FilterInputProps {
  keyword: string
  label: string
  color: string
}
const TransitionFilterInput = memo(function TransitionFilterInput({
  keyword,
  label,
  color,
}: FilterInputProps) {
  const renderTag = useRenderLabel(label.split(' ')[0])
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return BIG_LIST.slice(0, 100)
    const res: string[] = []
    for (let i = 0; i < BIG_LIST.length && res.length < 100; i++) {
      if (BIG_LIST[i].toLowerCase().includes(kw)) res.push(BIG_LIST[i])
    }
    return res
  }, [keyword])

  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h5 style={{ margin: 0, color }}>{label}</h5>
        {renderTag}
      </div>
      <p className="info-text" style={{ margin: '0.25rem 0 0.5rem 0' }}>
        关键词「{keyword || '空'}」匹配 {items.length} / {BIG_LIST.length}
      </p>
      <div
        style={{
          height: 100,
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
        }}
      >
        {items.slice(0, 40).map((x) => (
          <div key={x}>{x}</div>
        ))}
      </div>
    </div>
  )
})

// -----------------------------------------------------
// UseDeferredValueDemo 源码快照：供 ⑧ 卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示的核心 API 用法，请同步更新这里的字符串内容。
// 快照已去除 style/class/布局等噪音，仅保留 useDeferredValue 关键使用路径。
// -----------------------------------------------------
const USE_DEFERRED_VALUE_DEMO_SOURCE = `import { useState, useDeferredValue, useMemo, memo } from 'react'

// ─── 核心用法：4 行搞定延迟值 + 陈旧信号 ───
function UseDeferredValueDemo() {
  const [keyword, setKeyword] = useState('')
  const deferredKeyword = useDeferredValue(keyword)   // ✅ API：包裹一个值，返回延迟副本
  const isStale = keyword !== deferredKeyword          // ✅ 惯用技巧：推导「陈旧」信号

  return (
    <>
      <input
        value={keyword}                                 // 输入框用「实时值」→ 按键立竿见影
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>     // 陈旧时变淡，提示用户结果在更新
        {isStale && <span>⏳ 更新中...</span>}
        <SearchResults query={deferredKeyword} />       // 列表用「延迟值」→ 不卡输入
      </div>
    </>
  )
}

// ─── 典型下游：接收 query 做昂贵过滤（配合 useMemo 进一步防抖）───
const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  const results = useMemo(() => {
    return BIG_DATA.filter((item) => item.includes(query)).slice(0, 100)
  }, [query])                                            // 依赖延迟值，输入期间不重算
  return <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>
})

// ⚠️ 与 startTransition / useTransition 区别：
// startTransition()    → 包裹 setState「动作」，无进行中信号
// useDeferredValue(v)  → 包裹一个「值」，v !== dv 即可得 isStale
// useTransition()      → [isPending, startTransition]，驱动骨架屏/禁用态`

// =========================================================
// ⑧ useDeferredValue — 值延迟更新 + isStale 陈旧视觉反馈
// =========================================================
const UseDeferredValueDemo = memo(function UseDeferredValueDemo() {
  const [keyword, setKeyword] = useState('')
  const deferredKeyword = useDeferredValue(keyword)
  const isStale = keyword !== deferredKeyword

  return (
    <div className="card">
      <h3 style={{ color: '#f43f5e' }}>
        ⑧ useDeferredValue — 包裹"值"本身，自动延迟 + isStale 陈旧提示
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        和 ⑦ startTransition / ⑨ useTransition 的思路同源，但切入点不同：
        <code>startTransition</code> 包裹<strong>「更新动作」</strong>（setState 调用），
        而 <code>useDeferredValue</code> 包裹<strong>「一个值」</strong>（state / prop 均可），
        自动返回该值的「延迟副本」。配合 <code>query !== deferredQuery</code> 即得 isStale 信号，
        可驱动透明度、badge 等<strong>陈旧内容视觉提示</strong>。
      </p>

      <div style={{ marginBottom: '0.75rem' }}>
        <input
          placeholder="输入关键字（10万条过滤：❌ 侧每键必重算，✅ 侧延迟到空闲再算）"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <DeferredFilterPanel
            keyword={keyword}
            label="❌ 直接使用 keyword（紧急渲染，易卡）"
            color="#f59e0b"
            showStaleBadge={false}
          />
        </div>
        <div>
          <DeferredFilterPanel
            keyword={deferredKeyword}
            label={
              isStale
                ? '⏳ useDeferredValue（显示旧值 + 陈旧标记）'
                : '✅ useDeferredValue（已追上最新值）'
            }
            color="#f43f5e"
            opacity={isStale ? 0.55 : 1}
            showStaleBadge={isStale}
          />
        </div>
      </div>

      <CodeBlock code={`// ✅ 最常见模式：搜索框 / 筛选框
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
const isStale = query !== deferredQuery  // 陈旧信号

return (
  <>
    <input value={query} onChange={e => setQuery(e.target.value)} />
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {/* 这里用 deferredQuery 过滤/渲染，输入不卡 */}
      <SearchResults query={deferredQuery} />
      {isStale && <Tag>更新中...</Tag>}
    </div>
  </>
)

// ⚠️ 三兄弟区别一句话总结：
// startTransition()    → 包裹 setState 动作，无进行中信号
// useDeferredValue(v)  → 包裹一个值，自带 isStale 信号（v !== dv）
// useTransition()      → [isPending, startTransition]，显式驱动骨架屏/禁用态`} language="typescript" style={{ marginTop: '1rem' }} />

      <SourceCode
        label="UseDeferredValueDemo（⑧ useDeferredValue 示例）"
        code={USE_DEFERRED_VALUE_DEMO_SOURCE}
      />
    </div>
  )
})

interface DeferredFilterPanelProps {
  keyword: string
  label: string
  color: string
  opacity?: number
  showStaleBadge?: boolean
}
const DeferredFilterPanel = memo(function DeferredFilterPanel({
  keyword,
  label,
  color,
  opacity = 1,
  showStaleBadge = false,
}: DeferredFilterPanelProps) {
  const renderTag = useRenderLabel(label.split(' ')[0])
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return BIG_LIST.slice(0, 100)
    const res: string[] = []
    for (let i = 0; i < BIG_LIST.length && res.length < 100; i++) {
      if (BIG_LIST[i].toLowerCase().includes(kw)) res.push(BIG_LIST[i])
    }
    return res
  }, [keyword])

  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: '8px',
        padding: '0.75rem',
        opacity,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{ margin: 0, color }}>{label}</h5>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {showStaleBadge && (
            <span
              className="tag"
              style={{
                color: '#f43f5e',
                borderColor: '#f43f5e',
                backgroundColor: '#f43f5e15',
              }}
            >
              ⏳ 陈旧
            </span>
          )}
          {renderTag}
        </div>
      </div>
      <p className="info-text" style={{ margin: '0.25rem 0 0.5rem 0' }}>
        关键词「{keyword || '空'}」匹配 {items.length} / {BIG_LIST.length}
      </p>
      <div
        style={{
          height: 100,
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
        }}
      >
        {items.slice(0, 40).map((x) => (
          <div key={x}>{x}</div>
        ))}
      </div>
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const USE_TRANSITION_DEMO_SOURCE = `// 页面同文件配套（真实代码）：3 个 tab 预置，seed 决定生成的数据
type TabKey = 'daily' | 'weekly' | 'monthly'
const TAB_PRESETS = [
  { key: 'daily', label: '日榜', seed: 'daily-leaderboard', size: 8000 },
  // ...weekly(12000) / monthly(18000) 两项同构，从略
]
const UseTransitionDemo = memo(function UseTransitionDemo() {
  const renderTag = useRenderLabel('UseTransition父组件') // 渲染次数徽标（实现见 PerfDemos.tsx）
  const [urgentTab, setUrgentTab] = useState<TabKey>('daily')         // ❌ 侧：普通 setState
  const [transitionTab, setTransitionTab] = useState<TabKey>('daily') // ✅ 侧
  const [isPending, startTransition] = useTransition() // ✅ 核心：isPending 信号 + 过渡包裹函数
  const [clicks, setClicks] = useState(0)              // 连点计数：观察 UI 是否被卡住

  // 两侧各自按 tab 用 useMemo 生成（故意昂贵的）榜单数据
  const urgentData = useMemo(() => {
    const p = TAB_PRESETS.find((x) => x.key === urgentTab)!
    return buildLeaderboardDataSet(p.seed, p.size) // 上万条 → 渲染很慢，制造卡顿
  }, [urgentTab])
  const transitionData = useMemo(() => {
    const p = TAB_PRESETS.find((x) => x.key === transitionTab)!
    return buildLeaderboardDataSet(p.seed, p.size)
  }, [transitionTab])
  const urgentTitle = '❌ 紧急渲染 · ' + TAB_PRESETS.find((x) => x.key === urgentTab)!.label
  const transitionTitle = '✅ 过渡渲染 · ' + TAB_PRESETS.find((x) => x.key === transitionTab)!.label

  const handleUrgentClick = (key: TabKey) => {    // ❌ 紧急切换：整页同步卡住
    setUrgentTab(key)
    setClicks((c) => c + 1)
  }
  const handleTransitionClick = (key: TabKey) => { // ✅ 过渡切换：昂贵渲染包进过渡，可被打断
    startTransition(() => setTransitionTab(key))
    setClicks((c) => c + 1)
  }

  return (
    <div>
      <h3>⑨ useTransition — isPending 驱动骨架屏，切大报表不丢响应</h3>
      <p>useTransition = startTransition + isPending 信号：isPending 期间显示骨架/禁用按钮，用户仍能继续点。</p>
      <div>{renderTag} 总点击次数 = {clicks}</div>
      {/* ❌ 左侧：普通 setState，切 tab 时整页卡住 */}
      <h4>❌ 普通 setState：切换时整页卡住</h4>
      {TAB_PRESETS.map((p) => (
        <button key={p.key} onClick={() => handleUrgentClick(p.key)}>
          {p.label}（{p.size.toLocaleString()}条）
        </button>
      ))}
      <ExpensiveLeaderboard title={urgentTitle} data={urgentData} />
      {/* ✅ 右侧：切 tab 期间 isPending=true → 骨架屏占位，算完替换榜单 */}
      <h4>✅ useTransition：isPending 显示骨架，可被打断</h4>
      {TAB_PRESETS.map((p) => (
        <button key={p.key} onClick={() => handleTransitionClick(p.key)} disabled={isPending}>
          {isPending && transitionTab === p.key ? '⏳ ' : ''}{p.label}
        </button>
      ))}
      {isPending ? (
        <div>⏳ 骨架屏 · isPending=true（shimmer 动画样式省略，见真实代码 style 块）</div>
      ) : (
        <ExpensiveLeaderboard title={transitionTitle} data={transitionData} />
      )}
    </div>
  )
})
// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
// buildLeaderboardDataSet(seed, size)：以 seed 做种子的确定性伪随机榜单（线性同余 rand），
// 返回 { rank, name, score, growth }[]。
// ExpensiveLeaderboard：memo 组件故意做慢渲染；useMemo 内 sort（score 降序）后按名次
// 切 tier（前 10% S / 30% A / 60% B / 其余 C），取前 60 条 + 徽标渲染。
// 与 ⑦ 的区别：startTransition() → 只包裹动作无信号；useTransition() [isPending] → 驱动骨架屏/禁用态`

// =========================================================
// ⑨ useTransition — startTransition + isPending 骨架屏
// =========================================================
type TabKey = 'daily' | 'weekly' | 'monthly'

const TAB_PRESETS: { key: TabKey; label: string; seed: string; size: number }[] = [
  { key: 'daily', label: '日榜', seed: 'daily-leaderboard', size: 8000 },
  { key: 'weekly', label: '周榜', seed: 'weekly-leaderboard-v2', size: 12000 },
  { key: 'monthly', label: '月榜', seed: 'monthly-leaderboard-final', size: 18000 },
]

const UseTransitionDemo = memo(function UseTransitionDemo() {
  const renderTag = useRenderLabel('UseTransition父组件')
  const [urgentTab, setUrgentTab] = useState<TabKey>('daily')
  const [transitionTab, setTransitionTab] = useState<TabKey>('daily')
  const [isPending, startTransitionState] = useTransition()
  const [clicks, setClicks] = useState(0)

  const urgentData = useMemo(
    () => {
      const p = TAB_PRESETS.find((x) => x.key === urgentTab)!
      return buildLeaderboardDataSet(p.seed, p.size)
    },
    [urgentTab]
  )
  const transitionData = useMemo(
    () => {
      const p = TAB_PRESETS.find((x) => x.key === transitionTab)!
      return buildLeaderboardDataSet(p.seed, p.size)
    },
    [transitionTab]
  )

  const handleUrgentClick = (key: TabKey) => {
    setUrgentTab(key)
    setClicks((c) => c + 1)
  }
  const handleTransitionClick = (key: TabKey) => {
    startTransitionState(() => {
      setTransitionTab(key)
    })
    setClicks((c) => c + 1)
  }

  return (
    <div className="card">
      <h3 style={{ color: '#8b5cf6' }}>
        ⑨ useTransition — isPending 驱动骨架屏，切大报表不丢响应
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        <code>useTransition</code> = <code>startTransition</code> + <code>isPending</code> 信号。
        和 ⑦ 的区别是：你可以用 <code>isPending</code> 在过渡期间<strong>显示骨架屏 / 禁用按钮 / 降低透明度</strong>，
        而用户在计算过程中依然能点按钮（React 会合并/打断旧的过渡）。
      </p>
      <div style={{ marginBottom: '0.75rem' }}>
        {renderTag}
        <span className="tag" style={{ marginLeft: '0.5rem' }}>
          总点击次数 = {clicks}
        </span>
        <span className="info-text" style={{ marginLeft: '0.75rem', fontSize: '0.85rem' }}>
          💡 快速连点三个 tab，对比两侧按钮释放速度和骨架屏表现。
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ border: '1px solid #f59e0b', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>
            ❌ 普通 setState：切换时整页卡住
          </h4>
          <p className="info-text" style={{ marginTop: 0 }}>
            点 tab 后按钮按下态迟迟不释放，连点的话所有点击排队，渲染量 = 点击次数 × 单次开销。
          </p>
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            {TAB_PRESETS.map((p) => (
              <button
                key={p.key}
                className={urgentTab === p.key ? 'primary' : ''}
                onClick={() => handleUrgentClick(p.key)}
              >
                {urgentTab === p.key ? '● ' : '○ '}
                {p.label}（{p.size.toLocaleString()}条）
              </button>
            ))}
          </div>
          <ExpensiveLeaderboard
            title={`❌ 紧急渲染 · ${TAB_PRESETS.find((x) => x.key === urgentTab)!.label}`}
            data={urgentData}
          />
        </div>

        <div style={{ border: '1px solid #8b5cf6', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#a78bfa' }}>
            ✅ useTransition：isPending 显示骨架，可被打断
          </h4>
          <p className="info-text" style={{ marginTop: 0 }}>
            切 tab 瞬间按钮先高亮（紧急 state 已更新），<code>isPending=true</code> 显示骨架，
            算完再替换。中途再点别的 tab 会让<strong>上一次过渡被打断作废</strong>，不做无用功。
          </p>
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            {TAB_PRESETS.map((p) => (
              <button
                key={p.key}
                className={transitionTab === p.key ? 'primary' : ''}
                onClick={() => handleTransitionClick(p.key)}
                disabled={isPending}
                style={{ opacity: isPending && transitionTab !== p.key ? 0.55 : 1 }}
              >
                {transitionTab === p.key ? (isPending ? '⏳ ' : '● ') : '○ '}
                {p.label}（{p.size.toLocaleString()}条）
              </button>
            ))}
          </div>
          {isPending ? (
            <div
              style={{
                border: '1px solid #8b5cf655',
                borderRadius: '8px',
                padding: '0.75rem',
                backgroundColor: '#8b5cf60d',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <h5 style={{ margin: 0, color: '#a78bfa' }}>⏳ 骨架屏 · isPending=true</h5>
                <span className="tag" style={{ color: '#a78bfa', borderColor: '#a78bfa' }}>
                  过渡中...
                </span>
              </div>
              <p className="info-text" style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem' }}>
                useTransition 正在后台计算下一个 tab 的数据，<strong>你现在依然能点其他按钮</strong>。
              </p>
              <div
                style={{
                  height: 200,
                  overflow: 'hidden',
                  background:
                    'repeating-linear-gradient(180deg, rgba(139,92,246,0.10) 0 28px, rgba(139,92,246,0.04) 28px 36px)',
                  borderRadius: '6px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                    animation: 'skeleton-shimmer 1.2s linear infinite',
                  }}
                />
              </div>
            </div>
          ) : (
            <ExpensiveLeaderboard
              title={`✅ 过渡渲染 · ${TAB_PRESETS.find((x) => x.key === transitionTab)!.label}`}
              data={transitionData}
            />
          )}
        </div>
      </div>

      <CodeBlock code={`// ✅ useTransition = startTransition + isPending 信号
const [isPending, startTransition] = useTransition()
const [tab, setTab] = useState('daily')
const [data, setData] = useState(initialData)

function switchTab(next) {
  // 1) setState 标记"正在算下一个"，可显示骨架/禁用按钮
  // 2) 过渡期间若再触发 -> 旧过渡作废，避免浪费
  startTransition(() => {
    setTab(next)                          // 非紧急：晚点更新没关系
    setData(buildLeaderboardDataSet(next)) // 昂贵计算包在同一个过渡里
  })
}

return (
  <>
    <TabBar isLoading={isPending} />
    {isPending ? <Skeleton /> : <BigTable data={data} />}
  </>
)

// ⚠️ 和 startTransition 的区别：
// startTransition()         -> 只包裹动作，不知道"进行中"
// useTransition()[isPending] -> 额外给一个信号量驱动 UI 状态`} language="typescript" style={{ marginTop: '1rem' }} />

      <style>{`
        @keyframes skeleton-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <SourceCode
        label="UseTransitionDemo（⑨ useTransition 示例）"
        code={USE_TRANSITION_DEMO_SOURCE}
      />
    </div>
  )
})

// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改下方演示组件的核心逻辑时请同步更新。
const SUSPENSE_RENDER_COUNT_DEMO_SOURCE = `const SuspenseRenderCountDemo = memo(function SuspenseRenderCountDemo() {
  const [label, setLabel] = useState('A') // 传给 ExpensiveChart 的关键 prop
  const [other, setOther] = useState(0)   // 不相关 state：改它不应触发图表重算
  const renderTag = useRenderLabel('Suspense父组件') // 渲染次数徽标（实现见 PerfDemos.tsx）

  return (
    <div>
      <h3>⑩ ExpensiveChart + memo / useMemo 综合观察</h3>
      <p>
        模拟图表组件首次渲染要生成 1500 个 span 点；配合 memo，只有当传入的 label 真的变了才重画。
        点击「改不相关 state」看看它会不会重新计算。
      </p>
      <div>
        {renderTag}
        <button onClick={() => setLabel(label === 'A' ? 'B' : 'A')}>🔁 改 label（图表应重算）</button>
        <button onClick={() => setOther((x) => x + 1)}>🔄 改不相关 state other = {other}</button>
      </div>
      <ExpensiveChart label={label} />
    </div>
  )
})

// ─── 关键节选（完整实现见 src/components/PerfDemos.tsx）───
// ExpensiveChart：memo + forwardRef 封装，props 只有 label；内部 useMemo 一次性生成
// 1500 个随机点（依赖 []，只算一次）并计时。父组件 re-render 时因 memo 浅比较
// label 未变 → 整个组件被跳过，1500 个 span 不会重建。
export const ExpensiveChart = memo(
  forwardRef<HTMLDivElement, { label: string; onReady?: (el: HTMLDivElement) => void }>(
    function ExpensiveChart({ label }, ref) {
      const dots = useMemo(() => {
        const t0 = performance.now()
        const arr: { x: number; y: number; c: string }[] = []
        for (let i = 0; i < 1500; i++) {
          arr.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            c: 'hsl(' + Math.floor(Math.random() * 360) + ',70%,60%)',
          })
        }
        return arr
      }, [])
      const renderBadge = useRenderLabel('ExpensiveChart') // 渲染次数徽标（实现见 PerfDemos.tsx）
      // 返回的 JSX：renderBadge + dots.map 渲染 1500 个绝对定位的 2px 圆点（样式省略）
      return <div ref={ref}>{renderBadge} · label={label}</div>
    }
  )
)`

// =========================================================
// ⑩ ExpensiveChart 综合观察 memo/useMemo
// =========================================================
const SuspenseRenderCountDemo = memo(function SuspenseRenderCountDemo() {
  const [label, setLabel] = useState('A')
  const [other, setOther] = useState(0)
  const renderTag = useRenderLabel('Suspense父组件')
  return (
    <div className="card">
      <h3>⑩ ExpensiveChart + memo / useMemo 综合观察</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        模拟图表组件首次渲染要生成 1500 个 span 点。配合 memo 只有当传入的 label 真变了才重画。
        点击「改不相关 state」看看它会不会重新计算。
      </p>
      <div style={{ marginBottom: '0.75rem' }}>
        {renderTag}
        <button onClick={() => setLabel(label === 'A' ? 'B' : 'A')}>
          🔁 改 label（图表应重算）
        </button>
        <button onClick={() => setOther((x) => x + 1)}>
          🔄 改不相关 state other = {other}
        </button>
      </div>
      <ExpensiveChart label={label} />

      <SourceCode
        label="SuspenseRenderCountDemo（⑩ ExpensiveChart 观察）"
        code={SUSPENSE_RENDER_COUNT_DEMO_SOURCE}
      />
    </div>
  )
})

// 引用 useEffect 占位（保留未来扩展可能，避免无用导入检查告警）
void useEffect

export default PerformancePage
