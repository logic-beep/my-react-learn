import { useState, useMemo, useEffect, useRef } from 'react'
import { useRenderLabel } from '../components/PerfDemos'
import { SourceCode } from '../components/SourceCode'

function ReactFiberPage() {
  return (
    <div>
      <div className="card">
        <h2>🧬 React 内核原理：Fiber · Diff · 虚拟 DOM</h2>
        <p className="info-text" style={{ marginTop: 0 }}>
          从 <code>setState</code> 被调用，到像素出现在屏幕上，React 内部经历了什么？
          本页用 <strong>可视化演示</strong> 把 <span style={{ color: '#fbbf24' }}>虚拟 DOM</span>、
          <span style={{ color: '#a855f7' }}>Diff 算法</span>、
          <span style={{ color: '#06b6d4' }}>Fiber 架构</span> 串起来讲透。
        </p>
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '1rem' }}
        >
          {[
            { t: '① 虚拟 DOM', d: 'JS 对象描述 UI，可 diff 可复用', c: '#fbbf24' },
            { t: '② Diff 算法', d: '同层比较 + key 复用 + 类型判断', c: '#a855f7' },
            { t: '③ Fiber 架构', d: '可中断 + 优先级 + 双缓冲', c: '#06b6d4' },
            { t: '④ 渲染流程', d: 'Schedule → Render → Commit', c: '#22c55e' },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                border: `1px solid ${x.c}44`,
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: `${x.c}11`,
              }}
            >
              <h4 style={{ margin: 0, color: x.c }}>{x.t}</h4>
              <p className="info-text" style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </div>

      <VirtualDOMDemo />
      <DiffAlgorithmDemo />
      <FiberArchitectureDemo />
      <SetStateFlowDemo />
    </div>
  )
}

// =================================================================
// ① 虚拟 DOM 演示
// =================================================================
const VDOM_DEMO_SOURCE = `// React 元素就是一个普通对象（虚拟 DOM 节点）
const element = {
  type: 'div',
  props: {
    className: 'card',
    children: [
      { type: 'h3', props: { children: 'Hello' } },
      { type: 'button', props: { onClick: handleClick, children: '点我' } },
    ],
  },
}

// JSX 语法糖在编译后就是 createElement → 返回上面的对象结构
// <div className="card">
//   <h3>Hello</h3>
//   <button onClick={handleClick}>点我</button>
// </div>`

interface VNode {
  type: string
  props?: Record<string, unknown>
  children?: VNode[]
}

function VirtualDOMDemo() {
  const [showAlternative, setShowAlternative] = useState(false)

  const vdom1: VNode = useMemo(
    () => ({
      type: 'div',
      props: { className: 'card', id: 'app' },
      children: [
        { type: 'h2', props: { style: { color: '#646cff' } }, children: [{ type: 'TEXT', props: { text: 'Hello React' } } as VNode] },
        { type: 'p', children: [{ type: 'TEXT', props: { text: '这是一段描述文字' } } as VNode] },
        {
          type: 'button',
          props: { className: 'primary' },
          children: [{ type: 'TEXT', props: { text: '点击 +1' } } as VNode],
        },
      ],
    }),
    [],
  )

  const vdom2: VNode = useMemo(
    () => ({
      type: 'div',
      props: { className: 'card', id: 'app', 'data-updated': 'true' },
      children: [
        { type: 'h2', props: { style: { color: '#22c55e' } }, children: [{ type: 'TEXT', props: { text: 'Hello Fiber' } } as VNode] },
        { type: 'p', children: [{ type: 'TEXT', props: { text: '这是一段描述文字' } } as VNode] },
        {
          type: 'button',
          props: { className: 'primary' },
          children: [{ type: 'TEXT', props: { text: '点击 +1' } } as VNode],
        },
      ],
    }),
    [],
  )

  const currentVdom = showAlternative ? vdom2 : vdom1

  const renderVNode = (node: VNode, depth = 0): JSX.Element => {
    const isText = node.type === 'TEXT'
    const color = isText ? '#94a3b8' : depth === 0 ? '#fbbf24' : depth === 1 ? '#646cff' : '#22c55e'
    return (
      <div key={depth + '-' + node.type} style={{ marginLeft: depth * 20, fontFamily: 'monospace', fontSize: '0.85rem' }}>
        <span style={{ color }}>
          {isText ? `"${(node.props as { text: string }).text}"` : `<${node.type}>`}
        </span>
        {node.props && !isText && Object.keys(node.props).length > 0 && (
          <span style={{ color: '#f59e0b', marginLeft: 4 }}>
            {Object.entries(node.props)
              .filter(([k]) => k !== 'children')
              .map(([k, v]) => (
                <span key={k} style={{ marginRight: 4 }}>
                  {k}={typeof v === 'object' ? '{...}' : JSON.stringify(v)}
                </span>
              ))}
          </span>
        )}
        {node.children &&
          node.children.map((c, i) => (
            <div key={i}>{renderVNode(c, depth + 1)}</div>
          ))}
      </div>
    )
  }

  return (
    <div className="card">
      <h3 style={{ color: '#fbbf24' }}>① 虚拟 DOM —— UI 的对象化描述</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        虚拟 DOM 不是什么神秘黑科技，它就是一个 <strong>普通的 JS 对象</strong>：
        用 <code>type</code> 描述组件/标签类型，<code>props</code> 描述属性和事件，
        <code>children</code> 嵌套子节点。有了它，React 就能在内存里先「算出」新 UI，
        再和旧 UI 对比找出 <em>最小改动集合</em>，最后只把差异应用到真实 DOM 上。
      </p>

      <div style={{ marginBottom: '0.75rem' }}>
        <button onClick={() => setShowAlternative((v) => !v)}>
          {showAlternative ? '🔁 切回 VDOM 1（初始）' : '🔁 切到 VDOM 2（更新后）'}
        </button>
        <span className="tag" style={{ marginLeft: '0.5rem' }}>
          当前：{showAlternative ? '更新后 VDOM' : '初始 VDOM'}
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          style={{
            border: '1px solid #fbbf2444',
            borderRadius: '8px',
            padding: '0.75rem',
            backgroundColor: '#fbbf2411',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>📦 虚拟 DOM 树结构</h4>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: 6, overflow: 'auto' }}>
            {renderVNode(currentVdom)}
          </div>
        </div>

        <div
          style={{
            border: '1px solid #22c55e44',
            borderRadius: '8px',
            padding: '0.75rem',
            backgroundColor: '#22c55e11',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#22c55e' }}>🖼️ 对应真实渲染结果</h4>
          <div className="card" style={{ margin: 0 }}>
            <h2 style={{ color: showAlternative ? '#22c55e' : '#646cff', margin: 0 }}>
              {showAlternative ? 'Hello Fiber' : 'Hello React'}
            </h2>
            <p>这是一段描述文字</p>
            <button className="primary">点击 +1</button>
            {showAlternative && (
              <p className="info-text" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                ✨ <code>data-updated</code> 属性被加上了（对应 VDOM 中 props 的变化）
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <strong style={{ color: '#fbbf24' }}>💡 关键结论：</strong>
        <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
          <li>JSX 只是语法糖，编译后 = <code>React.createElement()</code> = 返回虚拟 DOM 对象</li>
          <li>有了对象化描述，跨平台就简单了：React DOM / React Native / SSR 只是 <em>宿主不同</em></li>
          <li>Diff 是 <strong>「两棵对象树的比较」</strong>，不是直接操作浏览器 DOM</li>
        </ul>
      </div>

      <SourceCode label="虚拟 DOM 对象结构示意" code={VDOM_DEMO_SOURCE} />
    </div>
  )
}

// =================================================================
// ② Diff 算法演示（key 的作用 + 同层比较 + 类型变更）
// =================================================================
const DIFF_DEMO_SOURCE = `// ====== 场景 1：key 正确 vs 错误 ======
// ❌ 用 index 当 key：每插入头部，后续所有项都被"误判为变更"
{items.map((item, idx) => <li key={idx}>{item.text}</li>)}

// ✅ 用稳定 id 当 key：React 能精准复用没变化的节点
{items.map((item) => <li key={item.id}>{item.text}</li>)}

// ====== 场景 2：类型变了直接卸载重建 ======
// diff 前：<div>Hello</div>
// diff 后：<span>Hello</span>
// → type 不同（div vs span），直接 div 整个卸载，span 重新挂载
// → 里面的文本"看起来没变"，但 DOM 节点和子树状态都丢了！

// ====== Diff 三原则（React 16+）======
// 1️⃣ 只同层比较（Tree Diff）：跨层移动不复用，直接删+建
// 2️⃣ 不同类型不复用（Component Diff）：type 变 → 整棵子树重建
// 3️⃣ 同一层用 key 做兄弟节点复用（Element Diff）：key 相同优先复用`

interface DiffItem {
  id: string
  text: string
  color: string
}

function DiffAlgorithmDemo() {
  const initialItems: DiffItem[] = [
    { id: 'a', text: 'A 任务', color: '#ef4444' },
    { id: 'b', text: 'B 任务', color: '#f59e0b' },
    { id: 'c', text: 'C 任务', color: '#22c55e' },
  ]
  const [items, setItems] = useState<DiffItem[]>(initialItems)
  const [insertCount, setInsertCount] = useState(0)

  const prependNewItem = () => {
    const nextId = String.fromCharCode(100 + insertCount) // d, e, f...
    const colors = ['#646cff', '#a855f7', '#06b6d4', '#ec4899', '#14b8a6']
    setItems((prev) => [
      { id: nextId, text: `${nextId.toUpperCase()} 新任务`, color: colors[insertCount % colors.length] },
      ...prev,
    ])
    setInsertCount((c) => c + 1)
  }

  const resetItems = () => {
    setItems(initialItems)
    setInsertCount(0)
  }

  return (
    <div className="card">
      <h3 style={{ color: '#a855f7' }}>② Diff 算法 —— 两棵树如何高效对比？</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        如果对两棵树做 O(n³) 的完全树对比，1000 个节点就要 10 亿次操作。React 用
        <strong> 三条启发式规则 </strong>把复杂度压到 O(n)：
        <span style={{ color: '#fbbf24' }}> 同层不跨层</span>、
        <span style={{ color: '#22c55e' }}> 类型不同就重建</span>、
        <span style={{ color: '#06b6d4' }}> key 相同优先复用</span>。
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <button className="primary" onClick={prependNewItem}>
          👇 在列表头部插入新项
        </button>
        <button style={{ marginLeft: '0.5rem' }} onClick={resetItems}>
          🔄 重置
        </button>
        <span className="tag" style={{ marginLeft: '0.5rem' }}>
          列表长度：{items.length}
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          style={{
            border: '1px solid #ef444444',
            borderRadius: '8px',
            padding: '0.75rem',
            backgroundColor: '#ef444411',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#ef4444' }}>
            ❌ key = 数组 index（错误示范）
          </h4>
          <p className="info-text" style={{ fontSize: '0.85rem', marginTop: 0 }}>
            每次头部插入，后面节点的 index 都变 → React 认为它们都变了，整列表重绘
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item, idx) => (
              <DiffRow key={idx} item={item} keyStrategy="index" index={idx} />
            ))}
          </ul>
        </div>

        <div
          style={{
            border: '1px solid #22c55e44',
            borderRadius: '8px',
            padding: '0.75rem',
            backgroundColor: '#22c55e11',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#22c55e' }}>
            ✅ key = item.id（正确示范）
          </h4>
          <p className="info-text" style={{ fontSize: '0.85rem', marginTop: 0 }}>
            用稳定 id 当 key → 只有新增节点被创建，老节点全部精准复用
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item, idx) => (
              <DiffRow key={item.id} item={item} keyStrategy="id" index={idx} />
            ))}
          </ul>
        </div>
      </div>

      <TypeChangeDemo />

      <SourceCode label="Diff 三条规则代码示意" code={DIFF_DEMO_SOURCE} />
    </div>
  )
}

function DiffRow({
  item,
  keyStrategy,
  index,
}: {
  item: DiffItem
  keyStrategy: 'index' | 'id'
  index: number
}) {
  const badge = useRenderLabel(
    keyStrategy === 'index' ? `Idx#${index}` : `Id:${item.id}`,
  )
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.6rem',
        borderLeft: `4px solid ${item.color}`,
        background: '#0f172a',
        marginBottom: '0.35rem',
        borderRadius: 4,
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: item.color, fontWeight: 700 }}>●</span>
        <span>{item.text}</span>
      </div>
      {badge}
    </li>
  )
}

function TypeChangeDemo() {
  const [useDiv, setUseDiv] = useState(true)
  return (
    <div
      style={{
        marginTop: '1rem',
        border: '1px dashed #8b5cf655',
        borderRadius: '8px',
        padding: '0.85rem',
        backgroundColor: '#8b5cf60a',
      }}
    >
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6' }}>
        🧪 场景：类型改变（div ↔ span）—— 整棵子树被卸载重建
      </h4>
      <p className="info-text" style={{ fontSize: '0.85rem', marginTop: 0 }}>
        点击按钮切换最外层标签的 <code>type</code>，观察内部计数器的渲染徽标：
        类型一变，哪怕子节点内容完全一样，子组件的 <strong>整个实例都被销毁重建</strong>
        （渲染计数从 1 重新开始）。
      </p>
      <button onClick={() => setUseDiv((v) => !v)} className="primary">
        {useDiv ? '🔁 把外层改成 span' : '🔁 把外层改回 div'}
      </button>
      <span className="tag" style={{ marginLeft: '0.5rem' }}>
        当前外层：{useDiv ? 'div' : 'span'}
      </span>
      <div style={{ marginTop: '0.75rem' }}>
        {useDiv ? (
          <div style={{ border: '1px solid #646cff', padding: '0.75rem', borderRadius: 6 }}>
            <InnerCounterWithLabel label="inside-div" />
          </div>
        ) : (
          <span style={{ display: 'block', border: '1px solid #ec4899', padding: '0.75rem', borderRadius: 6 }}>
            <InnerCounterWithLabel label="inside-span" />
          </span>
        )}
      </div>
    </div>
  )
}

function InnerCounterWithLabel({ label }: { label: string }) {
  const [n, setN] = useState(0)
  const renderBadge = useRenderLabel(`🆕 ${label}`)
  return (
    <div>
      <div style={{ marginBottom: '0.25rem' }}>
        {renderBadge}
        <span className="info-text" style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
          （数值回到 0 = 实例被重建）
        </span>
      </div>
      <div>
        <span className="tag" style={{ marginRight: '0.5rem' }}>
          count = {n}
        </span>
        <button onClick={() => setN((x) => x + 1)} style={{ fontSize: '0.85rem', padding: '0.2em 0.6em' }}>
          +1
        </button>
      </div>
    </div>
  )
}

// =================================================================
// ③ Fiber 架构演示
// =================================================================
const FIBER_DEMO_SOURCE = `// ===== Fiber 节点的关键字段（简化版）=====
interface Fiber {
  type: any                // 组件类型或标签名
  memoizedProps: any       // 上次渲染使用的 props
  memoizedState: any       // 上次渲染后的 state（Hooks 链表头）
  alternate: Fiber | null  // 双缓冲：workInProgress ↔ current 互指

  // 树结构（单链表 + 长子兄弟指针，DFS 可中断）
  child: Fiber | null      // 第一个子节点
  sibling: Fiber | null    // 下一个兄弟节点
  return: Fiber | null     // 父节点

  // 副作用标记
  flags: Flags             // Placeholder / Update / Delete / Ref...
  effects: Fiber[]         // 子树所有有 flags 的节点（已废弃→改用链表）
  firstEffect / lastEffect: Fiber | null // effect 链表头尾
}

// ===== 可中断渲染：requestIdleCallback 风格调度 =====
// 每处理完 1 个 Fiber 就问一次浏览器："还有空闲时间吗？"
let workInProgress: Fiber | null = null
function workLoop(deadline: IdleDeadline) {
  while (workInProgress && deadline.timeRemaining() > ENOUGH) {
    workInProgress = performUnitOfWork(workInProgress)
  }
  if (workInProgress) requestIdleCallback(workLoop)
  else commitAllWork()  // Render 阶段完成 → 一次性 Commit
}`

type FiberPhase = 'idle' | 'scheduling' | 'render' | 'commit' | 'done'

function FiberArchitectureDemo() {
  const [phase, setPhase] = useState<FiberPhase>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const timerRef = useRef<number | null>(null)

  const steps = [
    { label: '😴 空闲：current Fiber 树在内存中', detail: 'current 树 = 已经渲染到屏幕上的那个版本', color: '#94a3b8' },
    { label: '📅 Schedule 调度阶段', detail: '有更新产生 → 标记为待调度，按优先级排队（Lanes 模型）', color: '#06b6d4' },
    { label: '🔨 Render 渲染阶段（可中断）', detail: '深度优先构建 workInProgress 树：beginWork → completeWork；每处理一个 Fiber 就检查时间片', color: '#fbbf24' },
    { label: '🔨 生成 Effect List', detail: 'Diff 完成后，workInProgress 树中所有需要改动的 Fiber 被链成 effect 链表', color: '#a855f7' },
    { label: '✅ Commit 提交阶段（不可中断）', detail: '按 effect 链表把差异一次性应用到真实 DOM：beforeMutation → mutation → layout', color: '#22c55e' },
    { label: '🎉 完成：双缓冲互换', detail: 'current = workInProgress；下一次更新时用同样的 alternate 机制复用节点', color: '#ec4899' },
  ]

  const runAuto = () => {
    if (timerRef.current !== null) return
    setPhase('scheduling')
    setCurrentStep(0)
    let i = 0
    const tick = () => {
      i += 1
      if (i >= steps.length) {
        setCurrentStep(steps.length - 1)
        setPhase('done')
        timerRef.current = null
        return
      }
      setCurrentStep(i)
      if (i === 1) setPhase('scheduling')
      if (i >= 2 && i <= 3) setPhase('render')
      if (i === 4) setPhase('commit')
      if (i === 5) setPhase('done')
      timerRef.current = window.setTimeout(tick, 1200)
    }
    timerRef.current = window.setTimeout(tick, 1200)
  }

  const stop = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const reset = () => {
    stop()
    setCurrentStep(0)
    setPhase('idle')
  }

  useEffect(() => () => stop(), [])

  const phaseColor: Record<FiberPhase, string> = {
    idle: '#94a3b8',
    scheduling: '#06b6d4',
    render: '#fbbf24',
    commit: '#22c55e',
    done: '#ec4899',
  }

  return (
    <div className="card">
      <h3 style={{ color: '#06b6d4' }}>③ Fiber 架构 —— 可中断、有优先级、双缓冲</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        React 15 用 <strong>Stack Reconciler</strong>（递归栈），一进渲染就卡死到底；
        React 16 换成 <strong>Fiber Reconciler</strong>：把整棵树的递归拆成
        <em> 一个个 Fiber 节点的单元任务 </em>，每完成一个就问浏览器「还有空吗？」——
        没空就让出主线程，下次接着干（基于 Scheduler 包的时间切片）。
      </p>

      <div style={{ marginBottom: '0.75rem' }}>
        <button className="primary" onClick={runAuto}>
          ▶️ 自动播放 Fiber 生命周期
        </button>
        <button onClick={stop} style={{ marginLeft: '0.5rem' }}>
          ⏸ 暂停
        </button>
        <button onClick={reset} style={{ marginLeft: '0.5rem' }}>
          🔄 重置
        </button>
        <span
          className="tag"
          style={{
            marginLeft: '0.5rem',
            backgroundColor: phaseColor[phase] + '33',
            color: phaseColor[phase],
            border: `1px solid ${phaseColor[phase]}55`,
          }}
        >
          当前阶段：{phase.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {steps.map((s, idx) => {
          const active = idx === currentStep
          const done = idx < currentStep
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                backgroundColor: active ? s.color + '22' : done ? '#0f172a' : '#0f172a55',
                border: active ? `2px solid ${s.color}` : '1px solid #334155',
                transition: 'all 0.3s ease',
                transform: active ? 'translateX(6px)' : 'none',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: done || active ? s.color : '#334155',
                  color: done || active ? '#000' : '#94a3b8',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                {done ? '✓' : idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: done || active ? s.color : '#94a3b8' }}>
                  {s.label}
                </div>
                <div className="info-text" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                  {s.detail}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <FiberTreeVisualizer step={currentStep} />

      <SourceCode label="Fiber 节点结构 + workLoop 伪代码" code={FIBER_DEMO_SOURCE} />
    </div>
  )
}

function FiberTreeVisualizer({ step }: { step: number }) {
  const nodes = [
    { id: 'Root', row: 0, col: 2, label: 'RootFiber' },
    { id: 'App', row: 1, col: 2, label: 'App' },
    { id: 'A', row: 2, col: 1, label: 'CompA' },
    { id: 'B', row: 2, col: 3, label: 'CompB' },
    { id: 'C', row: 3, col: 0, label: 'ChildC' },
    { id: 'D', row: 3, col: 2, label: 'ChildD' },
  ]
  const order = ['Root', 'App', 'A', 'C', 'B', 'D']
  const [activeOffset, setActiveOffset] = useState(0)

  useEffect(() => {
    if (step !== 2 && step !== 4) {
      setActiveOffset(0)
      return
    }
    const total = step === 2 ? 4 : order.length
    const id = window.setInterval(() => {
      setActiveOffset((x) => (x + 1) % total)
    }, 600)
    return () => clearInterval(id)
  }, [step])

  const colorFor = (id: string) => {
    if (step < 2) return '#94a3b8'
    if (step >= 5) return '#22c55e'
    const myIdx = order.indexOf(id)
    const done = myIdx <= activeOffset
    if (step === 4) return done ? '#22c55e' : '#fbbf24'
    return done ? '#fbbf24' : '#94a3b8'
  }

  return (
    <div
      style={{
        marginTop: '1rem',
        background: '#0f172a',
        borderRadius: 8,
        padding: '1rem',
        position: 'relative',
        minHeight: 220,
        border: '1px dashed #334155',
      }}
    >
      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
        🌳 Fiber 树遍历顺序（child → sibling → return，深度优先）
      </div>
      <svg width="100%" height="200" viewBox="0 0 600 200" style={{ display: 'block' }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#475569" />
          </marker>
        </defs>
        {/* edges */}
        {[
          ['Root', 'App'],
          ['App', 'A'],
          ['App', 'B'],
          ['A', 'C'],
          ['B', 'D'],
        ].map(([a, b]) => {
          const na = nodes.find((n) => n.id === a)!
          const nb = nodes.find((n) => n.id === b)!
          const x1 = 60 + na.col * 160
          const y1 = 28 + na.row * 55
          const x2 = 60 + nb.col * 160
          const y2 = 28 + nb.row * 55
          const color = colorFor(a) === '#94a3b8' || colorFor(b) === '#94a3b8' ? '#334155' : colorFor(b)
          return (
            <line
              key={a + b}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={2}
              markerEnd="url(#arr)"
            />
          )
        })}
        {/* nodes */}
        {nodes.map((n) => {
          const x = 60 + n.col * 160
          const y = 28 + n.row * 55
          const c = colorFor(n.id)
          return (
            <g key={n.id}>
              <rect
                x={x - 42}
                y={y - 16}
                width={84}
                height={32}
                rx={6}
                fill={c + '33'}
                stroke={c}
                strokeWidth={2}
              />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fill={c} fontWeight={700}>
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// =================================================================
// ④ setState → 页面显示 完整流程演示
// =================================================================
const SETSTATE_FLOW_SOURCE = `// 一个典型的事件回调里调用 setState
<button onClick={() => {
  setCount(c => c + 1)      // 1️⃣ 产生更新对象，推入 updateQueue
  console.log(count)        // ❌ 此时 count 还是旧值（闭包）
}}>

// ===== 微观时间线（简化版）=====
// 1. 调用 dispatchSetState → 创建 {action: c=>c+1, lane: SyncLane}
//    → 挂到 fiber.updateQueue 上 → 调用 scheduleUpdateOnFiber()
// 2. scheduleUpdateOnFiber() → 标记该 fiber 及其祖先直到 root
//    → ensureRootIsScheduled(root, priority)
// 3. Scheduler.runWithPriority(priority, performSyncWorkOnRoot)
//    → performUnitOfWork 遍历 Fiber 树（Render 阶段）
//    → 遇到有 updateQueue 的组件：合并最新 state → 重新执行函数组件
//    → reconcileChildren：生成新子 Fiber + Diff + 打 flags
// 4. Render 结束 → commitRoot(root)
//    → mutation 前：getSnapshotBeforeUpdate / cleanups
//    → mutation：appendChild / removeChild / updateDOMProperties
//    → layout：useLayoutEffect 回调 / ref 挂载 / componentDidMount
// 5. 浏览器把变更后的 DOM 光栅化成像素 → 👀 用户看到新界面

// ===== 为什么 useState 拿到的是"旧值"？=====
// 每次函数组件执行 = 生成一个快照（snapshot）
// onClick 闭包捕获的是那次渲染快照里的 count；
// setState 触发"下一次渲染"，但不会时光倒流改本次闭包里的值。`

function SetStateFlowDemo() {
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<Array<{ time: string; text: string; color: string }>>([])
  const logScrollerRef = useRef<HTMLDivElement>(null)

  const pushLog = (text: string, color = '#94a3b8') => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false }) + '.' +
      String(new Date().getMilliseconds()).padStart(3, '0')
    setLogs((prev) => [...prev, { time, text, color }])
  }

  useEffect(() => {
    const el = logScrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [logs])

  const handleClick = () => {
    pushLog('① 事件回调触发：用户点击了「+1」按钮', '#06b6d4')
    pushLog(`   · 闭包中捕获的 count = ${count}（本次渲染快照值）`, '#64748b')

    // 用函数式更新模拟 React 内部：把 update 推入 updateQueue
    setCount((c) => {
      pushLog(`② dispatchSetState：把更新 (c=>c+1) 挂到 fiber.updateQueue，新值=${c + 1}`, '#fbbf24')
      return c + 1
    })
    pushLog('   · 调用 scheduleUpdateOnFiber → 向上标记 lane 直到 root', '#64748b')
    pushLog('③ Scheduler 开始调度 → performSyncWorkOnRoot（Render 阶段）', '#a855f7')
    pushLog('   · beginWork：重新执行函数组件 → 生成新虚拟 DOM → Diff → 打 flags', '#64748b')
    pushLog('   · completeWork：构建 effect 链表，准备提交', '#64748b')
    pushLog('④ Commit 阶段：commitRoot → 把 flags 应用到真实 DOM', '#22c55e')
    pushLog('   · layout 阶段：useLayoutEffect + ref 挂载（同步）', '#64748b')
    pushLog('⑤ 浏览器完成布局/绘制 → useEffect 微任务触发（异步）', '#ec4899')
  }

  return (
    <div className="card">
      <h3 style={{ color: '#22c55e' }}>④ 完整流程：从 setState 到像素落到屏幕</h3>
      <p className="info-text" style={{ marginTop: 0 }}>
        点击下方按钮触发一次更新，右边会同步打印 React 内部每个阶段发生的事。
        注意观察 <code>count</code> 在「闭包捕获」和「真正更新」中的差异——这就是为什么
        <strong> 不要在 setState 后立刻读 state </strong>。
      </p>

      <div className="grid" style={{ gridTemplateColumns: '300px 1fr', gap: '1rem' }}>
        <div
          style={{
            border: '1px solid #646cff44',
            borderRadius: '8px',
            padding: '0.85rem',
            backgroundColor: '#646cff11',
          }}
        >
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#646cff' }}>🎮 交互 Demo</h4>
          <CounterMini count={count} />
          <button className="primary" onClick={handleClick} style={{ marginTop: '0.5rem', width: '100%' }}>
            ➕ 触发 setState (+1)
          </button>
          <button
            onClick={() => setLogs([])}
            style={{ marginTop: '0.35rem', width: '100%', fontSize: '0.85rem' }}
          >
            🧹 清空日志
          </button>
          <div className="code-block" style={{ marginTop: '0.85rem' }}>
            <div style={{ fontSize: '0.8rem' }}>
              <strong style={{ color: '#fbbf24' }}>当前 count：</strong>
              <span className="tag">{count}</span>
            </div>
            <p className="info-text" style={{ fontSize: '0.8rem', margin: '0.4rem 0 0 0' }}>
              每次重新渲染 = 函数组件重新执行 = 生成一个新的 UI 快照
            </p>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #334155',
            borderRadius: '8px',
            backgroundColor: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 320,
            maxHeight: 420,
          }}
        >
          <div
            style={{
              padding: '0.5rem 0.85rem',
              borderBottom: '1px solid #334155',
              fontWeight: 700,
              color: '#06b6d4',
              fontSize: '0.9rem',
            }}
          >
            📜 内部流程日志（请先点击左侧按钮）
          </div>
          <div
            ref={logScrollerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.5rem 0.85rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              scrollBehavior: 'smooth',
            }}
          >
            {logs.length === 0 && (
              <div style={{ color: '#475569', textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕐</div>
                等待一次 setState 触发...
              </div>
            )}
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.color, whiteSpace: 'nowrap' }}>
                <span style={{ color: '#475569', marginRight: 6 }}>[{l.time}]</span>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="code-block"
        style={{ marginTop: '1rem', border: '1px solid #f59e0b55', backgroundColor: '#f59e0b0a' }}
      >
        <strong style={{ color: '#f59e0b' }}>🔑 要点速记（面试高频）</strong>
        <ol style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
          <li><strong>Render 阶段</strong>（可中断，纯计算）：<code>beginWork → completeWork</code>，产出 effect 链表</li>
          <li><strong>Commit 阶段</strong>（不可中断，有副作用）：<code>beforeMutation → mutation → layout</code> 三段</li>
          <li><strong>useEffect</strong> 在 layout 之后异步触发（微任务，不阻塞绘制）；<strong>useLayoutEffect</strong> 在 layout 同步触发（可阻塞绘制）</li>
          <li><strong>批量更新</strong>：同一事件循环内连续多次 setState，只触发一次渲染；React 18 自动批量化（含 setTimeout/Promise）</li>
          <li><strong>为什么 State 不直接改？</strong> —— 保证函数组件的「快照语义」：每个渲染里 state/props 都是不可变的</li>
        </ol>
      </div>

      <SourceCode label="setState 完整时间线伪代码" code={SETSTATE_FLOW_SOURCE} />
    </div>
  )
}

function CounterMini({ count }: { count: number }) {
  const renderBadge = useRenderLabel('CounterMini')
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '1rem',
        borderRadius: 8,
        background: '#0f172a',
        border: '1px solid #334155',
      }}
    >
      {renderBadge}
      <div
        style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#646cff',
          margin: '0.25rem 0',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </div>
      <div className="info-text" style={{ fontSize: '0.8rem' }}>屏幕上真实显示的值</div>
    </div>
  )
}

export default ReactFiberPage
