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
            aria-label={`设置主题色 ${color}`}
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
