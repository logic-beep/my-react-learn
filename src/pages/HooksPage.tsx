import { useState } from 'react'
import { useCounter } from '../hooks/useCounter'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useDebounce } from '../hooks/useDebounce'
import { useToggle } from '../hooks/useToggle'
import { useFetch } from '../hooks/useFetch'

interface Todo {
  id: number
  title: string
  completed: boolean
}

function HooksPage() {
  const counter = useCounter({ initialValue: 0, min: -10, max: 10 })
  const [storedName, setStoredName, removeStoredName] = useLocalStorage<string>(
    'demo-name',
    ''
  )
  const [nameInput, setNameInput] = useState('')
  const debouncedName = useDebounce(nameInput, 500)
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')
  const modal = useToggle(false)
  const {
    data: todos,
    loading,
    error,
    refetch,
  } = useFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')

  return (
    <div>
      <div className="card">
        <h3>1️⃣ useCounter - 自定义计数器 Hook</h3>
        <p className="info-text">
          支持 step、min、max 配置，封装加减重置逻辑
        </p>
        <div className="count-display" style={{ fontSize: '2rem' }}>
          {counter.count}
        </div>
        <button onClick={counter.decrement}>- 1</button>
        <button className="primary" onClick={counter.increment}>
          + 1
        </button>
        <button onClick={counter.reset}>重置</button>
        <button onClick={() => counter.setCount(5)}>设为 5</button>
      </div>

      <div className="card">
        <h3>2️⃣ useLocalStorage - 本地存储持久化</h3>
        <p className="info-text">
          自动将状态同步到 localStorage，刷新页面不会丢失
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <strong>存储的名字：</strong>
          <span className="tag">{storedName || '(空)'}</span>
          <button onClick={removeStoredName} className="danger">
            删除存储
          </button>
        </div>

        <input
          type="text"
          placeholder="输入名字后点击保存"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <button
          className="primary"
          onClick={() => setStoredName(nameInput)}
          disabled={!nameInput}
        >
          保存到 localStorage
        </button>

        <div style={{ marginTop: '1rem' }}>
          <strong>主题设置（localStorage 持久化）：</strong>
          <span className="tag">{theme}</span>
          <button onClick={() => setTheme('light')}>设置浅色</button>
          <button onClick={() => setTheme('dark')}>设置深色</button>
        </div>
      </div>

      <div className="card">
        <h3>3️⃣ useDebounce - 防抖 Hook</h3>
        <p className="info-text">
          常用于搜索框输入，延迟 500ms 后才更新 debouncedValue
        </p>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <strong>实时输入值：</strong>
            <span className="tag">{nameInput || '(空)'}</span>
          </div>
          <div>
            <strong>防抖后的值（500ms）：</strong>
            <span className="tag">{debouncedName || '(空)'}</span>
          </div>
        </div>
        <p className="info-text" style={{ marginTop: '1rem' }}>
          💡 试着快速输入文字，观察两个值的变化差异
        </p>
      </div>

      <div className="card">
        <h3>4️⃣ useToggle - 开关 Hook</h3>
        <p className="info-text">封装布尔值的切换逻辑</p>
        <div>
          <strong>模态框状态：</strong>
          <span className="tag">{modal.value ? '打开' : '关闭'}</span>
        </div>
        <button className="primary" onClick={modal.toggle}>
          切换
        </button>
        <button onClick={modal.setTrue}>打开</button>
        <button onClick={modal.setFalse}>关闭</button>

        {modal.value && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#646cff22',
              borderRadius: '8px',
              border: '1px solid #646cff',
            }}
          >
            这是模拟的模态框内容！点击关闭按钮可以隐藏
          </div>
        )}
      </div>

      <div className="card">
        <h3>5️⃣ useFetch - 网络请求 Hook</h3>
        <p className="info-text">封装 loading、error、data 状态和 refetch</p>
        <button className="primary" onClick={refetch}>
          🔄 重新请求
        </button>

        {loading && <p style={{ color: '#646cff' }}>加载中...</p>}
        {error && <p style={{ color: '#f87171' }}>错误: {error}</p>}
        {todos && (
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: todo.completed ? '#4ade80' : '#fbbf24' }}>
                  {todo.completed ? '✅' : '⬜'}
                </span>{' '}
                {todo.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HooksPage
