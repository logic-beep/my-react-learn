import { useState, useRef } from 'react'
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
    </div>
  )
}

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
    </div>
  )
}

export default ComponentCommunicationPage
