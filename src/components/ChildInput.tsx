import { useState } from 'react'

interface ChildInputProps {
  onSubmit: (value: string) => void
  onCountChange: (delta: number) => void
}

export function ChildInput({ onSubmit, onCountChange }: ChildInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
      setInputValue('')
    }
  }

  console.log('🔄 ChildInput 重新渲染')

  return (
    <div
      style={{
        padding: '1rem',
        border: '2px dashed #22c55e',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <h4 style={{ marginTop: 0, color: '#22c55e' }}>子组件 (ChildInput) - 向父组件传数据</h4>
      <input
        type="text"
        placeholder="输入消息发送给父组件..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button className="primary" onClick={handleSubmit}>
        ✉️ 发送给父组件
      </button>
      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={() => onCountChange(-1)}>父计数 -1</button>
        <button onClick={() => onCountChange(1)}>父计数 +1</button>
      </div>
    </div>
  )
}
