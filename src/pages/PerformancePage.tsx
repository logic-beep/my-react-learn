import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  lazy,
  Suspense,
  startTransition,
  memo,
} from 'react'
import {
  CounterBadgeNoMemo,
  CounterBadgeMemo,
  CallbackButtonMemo,
  TodoList,
  SimpleVirtualList,
  ExpensiveChart,
  useRenderLabel,
} from '../components/PerfDemos'

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
      <SuspenseRenderCountDemo />
    </div>
  )
}

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
    </div>
  )
})

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
    </div>
  )
})

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

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
          {`// ✅ 缓存昂贵计算
const sorted = useMemo(() =>
  [...arr].sort((a,b)=>a-b).slice(0,10)
, [arr])       // arr 不变，上面不重算

// ✅ 稳定对象/数组引用给 memo 子组件
const style = useMemo(() => ({ color: '#f00' }), [])
<MemoedView style={style} />  // 父重渲染时 style 引用不变

// ❌ 不要用在 n*1 这种便宜运算上
const doubled = useMemo(() => count * 2, [count])
// ↑ 反模式：memo 本身开销比计算还大`}
        </pre>
      </div>
    </div>
  )
})

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
    </div>
  )
})

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
    </div>
  )
})

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
    </div>
  )
})

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

// =========================================================
// ⑧ ExpensiveChart 综合观察 memo/useMemo
// =========================================================
const SuspenseRenderCountDemo = memo(function SuspenseRenderCountDemo() {
  const [label, setLabel] = useState('A')
  const [other, setOther] = useState(0)
  const renderTag = useRenderLabel('Suspense父组件')
  return (
    <div className="card">
      <h3>⑧ ExpensiveChart + memo / useMemo 综合观察</h3>
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
    </div>
  )
})

// 引用 useEffect 占位（保留未来扩展可能，避免无用导入检查告警）
void useEffect

export default PerformancePage
