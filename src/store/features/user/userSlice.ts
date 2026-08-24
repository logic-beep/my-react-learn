import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  name: string
  age: number
  isLoggedIn: boolean
}

const initialState: UserState = {
  name: '',
  age: 0,
  isLoggedIn: false,
}

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
export default userSlice.reducer
