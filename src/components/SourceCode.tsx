import { useState } from 'react'

interface SourceCodeProps {
  /** 折叠栏说明文字，如「UseStateDemo（1️⃣ useState 示例）」 */
  label?: string
  /** 展示的源码内容（人工维护的静态快照，改演示代码时需同步） */
  code: string
}

/**
 * 折叠式「查看源码」块（默认收起）：
 * - 点击 summary 展开完整源码
 * - 展开后可一键复制
 *
 * 用法（放在演示组件卡片底部）：
 *   <SourceCode label="MyDemo" code={MY_DEMO_CODE} />
 */
export function SourceCode({ label = '本示例', code }: SourceCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) return
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // 剪贴板不可用（如非安全上下文）时静默忽略
    }
  }

  return (
    <details
      style={{
        marginTop: '1rem',
        border: '1px dashed #8b5cf655',
        borderRadius: '8px',
        padding: '0.6rem 0.9rem',
        backgroundColor: '#8b5cf60a',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          color: '#8b5cf6',
          fontWeight: 600,
          userSelect: 'none',
        }}
      >
        📄 查看源码：{label}
        {copied && (
          <span style={{ color: '#4ade80', marginLeft: '0.5rem' }}>✅ 已复制</span>
        )}
      </summary>
      <div className="code-block" style={{ margin: '0.75rem 0 0 0' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {code}
        </pre>
      </div>
      <button
        className="primary"
        onClick={handleCopy}
        style={{ fontSize: '0.85rem', padding: '0.3em 0.9em' }}
      >
        📋 复制源码
      </button>
    </details>
  )
}
