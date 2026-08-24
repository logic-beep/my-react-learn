import { memo, useState, useMemo, forwardRef, useRef, useEffect } from 'react'

// ===================== 辅助：渲染计数器 HOC 风格 Hook =====================
export function useRenderLabel(name: string) {
  const count = useRef(0)
  count.current += 1
  void useState(0)
  return (
    <span
      className="tag"
      style={{
        backgroundColor: count.current > 1 ? '#f59e0b33' : '#22c55e33',
        color: count.current > 1 ? '#fbbf24' : '#4ade80',
      }}
      title={`${name} 渲染次数`}
    >
      🔄 {name} #{count.current}
    </span>
  )
}

// ===================== ① 无 memo 子组件 vs memo 子组件 =====================
interface CounterBadgeProps {
  count: number
  label: string
}

export function CounterBadgeNoMemo({ count, label }: CounterBadgeProps) {
  const renderBadge = useRenderLabel(`无Memo-${label}`)
  return (
    <div
      style={{
        border: '1px solid #555',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        marginBottom: '0.5rem',
        backgroundColor: '#111827',
      }}
    >
      {renderBadge} <span className="info-text">| 值: {count}</span>
    </div>
  )
}

export const CounterBadgeMemo = memo(function CounterBadgeMemo({
  count,
  label,
}: CounterBadgeProps) {
  const renderBadge = useRenderLabel(`Memo-${label}`)
  return (
    <div
      style={{
        border: '1px solid #22c55e',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        marginBottom: '0.5rem',
        backgroundColor: '#052e16',
      }}
    >
      {renderBadge} <span className="info-text">| 值: {count}</span>
    </div>
  )
})

// ===================== ② useCallback 场景：函数 prop 给 memo 子组件 =====================
interface ButtonChildProps {
  label: string
  onClick: () => void
}

export const CallbackButtonMemo = memo(function CallbackButtonMemo({
  label,
  onClick,
}: ButtonChildProps) {
  const renderBadge = useRenderLabel(`MemoBtn-${label}`)
  return (
    <div style={{ marginBottom: '0.4rem' }}>
      {renderBadge}{' '}
      <button onClick={onClick} style={{ padding: '0.25rem 0.6rem', fontSize: '0.85rem' }}>
        {label}
      </button>
    </div>
  )
})

// ===================== ③ 列表 key 示例 =====================
interface TodoItem {
  id: string
  text: string
  done: boolean
}

interface TodoListProps {
  todos: TodoItem[]
  useCorrectKey: boolean
  onToggle: (id: string) => void
  title: string
  color: string
}

export function TodoList({ todos, useCorrectKey, onToggle, title, color }: TodoListProps) {
  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: '8px',
        padding: '0.75rem',
        backgroundColor: '#0a0a0a',
      }}
    >
      <h5 style={{ margin: '0 0 0.5rem 0', color }}>
        {title}
        {useCorrectKey ? ' ✅ key=todo.id' : ' ❌ key=index'}
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {todos.map((todo, idx) => {
          const key = useCorrectKey ? todo.id : String(idx)
          return (
            <TodoRow
              key={key}
              done={todo.done}
              text={todo.text}
              onToggle={() => onToggle(todo.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

interface TodoRowProps {
  done: boolean
  text: string
  onToggle: () => void
}

function TodoRow({ done, text, onToggle }: TodoRowProps) {
  const [inputBg] = useState(() => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 22%)`
  })
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.6rem',
        borderRadius: '6px',
        backgroundColor: inputBg,
        cursor: 'pointer',
        fontSize: '0.9rem',
      }}
    >
      <input type="checkbox" checked={done} onChange={onToggle} />
      <span style={{ textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>
        {text}
      </span>
    </label>
  )
}

// ===================== ④ 虚拟列表：简易版长列表渲染 =====================
interface SimpleVirtualListProps {
  items: string[]
  itemHeight: number
  height: number
}

export function SimpleVirtualList({ items, itemHeight, height }: SimpleVirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - 5)
  const visibleCount = Math.ceil(height / itemHeight) + 10
  const endIdx = Math.min(items.length, startIdx + visibleCount)
  const offsetTop = startIdx * itemHeight

  const visibleItems = useMemo(() => {
    const slice: { idx: number; text: string }[] = []
    for (let i = startIdx; i < endIdx; i++) slice.push({ idx: i, text: items[i] })
    return slice
  }, [startIdx, endIdx, items])

  return (
    <div
      ref={containerRef}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      style={{ height, overflow: 'auto', border: '1px solid #333', borderRadius: '8px' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetTop}px)` }}>
          {visibleItems.map(({ idx, text }) => (
            <div
              key={idx}
              style={{
                height: itemHeight,
                padding: '0 0.75rem',
                lineHeight: `${itemHeight}px`,
                borderBottom: '1px solid #1e293b',
                backgroundColor: idx % 2 ? '#0a0a0a' : '#111',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              #{idx.toString().padStart(5, '0')}  {text}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#1e3a8a',
          padding: '0.25rem 0.75rem',
          fontSize: '0.8rem',
        }}
      >
        共 {items.length} 行 · 实际只渲染 {visibleItems.length} 个 DOM (start={startIdx} end={endIdx})
      </div>
    </div>
  )
}

// ===================== ⑤ forwardRef + 大组件配合（放在组件树里方便展示）=====================
export const ExpensiveChart = memo(
  forwardRef<HTMLDivElement, { label: string; onReady?: (el: HTMLDivElement) => void }>(
    function ExpensiveChart({ label, onReady }, ref) {
      // 模拟昂贵计算：生成 1500 个 DOM 点；计时写在 useMemo 回调内部才能测到真实计算耗时
      const calcMsRef = useRef(0)
      const dots = useMemo(() => {
        const t0 = performance.now()
        const arr: { x: number; y: number; c: string }[] = []
        for (let i = 0; i < 1500; i++) {
          arr.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            c: `hsl(${Math.floor(Math.random() * 360)},70%,60%)`,
          })
        }
        calcMsRef.current = performance.now() - t0
        return arr
      }, [])
      const calcMs = calcMsRef.current
      const [readyReported, setReadyReported] = useState(false)
      useEffect(() => {
        if (onReady && !readyReported && ref && typeof ref !== 'function' && ref.current) {
          onReady(ref.current)
          setReadyReported(true)
        }
      }, [onReady, ref, readyReported])

      const renderBadge = useRenderLabel('ExpensiveChart')
      return (
        <div
          ref={ref}
          style={{
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '0.5rem',
            backgroundColor: '#0b1120',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            {renderBadge}
            <span className="info-text">
              首次计算 dots 耗时: <strong>{calcMs.toFixed(2)}ms</strong> · label={label}
            </span>
          </div>
          <div style={{ height: 120, position: 'relative' }}>
            {dots.map((d, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: 2,
                  height: 2,
                  backgroundColor: d.c,
                  borderRadius: '50%',
                }}
              />
            ))}
          </div>
        </div>
      )
    }
  )
)

// ===================== ⑥ 配合 useTransition 教学：故意渲染慢的排行榜组件 =====================
export interface LeaderboardRow {
  rank: number
  name: string
  score: number
  growth: number
}

export function buildLeaderboardDataSet(seed: string, size = 8000): LeaderboardRow[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  const rand = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
  const names = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']
  const arr: LeaderboardRow[] = []
  for (let i = 0; i < size; i++) {
    arr.push({
      rank: i + 1,
      name: `${names[Math.floor(rand() * names.length)]}_${Math.floor(rand() * 10000)}`,
      score: Math.floor(rand() * 10_000_000),
      growth: rand() * 200 - 100,
    })
  }
  return arr
}

interface ExpensiveLeaderboardProps {
  data: LeaderboardRow[]
  title: string
}

export const ExpensiveLeaderboard = memo(function ExpensiveLeaderboard({
  data,
  title,
}: ExpensiveLeaderboardProps) {
  const t0 = performance.now()

  const rows = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.score - a.score)
    const withTier = sorted.map((r, idx) => ({
      ...r,
      displayRank: idx + 1,
      tier:
        idx < Math.ceil(sorted.length * 0.1)
          ? 'S'
          : idx < Math.ceil(sorted.length * 0.3)
          ? 'A'
          : idx < Math.ceil(sorted.length * 0.6)
          ? 'B'
          : 'C',
      scoreFormatted: r.score.toLocaleString('zh-CN'),
      growthPct: `${r.growth >= 0 ? '+' : ''}${r.growth.toFixed(2)}%`,
    }))
    const filtered = withTier.filter((r) => r.score > 1000)
    void filtered.reduce((acc, r) => acc + r.score, 0)
    return withTier.slice(0, 60)
  }, [data])

  const renderTag = useRenderLabel('排行榜组件')
  const cost = performance.now() - t0

  return (
    <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h5 style={{ margin: 0, color: '#94a3b8' }}>{title}</h5>
        {renderTag}
      </div>
      <p className="info-text" style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem' }}>
        数据预处理+渲染耗时：<strong>{cost.toFixed(2)} ms</strong> · 共{' '}
        {data.length.toLocaleString()} 条，展示前 {rows.length} 条
      </p>
      <div
        style={{
          height: 200,
          overflow: 'auto',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
        }}
      >
        {rows.map((r) => (
          <div
            key={`${r.displayRank}-${r.name}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 100px 80px 40px',
              gap: '0.5rem',
              padding: '2px 4px',
              borderBottom: '1px dashed #1e293b',
            }}
          >
            <span>#{r.displayRank}</span>
            <span>{r.name}</span>
            <span>{r.scoreFormatted}</span>
            <span style={{ color: r.growth >= 0 ? '#4ade80' : '#f87171' }}>{r.growthPct}</span>
            <span
              style={{
                color:
                  r.tier === 'S'
                    ? '#f472b6'
                    : r.tier === 'A'
                    ? '#fbbf24'
                    : r.tier === 'B'
                    ? '#60a5fa'
                    : '#94a3b8',
                fontWeight: 600,
              }}
            >
              {r.tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
