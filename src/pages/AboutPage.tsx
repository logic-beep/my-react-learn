import { Link } from 'react-router-dom'

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
