import { useState, useEffect, useRef } from 'react'
import { hljs } from '../utils/highlight'

interface SourceCodeProps {
  label?: string
  code: string
  language?: string
}

export function SourceCode({ label = '本示例', code, language = 'tsx' }: SourceCodeProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (open && codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [open, code, language])

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) return
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
    }
  }

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
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
      {open && (
        <>
          <div className="code-block" style={{ margin: '0.75rem 0 0 0' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <code ref={codeRef} className={`language-${language}`}>
                {code}
              </code>
            </pre>
          </div>
          <button
            className="primary"
            onClick={handleCopy}
            style={{ fontSize: '0.85rem', padding: '0.3em 0.9em' }}
          >
            📋 复制源码
          </button>
        </>
      )}
    </details>
  )
}
