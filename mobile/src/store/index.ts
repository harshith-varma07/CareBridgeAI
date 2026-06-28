import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN' | null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, role: null } as AuthState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
    }
  }
});

export const { setAuth, logout } = authSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer }
});

export type RootState = ReturnType<typeof store.getState>;
