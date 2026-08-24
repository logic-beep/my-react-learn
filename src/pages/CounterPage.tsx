import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '../store/features/counter/counterSlice'

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
