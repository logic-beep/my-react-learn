import { useEffect, useState } from 'react'

interface HeavyLazyComponentProps {
  onLoaded?: () => void
}

export default function HeavyLazyComponent({ onLoaded }: HeavyLazyComponentProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 模拟 chunk 网络加载 + 大型库初始化（开发环境也能观察到 Suspense fallback）
    const timer = setTimeout(() => {
      setReady(true)
      onLoaded?.()
    }, 700)
    return () => clearTimeout(timer)
  }, [onLoaded])

  const rows = Array.from({ length: 30 }, (_, i) => i)

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid #14b8a6',
        borderRadius: '8px',
        backgroundColor: '#042f2e',
      }}
    >
      <h4 style={{ marginTop: 0, color: '#14b8a6' }}>
        📦 HeavyLazyComponent 已加载 {' '}
        <span className="tag" style={{ backgroundColor: '#14b8a633', color: '#2dd4bf' }}>
          {ready ? 'chunk ready' : 'warming up...'}
        </span>
      </h4>
      <p className="info-text" style={{ marginTop: 0 }}>
        这个组件是通过 <code>React.lazy(() ={'>'} import(...))</code> 动态引入的，
        生产构建会被拆成独立的 .js chunk，首屏不会加载。
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {rows.map((n) => (
          <div
            key={n}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: `hsl(${(n * 13) % 360}, 50%, 20%)`,
              border: '1px solid #ffffff10',
              textAlign: 'center',
              fontSize: '0.85rem',
            }}
          >
            Lazy Row #{n}
          </div>
        ))}
      </div>
    </div>
  )
}
