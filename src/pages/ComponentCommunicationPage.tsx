import { useState, useRef } from 'react'
import { SourceCode } from '../components/SourceCode'
import { ThemeProvider } from '../context/ThemeContext'
import { ChildDisplay } from '../components/ChildDisplay'
import { ChildInput } from '../components/ChildInput'
import { DeepNestedComponent } from '../components/DeepNestedComponent'
import { useTheme } from '../context/ThemeContext'
import VideoPlayer, { VideoPlayerHandle } from '../components/VideoPlayer'

function ComponentCommunicationPage() {
  return (
    <ThemeProvider>
      <div>
        <div className="card">
        <h2>📢 组件间数据交互方式总结</h2>
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          <div
            style={{
              border: '1px solid #333',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#646cff15',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#646cff' }}>① Props 传递</h3>
            <p className="info-text" style={{ margin: 0 }}>
              父 → 子：最基础、最常用的方式
            </p>
          </div>
          <div
            style={{
              border: '1px solid #333',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#22c55e15',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#22c55e' }}>② 回调函数</h3>
            <p className="info-text" style={{ margin: 0 }}>
              子 → 父：子组件调用父传过来的函数
            </p>
          </div>
          <div
            style={{
              border: '1px solid #333',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#f59e0b15',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#f59e0b' }}>③ State 提升</h3>
            <p className="info-text" style={{ margin: 0 }}>
              兄弟组件通信：将共享状态放到共同祖先
            </p>
          </div>
          <div
            style={{
              border: '1px solid #333',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#ec489915',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#ec4899' }}>④ Context</h3>
            <p className="info-text" style={{ margin: 0 }}>
              跨多层：避免 prop drilling（层层传参）
            </p>
          </div>
          <div
            style={{
              border: '1px solid #333',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#8b5cf615',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#8b5cf6' }}>⑤ forwardRef</h3>
            <p className="info-text" style={{ margin: 0 }}>
              父命令子：父组件通过 ref 直接调子组件方法
            </p>
          </div>
        </div>
      </div>

      <ParentChildDemo />

      <ContextDemo />

      <SiblingCommunication />

      <ForwardRefDemo />

      <div className="card">
        <h3>📋 数据流对比图</h3>
        <div className="code-block">
          <pre style={{ margin: 0 }}>
{`┌─────────────────────────────────────────────────────────┐
│              组件数据流向（单向数据流思想）                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Props（父 → 子）                                       │
│     Parent                                                │
│      │  <Child data={x} />                                │
│      ▼                                                    │
│    Child   props.data 只读                                │
│                                                           │
│  2. 回调函数（子 → 父）                                    │
│     Parent                                                │
│      │  const handler = (val) => setX(val)                │
│      │  <Child onAction={handler} />                      │
│      ▼                                                    │
│    Child   调用 props.onAction(newValue)                  │
│      │                                                    │
│      └──────► 返回给父，父 setState 后重新渲染             │
│                                                           │
│  3. Context（跨任意层级）                                  │
│     Provider (store value)                                │
│      ├─ A                                                 │
│      │  └─ B                                              │
│      │     └─ C  useContext() → 直接获取值/方法            │
│      └─ D  useContext() → 直接获取值/方法                 │
│                                                           │
│  4. Redux（全局状态，App 级共享）                          │
│     参见 CounterPage / UserPage 示例                     │
└─────────────────────────────────────────────────────────┘`}
          </pre>
        </div>
      </div>
      </div>
    </ThemeProvider>
  )
}

// -----------------------------------------------------
// ParentChildDemo 源码快照：供「🏠 父组件 (Parent)」卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件/配套子组件的逻辑或 UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const PARENT_CHILD_DEMO_SOURCE = `function ParentChildDemo() {
  const [message, setMessage] = useState('你好，子组件！')
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const appendLog = (msg: string) => {
    setLogs((prev) => [\`[\${new Date().toLocaleTimeString()}] \${msg}\`, ...prev].slice(0, 8))
  }

  const handleMessageSubmit = (value: string) => {
    setMessage(value)
    appendLog(\`📥 父组件收到子组件消息: "\${value}"\`)
  }

  const handleCountChange = (delta: number) => {
    setCount((c) => c + delta)
    appendLog(\`🔢 父组件计数更新: \${count + delta}\`)
  }

  return (
    <div className="card">
      <h3 style={{ color: '#646cff' }}>🏠 父组件 (Parent)</h3>
      <div style={{ padding: '0 0 1rem 0' }}>
        <p>
          <strong>共享状态 message：</strong>
          <span className="tag">{message}</span>
        </p>
        <p>
          <strong>共享状态 count：</strong>
          <span className="tag">{count}</span>
        </p>

        <div
          style={{
            backgroundColor: '#0a0a0a',
            padding: '0.75rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            maxHeight: '140px',
            overflow: 'auto',
            marginBottom: '1rem',
          }}
        >
          <div style={{ color: '#888', marginBottom: '0.25rem' }}>📜 事件日志：</div>
          {logs.length === 0 ? (
            <div style={{ color: '#555' }}>暂无事件...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>

      <div style={{ paddingLeft: '1.5rem', borderLeft: '3px solid #444' }}>
        <h4 style={{ color: '#646cff' }}>⬇️ 子组件区域（接收父组件 props）</h4>
        <ChildDisplay message={message} count={count} />
        <ChildInput onSubmit={handleMessageSubmit} onCountChange={handleCountChange} />
      </div>
    </div>
  )
}

// ─── 配套源码（完整文件）：src/components/ChildDisplay.tsx ───
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
        border: \`2px dashed \${primaryColor}\`,
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

// ─── 配套源码（完整文件）：src/components/ChildInput.tsx ───
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
}`

// =====================================================
// 演示 1: 父 -> 子 (props) + 子 -> 父 (回调)
// =====================================================
function ParentChildDemo() {
  const [message, setMessage] = useState('你好，子组件！')
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const appendLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8))
  }

  const handleMessageSubmit = (value: string) => {
    setMessage(value)
    appendLog(`📥 父组件收到子组件消息: "${value}"`)
  }

  const handleCountChange = (delta: number) => {
    setCount((c) => c + delta)
    appendLog(`🔢 父组件计数更新: ${count + delta}`)
  }

  return (
    <div className="card">
      <h3 style={{ color: '#646cff' }}>🏠 父组件 (Parent)</h3>
      <div style={{ padding: '0 0 1rem 0' }}>
        <p>
          <strong>共享状态 message：</strong>
          <span className="tag">{message}</span>
        </p>
        <p>
          <strong>共享状态 count：</strong>
          <span className="tag">{count}</span>
        </p>

        <div
          style={{
            backgroundColor: '#0a0a0a',
            padding: '0.75rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            maxHeight: '140px',
            overflow: 'auto',
            marginBottom: '1rem',
          }}
        >
          <div style={{ color: '#888', marginBottom: '0.25rem' }}>📜 事件日志：</div>
          {logs.length === 0 ? (
            <div style={{ color: '#555' }}>暂无事件...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>

      <div style={{ paddingLeft: '1.5rem', borderLeft: '3px solid #444' }}>
        <h4 style={{ color: '#646cff' }}>⬇️ 子组件区域（接收父组件 props）</h4>
        <ChildDisplay message={message} count={count} />
        <ChildInput onSubmit={handleMessageSubmit} onCountChange={handleCountChange} />
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// ─── 父组件 ───
function Parent() {
  const [message, setMessage] = useState('')
  return (
    <>
      {/* ① props: 父→子传数据 */}
      <ChildDisplay message={message} />

      {/* ② 回调: 子→父传数据（父传函数，子调用） */}
      <ChildInput onSubmit={(val) => setMessage(val)} />
    </>
  )
}

// ─── 子组件 ChildInput ───
function ChildInput({ onSubmit }) {
  const [v, setV] = useState('')
  return (
    <button onClick={() => onSubmit(v)}>
      发送给父组件
    </button>
  )
}`}
        </pre>
      </div>

      <SourceCode label="ParentChildDemo（① Props 传递 + ② 回调函数）" code={PARENT_CHILD_DEMO_SOURCE} />
    </div>
  )
}

// -----------------------------------------------------
// ContextDemo 源码快照：供「🏛️ Context 跨层级数据共享」卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件/配套文件的逻辑或 UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const CONTEXT_DEMO_SOURCE = `function ContextDemo() {
  useTheme()

  return (
    <div className="card">
      <h3 style={{ color: '#ec4899' }}>🏛️ Context 跨层级数据共享</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        顶层 <code>ThemeProvider</code> 包裹后，任何层级的子组件都可通过{' '}
        <code>useTheme()</code> 直接获取主题数据，无需中间组件层层传递。
      </p>

      <LayerA />
    </div>
  )
}

function LayerA() {
  return (
    <div
      style={{
        border: '1px dashed #666',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <p className="info-text" style={{ margin: '0 0 0.5rem 0' }}>
        📦 第 1 层：LayerA（不关心主题，但需要包裹）
      </p>
      <LayerB />
    </div>
  )
}

function LayerB() {
  return (
    <div
      style={{
        border: '1px dashed #666',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <p className="info-text" style={{ margin: '0 0 0.5rem 0' }}>
        📦 第 2 层：LayerB（也不关心主题，只是中间传递路径）
      </p>
      <LayerC />
    </div>
  )
}

function LayerC() {
  return (
    <div
      style={{
        border: '1px dashed #666',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <p className="info-text" style={{ margin: '0 0 0.5rem 0' }}>
        📦 第 3 层：LayerC → 内部的 DeepNestedComponent 可以直接获取 Context！
      </p>
      <DeepNestedComponent />
    </div>
  )
}

// ─── 配套源码（完整文件）：src/components/DeepNestedComponent.tsx ───
import { useTheme } from '../context/ThemeContext'

export function DeepNestedComponent() {
  const { theme, toggleTheme, primaryColor, setPrimaryColor } = useTheme()

  const colors = ['#646cff', '#22c55e', '#f59e0b', '#ef4444', '#ec4899']

  return (
    <div
      style={{
        padding: '1rem',
        border: '2px solid',
        borderColor: primaryColor,
        borderRadius: '8px',
        backgroundColor: theme === 'dark' ? '#0f172a' : '#e0e7ff',
      }}
    >
      <h4 style={{ marginTop: 0, color: primaryColor }}>
        🏛️ 深层嵌套组件 (使用 Context 跨层级获取数据)
      </h4>
      <p>
        <strong>当前主题：</strong>
        <span className="tag">{theme === 'dark' ? '🌙 暗色' : '☀️ 亮色'}</span>
      </p>
      <button className="primary" onClick={toggleTheme}>
        🔄 切换主题
      </button>
      <div style={{ marginTop: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}><strong>选择主题色：</strong></p>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setPrimaryColor(color)}
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              backgroundColor: color,
              border: primaryColor === color ? '3px solid #fff' : 'none',
              borderRadius: '50%',
            }}
            aria-label={\`设置主题色 \${color}\`}
          />
        ))}
      </div>
      <p className="info-text" style={{ marginTop: '1rem', marginBottom: 0 }}>
        💡 这个组件没有直接接收 props，而是通过 useContext() 从 ThemeProvider 获取数据，
        避免了层层传递 props (prop drilling)
      </p>
    </div>
  )
}

// ─── 配套源码（完整文件）：src/context/ThemeContext.tsx ───
import { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [primaryColor, setPrimaryColor] = useState('#646cff')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用')
  }
  return context
}`

// =====================================================
// 演示 2: Context 跨层级共享
// =====================================================
function ContextDemo() {
  useTheme()

  return (
    <div className="card">
      <h3 style={{ color: '#ec4899' }}>🏛️ Context 跨层级数据共享</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        顶层 <code>ThemeProvider</code> 包裹后，任何层级的子组件都可通过{' '}
        <code>useTheme()</code> 直接获取主题数据，无需中间组件层层传递。
      </p>

      <LayerA />

      <SourceCode label="ContextDemo（④ Context 跨层级共享）" code={CONTEXT_DEMO_SOURCE} />
    </div>
  )
}

function LayerA() {
  return (
    <div
      style={{
        border: '1px dashed #666',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <p className="info-text" style={{ margin: '0 0 0.5rem 0' }}>
        📦 第 1 层：LayerA（不关心主题，但需要包裹）
      </p>
      <LayerB />
    </div>
  )
}

function LayerB() {
  return (
    <div
      style={{
        border: '1px dashed #666',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <p className="info-text" style={{ margin: '0 0 0.5rem 0' }}>
        📦 第 2 层：LayerB（也不关心主题，只是中间传递路径）
      </p>
      <LayerC />
    </div>
  )
}

function LayerC() {
  return (
    <div
      style={{
        border: '1px dashed #666',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <p className="info-text" style={{ margin: '0 0 0.5rem 0' }}>
        📦 第 3 层：LayerC → 内部的 DeepNestedComponent 可以直接获取 Context！
      </p>
      <DeepNestedComponent />
    </div>
  )
}

// -----------------------------------------------------
// SiblingCommunication 源码快照：供「🤝 兄弟组件通信」卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件/兄弟子组件的逻辑或 UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const SIBLING_COMMUNICATION_SOURCE = `function SiblingCommunication() {
  const [sharedText, setSharedText] = useState('兄弟组件初始共享值')

  return (
    <div className="card">
      <h3 style={{ color: '#f59e0b' }}>
        🤝 兄弟组件通信（State Lifting - 状态提升）
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        把两个兄弟组件共享的 state 放到它们的共同父组件中，父通过 props 把值和 setter
        传下去即可。这是最朴素也最常用的兄弟通信模式。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          style={{
            border: '2px solid #22c55e',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ marginTop: 0, color: '#22c55e' }}>🅰️ 兄组件：写</h4>
          <SiblingA sharedText={sharedText} setSharedText={setSharedText} />
        </div>
        <div
          style={{
            border: '2px solid #3b82f6',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ marginTop: 0, color: '#3b82f6' }}>🅱️ 弟组件：读</h4>
          <SiblingB sharedText={sharedText} />
        </div>
      </div>
    </div>
  )
}

interface SiblingAProps {
  sharedText: string
  setSharedText: (v: string) => void
}
function SiblingA({ sharedText, setSharedText }: SiblingAProps) {
  const [localText, setLocalText] = useState(sharedText)
  return (
    <div>
      <input
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        placeholder="输入共享内容"
        style={{ width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem' }}
      />
      <button
        className="primary"
        onClick={() => setSharedText(localText)}
      >
        ✍️ 同步给兄弟组件
      </button>
      <p className="info-text" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
        （本地修改点击按钮才会同步，演示了本地 state + 共享 state 的区别）
      </p>
    </div>
  )
}

interface SiblingBProps {
  sharedText: string
}
function SiblingB({ sharedText }: SiblingBProps) {
  return (
    <div>
      <p style={{ marginTop: 0 }}>
        收到的共享值：
        <span
          className="tag"
          style={{ backgroundColor: '#3b82f633', color: '#93c5fd' }}
        >
          {sharedText}
        </span>
      </p>
      <p className="info-text" style={{ marginBottom: 0 }}>
        这里没有 useState，全靠父组件传下来的 props 显示，跟着兄组件同步变化 ✨
      </p>
    </div>
  )
}`

// =====================================================
// 演示 3: 兄弟组件通信（State 提升到共同父组件）
// =====================================================
function SiblingCommunication() {
  const [sharedText, setSharedText] = useState('兄弟组件初始共享值')

  return (
    <div className="card">
      <h3 style={{ color: '#f59e0b' }}>
        🤝 兄弟组件通信（State Lifting - 状态提升）
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        把两个兄弟组件共享的 state 放到它们的共同父组件中，父通过 props 把值和 setter
        传下去即可。这是最朴素也最常用的兄弟通信模式。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          style={{
            border: '2px solid #22c55e',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ marginTop: 0, color: '#22c55e' }}>🅰️ 兄组件：写</h4>
          <SiblingA sharedText={sharedText} setSharedText={setSharedText} />
        </div>
        <div
          style={{
            border: '2px solid #3b82f6',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ marginTop: 0, color: '#3b82f6' }}>🅱️ 弟组件：读</h4>
          <SiblingB sharedText={sharedText} />
        </div>
      </div>

      <SourceCode label="SiblingCommunication（③ 兄弟通信 · State 提升）" code={SIBLING_COMMUNICATION_SOURCE} />
    </div>
  )
}

interface SiblingAProps {
  sharedText: string
  setSharedText: (v: string) => void
}
function SiblingA({ sharedText, setSharedText }: SiblingAProps) {
  const [localText, setLocalText] = useState(sharedText)
  return (
    <div>
      <input
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        placeholder="输入共享内容"
        style={{ width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem' }}
      />
      <button
        className="primary"
        onClick={() => setSharedText(localText)}
      >
        ✍️ 同步给兄弟组件
      </button>
      <p className="info-text" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
        （本地修改点击按钮才会同步，演示了本地 state + 共享 state 的区别）
      </p>
    </div>
  )
}

interface SiblingBProps {
  sharedText: string
}
function SiblingB({ sharedText }: SiblingBProps) {
  return (
    <div>
      <p style={{ marginTop: 0 }}>
        收到的共享值：
        <span
          className="tag"
          style={{ backgroundColor: '#3b82f633', color: '#93c5fd' }}
        >
          {sharedText}
        </span>
      </p>
      <p className="info-text" style={{ marginBottom: 0 }}>
        这里没有 useState，全靠父组件传下来的 props 显示，跟着兄组件同步变化 ✨
      </p>
    </div>
  )
}

// -----------------------------------------------------
// ForwardRefDemo 源码快照：供「🎮 forwardRef + useImperativeHandle」卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了下方演示组件/配套子组件的逻辑或 UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const FORWARD_REF_DEMO_SOURCE = `function ForwardRefDemo() {
  const videoRef = useRef<VideoPlayerHandle>(null)
  const [readTime, setReadTime] = useState(0)
  const [jumpSec, setJumpSec] = useState(30)

  return (
    <div className="card">
      <h3 style={{ color: '#8b5cf6' }}>
        🎮 forwardRef + useImperativeHandle（父组件命令式调用子组件）
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        父组件通过 <code>ref</code> 直接调用子组件暴露的方法/读取子组件数据。
        用于：组件库（Input.focus / Video.play）、滚动定位、测量 DOM 等场景。
        <strong> 能用 props/回调搞定就不要滥用 ref！</strong>
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '1rem' }}>
        <VideoPlayer ref={videoRef} title="React 从入门到入坑 - 第3集" />

        <div
          style={{
            border: '2px dashed #8b5cf6',
            borderRadius: '12px',
            padding: '1rem',
            alignSelf: 'start',
          }}
        >
          <h4 style={{ marginTop: 0, color: '#8b5cf6' }}>
            🏠 父组件的控制台（调用子组件方法）
          </h4>

          <p className="info-text" style={{ margin: '0 0 0.75rem 0' }}>
            父组件通过 <code>videoRef.current.xxx()</code> 直接命令子组件：
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <button className="primary" onClick={() => videoRef.current?.play()}>
              ▶ 播放
            </button>
            <button onClick={() => videoRef.current?.pause()}>⏸ 暂停</button>
            <button className="danger" onClick={() => videoRef.current?.reset()}>
              ⟳ 重置
            </button>
            <button onClick={() => videoRef.current?.toggleFullscreen()}>
              🔲 全屏
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <input
              type="number"
              value={jumpSec}
              onChange={(e) => setJumpSec(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            <button onClick={() => videoRef.current?.jumpTo(jumpSec)}>
              🎯 跳转到指定秒
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => {
                const t = videoRef.current?.getCurrentTime() ?? -1
                setReadTime(t)
              }}
            >
              📖 读取子组件 currentTime
            </button>
            {readTime >= 0 && (
              <p style={{ marginTop: '0.5rem' }}>
                子组件内部播放进度：
                <span className="tag" style={{ backgroundColor: '#8b5cf633', color: '#c4b5fd' }}>
                  {Math.floor(readTime / 60)}:{(readTime % 60).toString().padStart(2, '0')}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 配套源码（完整文件）：src/components/VideoPlayer.tsx ───
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react'

export interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  reset: () => void
  toggleFullscreen: () => void
  getCurrentTime: () => number
  jumpTo: (seconds: number) => void
}

interface VideoPlayerProps {
  title?: string
  initialTime?: number
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ title = '未命名视频', initialTime = 0 }, ref) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(initialTime)
    const [volume, setVolume] = useState(80)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const duration = 120

    const startTimer = useCallback(() => {
      if (timerRef.current) return
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t + 1 >= duration) {
            clearInterval(timerRef.current!)
            timerRef.current = null
            setIsPlaying(false)
            return duration
          }
          return t + 1
        })
      }, 1000)
    }, [duration])

    const stopTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (currentTime >= duration) setCurrentTime(0)
          setIsPlaying(true)
          startTimer()
        },
        pause: () => {
          setIsPlaying(false)
          stopTimer()
        },
        reset: () => {
          setIsPlaying(false)
          stopTimer()
          setCurrentTime(0)
        },
        toggleFullscreen: () => {
          setIsFullscreen((f) => !f)
        },
        getCurrentTime: () => currentTime,
        jumpTo: (seconds: number) => {
          setCurrentTime(Math.max(0, Math.min(duration, seconds)))
        },
      }),
      [currentTime, startTimer, stopTimer, duration]
    )

    const progress = (currentTime / duration) * 100
    const fmt = (s: number) =>
      \`\${Math.floor(s / 60).toString().padStart(2, '0')}:\${(s % 60).toString().padStart(2, '0')}\`

    return (
      <div
        style={{
          border: isFullscreen ? '3px solid #646cff' : '1px solid #333',
          borderRadius: '12px',
          padding: '1rem',
          background: isFullscreen
            ? 'linear-gradient(135deg, #0f172a, #1e1b4b)'
            : '#1a1a1a',
          transition: 'all 0.3s',
          position: 'relative',
        }}
      >
        <div
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: '#000',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                animation: 'pulse 1s infinite',
              }}
            />
          )}
          <div
            style={{
              fontSize: isFullscreen ? '6rem' : '3rem',
              marginBottom: '0.5rem',
            }}
          >
            {isPlaying ? '▶️' : '⏸️'}
          </div>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{title}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            {fmt(currentTime)} / {fmt(duration)}
          </div>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <div
            style={{
              height: '6px',
              backgroundColor: '#333',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '0.25rem',
            }}
          >
            <div
              style={{
                width: \`\${progress}%\`,
                height: '100%',
                backgroundColor: '#646cff',
                transition: 'width 0.3s linear',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <button
              onClick={() => {
                if (isPlaying) {
                  stopTimer()
                  setIsPlaying(false)
                } else {
                  setIsPlaying(true)
                  startTimer()
                }
              }}
            >
              {isPlaying ? '⏸ 暂停' : '▶ 播放'}
            </button>
            <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
              ⏪ -10s
            </button>
            <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>
              ⏩ +10s
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔊 {volume}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: '80px', padding: 0 }}
            />
          </div>
        </div>

        <p className="info-text" style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
          💡 子组件内部状态：isPlaying / currentTime / volume / isFullscreen
          <br />
          父组件通过 ref 只能调用 useImperativeHandle 暴露出来的方法。
        </p>
      </div>
    )
  }
)

export default VideoPlayer`

// =====================================================
// 演示 5: forwardRef + useImperativeHandle（父调子组件方法）
// =====================================================
function ForwardRefDemo() {
  const videoRef = useRef<VideoPlayerHandle>(null)
  const [readTime, setReadTime] = useState(0)
  const [jumpSec, setJumpSec] = useState(30)

  return (
    <div className="card">
      <h3 style={{ color: '#8b5cf6' }}>
        🎮 forwardRef + useImperativeHandle（父组件命令式调用子组件）
      </h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        父组件通过 <code>ref</code> 直接调用子组件暴露的方法/读取子组件数据。
        用于：组件库（Input.focus / Video.play）、滚动定位、测量 DOM 等场景。
        <strong> 能用 props/回调搞定就不要滥用 ref！</strong>
      </p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '1rem' }}>
        <VideoPlayer ref={videoRef} title="React 从入门到入坑 - 第3集" />

        <div
          style={{
            border: '2px dashed #8b5cf6',
            borderRadius: '12px',
            padding: '1rem',
            alignSelf: 'start',
          }}
        >
          <h4 style={{ marginTop: 0, color: '#8b5cf6' }}>
            🏠 父组件的控制台（调用子组件方法）
          </h4>

          <p className="info-text" style={{ margin: '0 0 0.75rem 0' }}>
            父组件通过 <code>videoRef.current.xxx()</code> 直接命令子组件：
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <button className="primary" onClick={() => videoRef.current?.play()}>
              ▶ 播放
            </button>
            <button onClick={() => videoRef.current?.pause()}>⏸ 暂停</button>
            <button className="danger" onClick={() => videoRef.current?.reset()}>
              ⟳ 重置
            </button>
            <button onClick={() => videoRef.current?.toggleFullscreen()}>
              🔲 全屏
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <input
              type="number"
              value={jumpSec}
              onChange={(e) => setJumpSec(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            <button onClick={() => videoRef.current?.jumpTo(jumpSec)}>
              🎯 跳转到指定秒
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => {
                const t = videoRef.current?.getCurrentTime() ?? -1
                setReadTime(t)
              }}
            >
              📖 读取子组件 currentTime
            </button>
            {readTime >= 0 && (
              <p style={{ marginTop: '0.5rem' }}>
                子组件内部播放进度：
                <span className="tag" style={{ backgroundColor: '#8b5cf633', color: '#c4b5fd' }}>
                  {Math.floor(readTime / 60)}:{(readTime % 60).toString().padStart(2, '0')}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <pre style={{ margin: 0 }}>
{`// ─── 子组件：暴露 Handle 类型 + forwardRef + useImperativeHandle ───
export interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  getCurrentTime: () => number
  jumpTo: (s: number) => void
}

const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(
  function VideoPlayer(props, ref) {
    const [currentTime, setCurrentTime] = useState(0)

    useImperativeHandle(ref, () => ({
      play: () => { /* 内部状态随便改 */ },
      pause: () => {},
      getCurrentTime: () => currentTime,
      jumpTo: (s) => setCurrentTime(s),
    }), [currentTime])   // ← 依赖数组：和 useEffect 规则一致

    return <div>播放器UI...</div>
  }
)

// ─── 父组件：useRef 拿句柄 ───
const videoRef = useRef<VideoPlayerHandle>(null)

<VideoPlayer ref={videoRef} />
videoRef.current?.play()        // → 调子组件 play
videoRef.current?.getCurrentTime()  // → 读子组件数据`}
        </pre>
      </div>

      <SourceCode label="ForwardRefDemo（⑤ forwardRef + useImperativeHandle）" code={FORWARD_REF_DEMO_SOURCE} />
    </div>
  )
}

export default ComponentCommunicationPage
