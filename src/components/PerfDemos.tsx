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
      const t0 = performance.now()
      // 模拟昂贵计算：生成 3000 个 DOM 点
      const dots = useMemo(() => {
        const arr: { x: number; y: number; c: string }[] = []
        for (let i = 0; i < 1500; i++) {
          arr.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            c: `hsl(${Math.floor(Math.random() * 360)},70%,60%)`,
          })
        }
        return arr
      }, [])
      const calcMs = performance.now() - t0
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
