import { useState } from 'react'
import { SourceCode } from '../components/SourceCode'
import { CodeBlock } from '../components/CodeBlock'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '../store/features/counter/counterSlice'

// -----------------------------------------------------
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改上方演示卡片的真实逻辑时请同步更新。
// -----------------------------------------------------
const COUNTERPAGE_DEMO_SOURCE = `// 📄 上方演示卡片的精简骨架（节选自 src/pages/CounterPage.tsx，整理为独立示例形态；已省略样式/包装/长文案）

function CounterDemo() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const [incrementAmount, setIncrementAmount] = useState(5)

  return (
    <div>
      <strong>{count}</strong>

      <button onClick={() => dispatch(decrement())}>- 1</button>
      <button onClick={() => dispatch(increment())}>+ 1</button>
      <button onClick={() => dispatch(reset())}>重置</button>

      <input
        type="number"
        value={incrementAmount}
        onChange={(e) => setIncrementAmount(Number(e.target.value))}
      />
      <button onClick={() => dispatch(incrementByAmount(incrementAmount))}>
        + {incrementAmount}
      </button>
    </div>
  )
}

// ─── 关键节选（完整实现见 src/store/features/counter/counterSlice.ts）───
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    reset: (state) => {
      state.value = 0
    },
  },
})

// ─── 关键节选（完整实现见 src/store/index.ts）───
const store = configureStore({
  reducer: { counter: counterReducer, user: userReducer },
})

// ─── 关键节选（完整实现见 src/store/hooks.ts）───
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()`

function CounterPage() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const [incrementAmount, setIncrementAmount] = useState(5)

  return (
    <div>
      <div className="card">
        <h2>🔢 Redux Toolkit 计数器</h2>
        <p className="info-text">
          此示例展示了 Redux Toolkit 的核心用法：createSlice、configureStore、useDispatch、useSelector
        </p>

        <div className="count-display">{count}</div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button className="primary" onClick={() => dispatch(decrement())}>
            - 1
          </button>
          <button onClick={() => dispatch(increment())}>
            + 1
          </button>
          <button className="danger" onClick={() => dispatch(reset())}>
            重置
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <input
            type="number"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(Number(e.target.value))}
            style={{ width: '100px', textAlign: 'center' }}
          />
          <button
            className="primary"
            onClick={() => dispatch(incrementByAmount(incrementAmount))}
          >
            + {incrementAmount}
          </button>
        </div>

        <SourceCode label="CounterDemo（🔢 Redux Toolkit 计数器示例）" code={COUNTERPAGE_DEMO_SOURCE} />
      </div>

      <div className="card">
        <h3>💡 关键代码说明</h3>
        <p>
          <strong>1. 创建 Slice (counterSlice.ts)</strong>
        </p>
        <CodeBlock code={`const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})`} language="typescript" />

        <p style={{ marginTop: '1.5rem' }}>
          <strong>2. 组件中使用</strong>
        </p>
        <CodeBlock code={`// 读取状态
const count = useSelector((state) => state.counter.value)

// 触发 action
const dispatch = useDispatch()
dispatch(increment())
dispatch(incrementByAmount(5))`} language="typescript" />
      </div>
    </div>
  )
}

export default CounterPage
