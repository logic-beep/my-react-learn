import { useState } from 'react'
import { SourceCode } from '../components/SourceCode'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '../store/features/counter/counterSlice'

// -----------------------------------------------------
// CounterPage 演示卡片源码快照：供第一张卡片底部「查看源码」折叠块展示。
// ⚠️ 若修改了页面中第一张演示卡片的逻辑/UI，请同步更新这里的字符串内容。
// -----------------------------------------------------
const COUNTERPAGE_DEMO_SOURCE = `// 📄 上方演示卡片的实际代码（节选自 src/pages/CounterPage.tsx，整理为独立示例形态）

function CounterDemo() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const [incrementAmount, setIncrementAmount] = useState(5)

  return (
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
    </div>
  )
}

// ─── 配套源码（完整文件）：src/store/features/counter/counterSlice.ts ───
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
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

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions
export default counterSlice.reducer

// ─── 配套源码（完整文件）：src/store/index.ts ───
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import userReducer from './features/user/userSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// ─── 配套源码（完整文件）：src/store/hooks.ts ───
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

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
        <div className="code-block">
          <pre style={{ margin: 0 }}>
{`const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})`}
          </pre>
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          <strong>2. 组件中使用</strong>
        </p>
        <div className="code-block">
          <pre style={{ margin: 0 }}>
{`// 读取状态
const count = useSelector((state) => state.counter.value)

// 触发 action
const dispatch = useDispatch()
dispatch(increment())
dispatch(incrementByAmount(5))`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CounterPage
