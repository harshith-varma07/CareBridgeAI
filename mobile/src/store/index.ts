import { configureStore, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi, getStoredAuth, AuthUser, UserRole } from '../services/authService';

/* ── Auth Slice ── */
type AuthState = {
  token: string | null;
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

const initialAuthState: AuthState = {
  token: null,
  user: null,
  role: null,
  loading: false,
  error: null,
  initialized: false,
};

export const initAuth = createAsyncThunk('auth/init', async () => {
  const stored = await getStoredAuth();
  return stored;
});

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await loginApi(email, password);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }: { name: string; email: string; password: string; role: UserRole }, { rejectWithValue }) => {
    try {
      const result = await registerApi(name, email, password, role);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuth: (state, action: PayloadAction<{ token: string; role: UserRole; user?: AuthUser }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      if (action.payload.user) state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.fulfilled, (state, action) => {
        state.initialized = true;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.role = action.payload.user.role;
        }
      })
      .addCase(initAuth.rejected, (state) => {
        state.initialized = true;
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.role = null;
      });
  },
});

export const { clearError, setAuth, logout } = authSlice.actions;

/* ── Store ── */
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
