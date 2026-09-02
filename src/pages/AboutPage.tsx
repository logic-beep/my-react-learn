import { Link } from 'react-router-dom'
import { SourceCode } from '../components/SourceCode'

// -----------------------------------------------------
// React Router 知识点对应源码快照（路由表 / 导航壳 / 404 页）：
// 对应真实文件：src/router/index.tsx、src/App.tsx、src/pages/NotFoundPage.tsx，
// 供下方「🛣️ React Router 核心用法」卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了上述任一真实源码文件，请同步更新这里的字符串内容。
// -----------------------------------------------------
const ABOUT_ROUTER_SOURCE = `// ─── 完整源码：src/router/index.tsx ───
// ===== src/router/index.tsx =====
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import CounterPage from '../pages/CounterPage'
import HooksPage from '../pages/HooksPage'
import UserPage from '../pages/UserPage'
import NotFoundPage from '../pages/NotFoundPage'
import AboutPage from '../pages/AboutPage'
import BasicHooksPage from '../pages/BasicHooksPage'
import ComponentCommunicationPage from '../pages/ComponentCommunicationPage'
import PerformancePage from '../pages/PerformancePage'

const basename = import.meta.env.BASE_URL.replace(/\\/$/, '')

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'basic-hooks',
        element: <BasicHooksPage />,
      },
      {
        path: 'hooks',
        element: <HooksPage />,
      },
      {
        path: 'communication',
        element: <ComponentCommunicationPage />,
      },
      {
        path: 'performance',
        element: <PerformancePage />,
      },
      {
        path: 'counter',
        element: <CounterPage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
], {
  basename,
})
// ─── 完整源码：src/App.tsx ───
// ===== src/App.tsx =====
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
// ─── 完整源码：src/pages/NotFoundPage.tsx ───
// ===== src/pages/NotFoundPage.tsx =====
import { Link, useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{ fontSize: '8rem', margin: 0, color: '#646cff' }}>404</div>
      <h2>页面未找到</h2>
      <p className="info-text" style={{ marginBottom: '2rem' }}>
        抱歉，您访问的页面不存在
      </p>
      <Link to="/">
        <button className="primary">🏠 返回首页</button>
      </Link>
      <button onClick={() => navigate(-1)}>⬅️ 返回上一页</button>
    </div>
  )
}

export default NotFoundPage
`

function AboutPage() {
  return (
    <div>
      <div className="card">
        <h2>📖 关于本项目</h2>
        <p>
          这是一个用于学习 React 生态核心技术栈的示例工程。通过阅读代码和
          实际运行，可以快速掌握以下内容：
        </p>
      </div>

      <div className="card">
        <h3>🛣️ React Router 核心用法</h3>
        <ul>
          <li>
            <strong>createBrowserRouter</strong>：创建路由配置对象
          </li>
          <li>
            <strong>RouterProvider</strong>：将路由注入应用
          </li>
          <li>
            <strong>Outlet</strong>：嵌套路由的子路由渲染位置
          </li>
          <li>
            <strong>NavLink</strong>：带激活状态的导航链接
          </li>
          <li>
            <strong>useNavigate</strong>：编程式导航（如返回上一页）
          </li>
          <li>
            <strong>path: '*'</strong>：404 通配符路由
          </li>
          <li>
            <strong>index: true</strong>：子路由的默认首页
          </li>
        </ul>
        <p>
          <Link to="/not-exist-page">
            <button>🔗 试试访问不存在的页面 →</button>
          </Link>
        </p>
        <SourceCode
          label="React Router 知识点对应代码（router/index.tsx + App.tsx + NotFoundPage.tsx）"
          code={ABOUT_ROUTER_SOURCE}
        />
      </div>

      <div className="card">
        <h3>🗂️ 数据流总结</h3>
        <div className="code-block">
          <pre style={{ margin: 0 }}>
{`┌─────────────────────────────────────────────┐
│                 Redux 数据流                  │
├─────────────────────────────────────────────┤
│  用户交互 (UI)                                │
│       │                                       │
│       ▼                                       │
│  dispatch(action) ──► reducer 处理 ──► store │
│       │                                       │
│       └──────────► UI 重新渲染 ◄────────────┘ │
│                   (useSelector)               │
├─────────────────────────────────────────────┤
│                 Hooks 使用模式                │
├─────────────────────────────────────────────┤
│  自定义 Hook = useState + useEffect + 逻辑    │
│  返回: [状态值, 操作函数]                     │
│  组件中调用 Hook 即可复用状态逻辑              │
└─────────────────────────────────────────────┘`}
          </pre>
        </div>
      </div>

      <div className="card">
        <h3>📚 进一步学习资源</h3>
        <ul>
          <li>
            <a
              href="https://zh-hans.react.dev/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#646cff' }}
            >
              React 官方文档（中文）
            </a>
          </li>
          <li>
            <a
              href="https://redux-toolkit.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#646cff' }}
            >
              Redux Toolkit 官方文档
            </a>
          </li>
          <li>
            <a
              href="https://reactrouter.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#646cff' }}
            >
              React Router 官方文档
            </a>
          </li>
          <li>
            <a
              href="https://cn.vitejs.dev/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#646cff' }}
            >
              Vite 官方文档（中文）
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AboutPage
