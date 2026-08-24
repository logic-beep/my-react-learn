import { memo } from 'react'
import { useTheme } from '../context/ThemeContext'

interface ChildDisplayProps {
  message: string
  count: number
}

function ChildDisplayInner({ message, count }: ChildDisplayProps) {
  const { theme, primaryColor } = useTheme()

  console.log('🔄 ChildDisplay 重新渲染 - message:', message, 'count:', count)

  return (
    <div
      style={{
        padding: '1rem',
        border: `2px dashed ${primaryColor}`,
        borderRadius: '8px',
        marginBottom: '1rem',
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f0f0f0',
      }}
    >
      <p style={{ margin: '0 0 0.5rem 0' }}>
        <strong>📨 父组件传来的消息：</strong>
        <span style={{ color: primaryColor }}>{message}</span>
      </p>
      <p style={{ margin: 0 }}>
        <strong>🔢 父组件传来的计数：</strong>
        <span style={{ color: primaryColor, fontSize: '1.2rem', fontWeight: 'bold' }}>
          {count}
        </span>
      </p>
      <p className="info-text" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
        💡 此组件使用了 memo，只有 props 变化时才会重新渲染（看控制台日志）
      </p>
    </div>
  )
}

export const ChildDisplay = memo(ChildDisplayInner)
