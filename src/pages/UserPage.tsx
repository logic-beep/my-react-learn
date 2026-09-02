import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  setUser,
  logout,
  updateName,
} from '../store/features/user/userSlice'
import { SourceCode } from '../components/SourceCode'

// -----------------------------------------------------
// UserPage 第一张演示卡片源码快照（精简骨架）：供卡片底部「查看源码」折叠块展示。
// ⚠️ 快照为便于对照学习的精简骨架（已省略样式/包装/长文案与完整依赖文件）；修改上方演示卡片的真实逻辑时请同步更新。
// -----------------------------------------------------
const USERPAGE_DEMO_SOURCE = `// 📄 上方演示卡片的精简骨架（节选自 src/pages/UserPage.tsx：真实状态流转与交互逻辑保留，样式/包装/长文案已省略）
function UserDemo() {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [loginName, setLoginName] = useState('')
  const [loginAge, setLoginAge] = useState('')
  const [newName, setNewName] = useState('')
  const handleLogin = () => {
    if (!loginName || !loginAge) return
    dispatch(setUser({ name: loginName, age: Number(loginAge) }))
    setLoginName('')
    setLoginAge('')
  }
  const handleUpdateName = () => {
    if (!newName) return
    dispatch(updateName(newName))
    setNewName('')
  }

  return (
    <div>
      <p><strong>登录状态：</strong>{user.isLoggedIn ? '✅ 已登录' : '❌ 未登录'}</p>
      <p><strong>用户名：</strong>{user.name || '(未设置)'}</p>
      <p><strong>年龄：</strong>{user.age || '(未设置)'}</p>
      {!user.isLoggedIn ? (
        <div>
          <input type="text" placeholder="输入用户名" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
          <input type="number" placeholder="输入年龄" value={loginAge} onChange={(e) => setLoginAge(e.target.value)} />
          <button onClick={handleLogin} disabled={!loginName || !loginAge}>登录</button>
        </div>
      ) : (
        <div>
          <input type="text" placeholder="输入新用户名" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button onClick={handleUpdateName} disabled={!newName}>更新名字</button>
          <button onClick={() => dispatch(logout())}>🚪 退出登录</button>
        </div>
      )}
    </div>
  )
}

// ─── 关键节选（完整实现见 src/store/features/user/userSlice.ts）───
const initialState = { name: '', age: 0, isLoggedIn: false } // 初始三字段：name / age / isLoggedIn
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; age: number }>) => {
      state.name = action.payload.name
      state.age = action.payload.age
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.name = ''
      state.age = 0
      state.isLoggedIn = false
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
  },
})
export const { setUser, logout, updateName } = userSlice.actions
export default userSlice.reducer`

function UserPage() {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const [loginName, setLoginName] = useState('')
  const [loginAge, setLoginAge] = useState('')
  const [newName, setNewName] = useState('')

  const handleLogin = () => {
    if (!loginName || !loginAge) return
    dispatch(setUser({ name: loginName, age: Number(loginAge) }))
    setLoginName('')
    setLoginAge('')
  }

  const handleUpdateName = () => {
    if (!newName) return
    dispatch(updateName(newName))
    setNewName('')
  }

  return (
    <div>
      <div className="card">
        <h2>👤 用户状态管理（Redux + Hooks 综合示例）</h2>

        <div
          style={{
            padding: '1rem',
            backgroundColor: user.isLoggedIn ? '#22c55e22' : '#333',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: `1px solid ${user.isLoggedIn ? '#22c55e' : '#555'}`,
          }}
        >
          <h3 style={{ marginTop: 0 }}>当前用户状态</h3>
          <p>
            <strong>登录状态：</strong>
            <span className={user.isLoggedIn ? 'tag' : 'tag'}>
              {user.isLoggedIn ? '✅ 已登录' : '❌ 未登录'}
            </span>
          </p>
          <p>
            <strong>用户名：</strong>
            <span className="tag">{user.name || '(未设置)'}</span>
          </p>
          <p>
            <strong>年龄：</strong>
            <span className="tag">{user.age || '(未设置)'}</span>
          </p>
        </div>

        {!user.isLoggedIn ? (
          <div>
            <h3>🔐 用户登录</h3>
            <input
              type="text"
              placeholder="输入用户名"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
            />
            <input
              type="number"
              placeholder="输入年龄"
              value={loginAge}
              onChange={(e) => setLoginAge(e.target.value)}
              style={{ width: '120px' }}
            />
            <button
              className="primary"
              onClick={handleLogin}
              disabled={!loginName || !loginAge}
            >
              登录
            </button>
          </div>
        ) : (
          <div>
            <h3>✏️ 修改用户名</h3>
            <input
              type="text"
              placeholder="输入新用户名"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              className="primary"
              onClick={handleUpdateName}
              disabled={!newName}
            >
              更新名字
            </button>
            <button className="danger" onClick={() => dispatch(logout())}>
              🚪 退出登录
            </button>
          </div>
        )}

        <SourceCode
          label="UserDemo（👤 Redux + Hooks 用户状态管理示例）"
          code={USERPAGE_DEMO_SOURCE}
        />
      </div>

      <div className="card">
        <h3>💡 核心知识点</h3>
        <ul>
          <li>
            <strong>useSelector</strong>：从 Redux store 中读取状态
          </li>
          <li>
            <strong>useDispatch</strong>：获取 dispatch 函数，用于触发 action
          </li>
          <li>
            <strong>createSlice</strong>：同时定义 reducer、action creators 和 action types
          </li>
          <li>
            <strong>PayloadAction</strong>：带类型的 action payload
          </li>
          <li>
            <strong>Immer 集成</strong>：可以在 reducer 中直接"修改"state（内部自动不可变更新）
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserPage
