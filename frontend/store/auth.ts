// store/auth.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { authApi } from './authApi';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  userName: string | null;
  id: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  userEmail: null,
  userName: null,
  id: null,
};

const setAuthCookie = (token: string, name: string) => {
  const toBase64 = Buffer.from(token).toString('base64');
  setCookie(name, toBase64, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
};

const getAuthCookie = (name: string) => {
  const cookie = getCookie(name);
  if (!cookie) return undefined;
  return Buffer.from(cookie as string, 'base64').toString('ascii');
};

export const getValidAuthTokens = () => {
  const token = getAuthCookie('auth_token');
  // Implement token expiration check if needed
  return { token };
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      deleteCookie('auth_token');
      deleteCookie('refresh_token');
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.refreshToken = payload.refreshToken;
        state.userEmail = payload.user?.email || null;
        state.userName = payload.user.username;
        state.id = payload.user.id;
        setAuthCookie(payload.token, 'auth_token');
        setAuthCookie(payload.refreshToken, 'refresh_token');
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.refreshToken = payload.refreshToken;
        state.userEmail = payload.user.email;
        state.userName = payload.user.username;
        state.id = payload.user.id;
        setAuthCookie(payload.token, 'auth_token');
        setAuthCookie(payload.refreshToken, 'refresh_token');
      })
      .addMatcher(authApi.endpoints.getAuthData.matchFulfilled, (state, { payload }) => {
        state.userEmail = payload.email || null;
        state.userName = payload.username;
        state.id = payload.id;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.userEmail = null;
        state.userName = null;
        state.id = null;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.userEmail = null;
        state.userName = null;
        state.id = null;
      })
      .addMatcher(authApi.endpoints.getAuthData.matchRejected, (state) => {
        state.userEmail = null;
        state.userName = null;
        state.id = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
