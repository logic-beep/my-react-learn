# agents.md — React 学习工程 · AI 辅助开发指南

> 本文档面向在此仓库中协助开发的 AI 助手 / 协作者。先通读本文件，再动手改代码，
> 可避免破坏本项目的"教学型演示"结构与既有的工程约定。

## 1. 项目定位（先理解再改）

这是一个 **React 生态教学演示工程**（非真实业务应用）：每个页面围绕一个 React 知识点，
用「**说明文字 + 可交互演示 + 关键代码讲解(code-block)**」三段式结构呈现，并大量使用
`console.log`、渲染次数徽标等**可视化手段展示渲染行为**。**UI 文案与代码注释均为中文**，
标题常用 emoji（🧠 📢 ⚡ 🪝 🔢 等）。

**改造时的第一原则**：保留教学价值。演示组件里的日志、性能对照（Before vs After）、
"故意"低效的对照写法（如不用 memo/useMemo 的一侧）都是教学内容本身，
**不要当作缺陷"优化"掉**，除非任务明确要求。

## 2. 技术栈与版本

| 领域 | 选型 |
|---|---|
| 构建 | Vite 5.4 + `@vitejs/plugin-react` |
| 框架 | React 18.3 + react-dom 18.3（函数组件 + Hooks，无 class 组件） |
| 语言 | TypeScript 5.5，**strict 模式**，`noUnusedLocals` / `noUnusedParameters` 均开启 |
| 路由 | react-router-dom **6.26**（`createBrowserRouter` 数据路由） |
| 状态 | Redux Toolkit 2.2 + react-redux 9（`configureStore` + `createSlice`，Immer 集成） |
| 样式 | **内联 style + 少量全局 CSS 类**（`src/index.css`），无 CSS Modules / Tailwind / UI 库 |
| CI/CD | GitHub Actions → GitHub Pages（`.github/workflows/deploy-pages.yml`），Node 22 |

## 3. 常用命令

```bash
npm install          # 首次运行前必须先装依赖（依赖已装好；如因 --ignore-scripts 缺 postinstall 产物，可重跑）
npm run dev          # 本地开发，默认 http://localhost:5173
npm run build        # = npx tsc -b（类型检查）+ vite build；改完代码用它自检
npx tsc -b           # 仅类型检查（快速自检）
npm run preview      # 预览构建产物
```

⚠️ 已知问题：
- `package.json` 里的 `lint` 脚本引用 `eslint .`，但 **eslint 未安装、无配置文件**，`npm run lint` 目前不可用，**不要依赖它**，也不要顺手"修好"它（超出任务范围时先问）。
- **类型检查即质量门禁**：`noUnusedLocals`/`noUnusedParameters` 开启 → 未使用的 import / 变量 / 参数都会让 `tsc -b` 失败。每次改动后用 `npm run build` 或 `npx tsc -b` 自检。
- 没有单元测试 / E2E 测试，质量检查 = 类型检查 + 人工浏览器验证。

## 4. 目录结构与职责

```
src/
├── main.tsx                  # 入口：StrictMode > <Provider store> > <RouterProvider>
├── App.tsx                   # 壳组件：顶部 NavLink 导航 + <Outlet />；新增页面要同步加导航
├── index.css                 # 全局样式（见 §6 样式约定）
├── router/index.tsx          # 唯一路由表；basename 取 import.meta.env.BASE_URL（支撑 GH Pages 子路径部署）
├── pages/                    # 每个路由一个页面，XxxPage.tsx，default export
│   ├── HomePage / BasicHooksPage / HooksPage
│   ├── ComponentCommunicationPage / PerformancePage
│   ├── CounterPage / UserPage / AboutPage / NotFoundPage
├── components/               # 可复用/教学组件（多为 named export）
│   ├── ChildDisplay.tsx      #   memo 子组件（props 浅比较演示）
│   ├── ChildInput.tsx        #   子→父 回调演示
│   ├── DeepNestedComponent.tsx   # useContext 深层取数演示
│   ├── HeavyLazyComponent.tsx    #   default export，仅供 React.lazy 动态引入
│   ├── PerfDemos.tsx         #   性能演示组件集（见 §8）
│   └── VideoPlayer.tsx       #   forwardRef + useImperativeHandle 演示
├── context/ThemeContext.tsx  # ThemeProvider + useTheme（注意作用域，见 §5）
├── hooks/                    # 自定义 Hooks 库（见 §7）
├── store/                    # Redux Toolkit（见 §5）
│   ├── index.ts              #   configureStore + RootState / AppDispatch 类型
│   ├── hooks.ts              #   useAppDispatch / useAppSelector（typed hooks）
│   └── features/{counter,user}/*.ts
```

- `.codegraph/`：本地工具生成的代码图谱缓存目录（内含 `codegraph.db`），已被其自身
  `.gitignore` 排除，**不是项目源码，不要读取/修改/提交**。
- `public/`：静态资源（仅 `vite.svg`）。

## 5. 关键架构约定（改动前必读）

### 5.1 入口层级（main.tsx）
`React.StrictMode` → `Redux Provider` → `RouterProvider`。**开发模式下 StrictMode 会让
组件渲染两次、effect 挂载/卸载各两次**——演示中的 `console.log` 渲染标记在 dev 下
"翻倍"是正常现象，是教学的一部分，不要试图"修"。

### 5.2 Redux（store/）
- 状态根形状：`RootState = { counter: { value: number }, user: { name; age; isLoggedIn } }`，
  类型在 `store/index.ts` 自动推导，改动 slice 后无需手改。
- **组件一律用 `store/hooks.ts` 导出的 typed hooks**：
  `useAppSelector((state) => ...)` / `useAppDispatch()`，**禁止裸用**
  `useSelector` / `useDispatch`（否则类型丢失，违反仓库风格）。
- 新增全局状态：在 `src/store/features/<name>/<name>Slice.ts` 建 slice，
  并在 `store/index.ts` 的 `reducer` 里注册。reducer 内可直接"修改"state（Immer）。

### 5.3 Context（context/ThemeContext.tsx）
- `ThemeProvider` **不是全局 Provider**，只在 `ComponentCommunicationPage` 页面内部包裹
  其子树；`useTheme()` 在 Provider 外调用会抛错（by design）。
- Context 内容：`{ theme: 'light'|'dark'; toggleTheme; primaryColor: string; setPrimaryColor }`。

### 5.4 路由（router/index.tsx）
- 所有页面**静态 import**；唯一的懒加载教学点是 `PerformancePage` 里的
  `HeavyLazyComponent`（`React.lazy`），不要"顺手"把整页改 lazy。
- **新增页面的三步流程**：
  1. `src/pages/XxxPage.tsx`（default export）；
  2. `src/router/index.tsx` 注册路由（注意 `path: '*'` 兜底 404 已存在）；
  3. `src/App.tsx` 加一个 `<NavLink>`。
- **basename 会自动取 `import.meta.env.BASE_URL`**：本地 dev 为 `/`，部署到 GitHub Pages
  子路径时自动带上仓库名前缀，因此路由/链接写成根路径绝对形式（`/basic-hooks`）即可，
  **不要手写 /repo-name 前缀**。

### 5.5 TypeScript 书写纪律
- 类型全量标注；避免 `any`；仅类型导入用 `import type { ... }`。
- 引入新依赖前先确认是否必要（当前仅 react / react-dom / RTK / react-redux / react-router-dom）。
- 无路径别名，import 一律用相对路径。
- `PerformancePage.tsx` 末尾有 `void useEffect`（占位防止未使用导入报错），保持现状。

## 6. 样式约定（components 级）

写演示 UI 的**首选方式是与现有风格一致的内联 style**；需要跨页面复用时用全局类：
`.card` `.grid` `.tag` `.info-text` `.code-block` `.count-display`，
按钮可用 `.primary`（紫）`.danger`（红）修饰。深色背景 + 主题色 `#646cff` 是主视觉。
在 `index.css` 追加全局样式可以，但优先复用已有类。

## 7. 自定义 Hooks API（src/hooks/，改动请保持签名兼容）

| Hook | 签名 | 说明 |
|---|---|---|
| `useCounter` | `useCounter({initialValue?, step?, min?, max?}) → {count, increment, decrement, reset, setCount}` | 带上下限钳制的计数器 |
| `useLocalStorage` | `useLocalStorage<T>(key, initialValue) → readonly [value, setValue, removeValue]` | 同步 localStorage + 跨标签页 storage 事件 |
| `useDebounce` | `useDebounce<T>(value, delay=500) → T` | 防抖值 |
| `useToggle` | `useToggle(initial=false) → {value, toggle, setTrue, setFalse}` | 布尔开关 |
| `useFetch` | `useFetch<T>(url \| null, options?) → {data, loading, error, refetch}` | 带取消/错误处理；`HooksPage` 用它请求 jsonplaceholder（需联网，离线会显示错误态，属正常演示） |

## 8. 组件导出速查（新增演示代码前先查是否已有可复用件）

- `src/components/PerfDemos.tsx`（性能演示合集，按教学分区注释组织，新增演示可加在此文件或仿其风格）：
  `useRenderLabel(name)`（渲染次数徽标 Hook）、`CounterBadgeNoMemo`、`CounterBadgeMemo`、
  `CallbackButtonMemo`、`TodoList`、`SimpleVirtualList`、`ExpensiveChart`、
  `ExpensiveLeaderboard`、`buildLeaderboardDataSet(seed, size)`。
- `VideoPlayer.tsx` 导出 `VideoPlayerHandle` 类型 + default `VideoPlayer`。
- `SourceCode.tsx`（通用「查看源码」折叠块，见 §11）：导出 `SourceCode({ label?, code })`。
- `BasicHooksPage.tsx` / `PerformancePage.tsx` 内部采用「一文件内多演示小节」的写法
  （`// ===` 分隔注释），教学演示可沿用同款组织方式。

## 9. 部署与 GitHub Actions（一般不用动）

`push` 到 main/master 触发：`npm ci` → `npx tsc -b` → `npm run build`（构建时注入
`GITHUB_REPOSITORY` 使 `vite.config.ts` 自动计算 base 子路径）→ 复制 `index.html` 为
`404.html`（SPA 路由兜底）→ 发布 GitHub Pages。若改动影响构建输出路径或路由，
记得该部署依赖 `import.meta.env.BASE_URL` 传递 base。

## 10. 给 AI 的标准工作流

1. 先读 `agents.md` 与相关源文件全文（文件内注释本身就是教学文档，信息量很大）。
2. 小型改动：用 `edit` 精准修改；新增演示：写新小节/新文件，保持三段式风格与中文注释。
3. 改完跑 `npx tsc -b`（必要时 `npm run build`）确保类型与产物通过。
4. 需要浏览器验证时用 `npm run dev`，注意 StrictMode 双执行特性。
5. 涉及教学内容的取舍拿不准时，先说明影响再动手，不要静默删除演示型代码。

## 11. 页面示例的「查看源码」折叠块（试点约定）

需求背景：学习者希望看到每个示例「对应的 demo 代码」，而不只是运行效果。

- 通用组件：`src/components/SourceCode.tsx`，导出 `SourceCode({ label?, code })`——
  默认折叠的 📄 查看源码块，展开后可一键复制。直接放进演示组件的卡片底部即可。
- **快照是人工维护的静态字符串**（当前方案，非 `?raw`/`toString`）：
  在演示组件上方的模块级常量（如 `USESTATE_DEMO_SOURCE`）中存放该组件源码副本，
  页面里用 `<SourceCode label="XxxDemo" code={XXX_SOURCE} />` 引用。
- **同步义务**：修改任一演示组件的逻辑/UI 时，必须同步更新其源码快照常量，
  否则「查看源码」与实际行为不一致。快照顶部已放 ⚠️ 提醒注释。
- 快照书写规则：以普通 template literal 存放；快照内若出现反引号或 `${`，
  需转义为 `` \` `` 与 `\${`；为简洁可省略卡片内的「要点讲解 code-block」与
  SourceCode 自身，其余逻辑与 JSX 建议保持与真实代码一致。
- **试点状态**：`BasicHooksPage.tsx` 已完成 5 个示例（useState/useEffect/useCallback/
  useMemo/useRef）。若后续推广到 `HooksPage` / `ComponentCommunicationPage` /
  `PerformancePage` / `CounterPage` / `UserPage` 等，复制同一模式并在 §8 说明即可。

