import { useEffect, useRef } from 'react'
import { hljs } from '../utils/highlight'

interface CodeBlockProps {
  code: string
  language?: string
  style?: React.CSSProperties
}

export function CodeBlock({ code, language = 'typescript', style }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  return (
    <div className="code-block" style={style}>
      <pre style={{ margin: 0 }}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
