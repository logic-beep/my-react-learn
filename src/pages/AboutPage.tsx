import { Link } from 'react-router-dom'
import { SourceCode } from '../components/SourceCode'

// -----------------------------------------------------
// React Router 知识点对应源码快照（精简骨架版）：路由表 / 导航壳 / 404 页，
// 对应真实文件：src/router/index.tsx、src/App.tsx、src/pages/NotFoundPage.tsx。
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/壳层/长注释）；若路由表或导航结构变化，请同步更新。
// -----------------------------------------------------
const ABOUT_ROUTER_SOURCE = `// 📄 React Router 知识点对应的真实代码节选（便于对照学习，样式/壳层已省略）
// ─── 关键节选（完整实现见 src/router/index.tsx）───
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
// …其余 10 个页面组件均为静态 import（element 引用的组件名与真实文件一致）…
const basename = import.meta.env.BASE_URL.replace(/\\/$/, '') // 去掉末尾 '/'，兼容 GH Pages 子路径部署
export const router = createBrowserRouter([
  {
    path: '/', // 根路由：App 为导航壳组件，各页面挂在 children 下
    element: <App />,
    children: [
      { index: true, element: <HomePage /> }, // index: true → 子路由的默认首页
      { path: 'basic-hooks', element: <BasicHooksPage /> },
      { path: 'hooks', element: <HooksPage /> },
      { path: 'communication', element: <ComponentCommunicationPage /> },
      { path: 'performance', element: <PerformancePage /> },
      { path: 'fiber', element: <ReactFiberPage /> },
      { path: 'counter', element: <CounterPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> }, // 通配符路由 → 404 页兜底
    ],
  },
], { basename })

// ─── 关键节选（完整实现见 src/App.tsx）───
import { NavLink, Outlet } from 'react-router-dom'
function App() {
  return (
    <div>
      <h1>React 学习工程 🚀</h1>
      <nav>
        <NavLink to="/" end>🏠 首页</NavLink>
        <NavLink to="/basic-hooks">🧠 基础 Hooks</NavLink>
        <NavLink to="/fiber">🧬 React 内核</NavLink>
        {/* …其余导航链接省略，均与路由表 path 一一对应… */}
      </nav>
      <main>
        <Outlet /> {/* 子路由页面渲染位置 */}
      </main>
    </div>
  )
}
export default App

// ─── 关键节选（完整实现见 src/pages/NotFoundPage.tsx）───
import { Link, useNavigate } from 'react-router-dom'
function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <Link to="/">🏠 返回首页</Link>
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
