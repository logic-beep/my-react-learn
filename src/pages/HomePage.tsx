import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { CodeBlock } from '../components/CodeBlock'

function HomePage() {
  const counterValue = useAppSelector((state) => state.counter.value)
  const user = useAppSelector((state) => state.user)

  return (
    <div>
      <div className="card">
        <h2>欢迎来到 React 学习工程！👋</h2>
        <p>
          本项目包含以下核心技术栈的示例，帮助你快速上手 React 生态：
        </p>
        <div style={{ margin: '1rem 0' }}>
          <span className="tag">Vite 5</span>
          <span className="tag">React 18</span>
          <span className="tag">TypeScript</span>
          <span className="tag">Redux Toolkit</span>
          <span className="tag">React Router 6</span>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>🧠 基础 Hooks 讲解</h3>
          <p>useState / useEffect / useCallback / useMemo / useRef</p>
          <p className="info-text">带交互式示例和性能对比实验</p>
          <Link to="/basic-hooks">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>📢 组件间数据交互</h3>
          <p>Props 传递 / 回调函数 / 状态提升 / Context API / forwardRef</p>
          <p className="info-text">父子、兄弟、跨层级组件通信全覆盖</p>
          <Link to="/communication">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>⚡ React 性能优化</h3>
          <p>memo / useCallback / useMemo / key / 虚拟列表 / lazy / startTransition</p>
          <p className="info-text">7 大优化手段，Before vs After 对比实验</p>
          <Link to="/performance">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>🧬 React 内核原理</h3>
          <p>虚拟 DOM / Diff 算法 / Fiber 架构 / setState 全流程</p>
          <p className="info-text">从状态变更到像素落地，可视化讲透 React 内部</p>
          <Link to="/fiber">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>🪝 自定义 Hooks</h3>
          <p>
            useCounter、useLocalStorage、useDebounce、useFetch、useToggle
          </p>
          <p className="info-text">学习封装可复用的逻辑</p>
          <Link to="/hooks">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>🔢 Redux 状态管理</h3>
          <p>学习使用 Redux Toolkit 进行全局状态管理</p>
          <p className="info-text">当前计数值: {counterValue}</p>
          <Link to="/counter">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>👤 用户管理</h3>
          <p>综合使用 Redux + Hooks 实现用户登录状态管理</p>
          <p className="info-text">
            当前状态: {user.isLoggedIn ? `已登录 - ${user.name}` : '未登录'}
          </p>
          <Link to="/user">
            <button className="primary">进入示例 →</button>
          </Link>
        </div>

        <div className="card">
          <h3>🛣️ React Router</h3>
          <p>学习声明式路由、嵌套路由、404 页面等</p>
          <p className="info-text">顶部导航栏就是路由的体现</p>
          <Link to="/about">
            <button className="primary">了解更多 →</button>
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>📁 项目结构</h3>
        <CodeBlock code={`src/
├── components/         # 可复用组件
│   ├── ChildDisplay.tsx
│   ├── ChildInput.tsx
│   ├── DeepNestedComponent.tsx
│   ├── HeavyLazyComponent.tsx
│   ├── PerfDemos.tsx
│   └── VideoPlayer.tsx
├── context/            # Context 定义
│   └── ThemeContext.tsx
├── hooks/              # 自定义 Hooks
│   ├── useCounter.ts
│   ├── useDebounce.ts
│   ├── useFetch.ts
│   ├── useLocalStorage.ts
│   └── useToggle.ts
├── pages/              # 页面组件
│   ├── HomePage.tsx
│   ├── BasicHooksPage.tsx
│   ├── ComponentCommunicationPage.tsx
│   ├── PerformancePage.tsx
│   ├── CounterPage.tsx
│   ├── HooksPage.tsx
│   ├── UserPage.tsx
│   ├── AboutPage.tsx
│   └── NotFoundPage.tsx
├── router/             # 路由配置
│   └── index.tsx
├── store/              # Redux 状态管理
│   ├── index.ts
│   ├── hooks.ts
│   └── features/
│       ├── counter/counterSlice.ts
│       └── user/userSlice.ts
├── App.tsx
├── main.tsx
└── index.css`} language="bash" />
      </div>
    </div>
  )
}

export default HomePage
