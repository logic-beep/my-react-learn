import { NavLink, Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#646cff' }}>
        React 学习工程 🚀
      </h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem' }}>
        Vite + React + TypeScript + Redux + React Router
      </p>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
          end
        >
          🏠 首页
        </NavLink>
        <NavLink
          to="/basic-hooks"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          🧠 基础 Hooks
        </NavLink>
        <NavLink
          to="/hooks"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          🪝 自定义 Hooks
        </NavLink>
        <NavLink
          to="/communication"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          📢 组件交互
        </NavLink>
        <NavLink
          to="/performance"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          ⚡ 性能优化
        </NavLink>
        <NavLink
          to="/fiber"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          🧬 React 内核
        </NavLink>
        <NavLink
          to="/counter"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          🔢 Redux 计数器
        </NavLink>
        <NavLink
          to="/user"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          👤 用户管理
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          📖 关于
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
