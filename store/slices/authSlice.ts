// ============================================================================
// AUTH SLICE - Redux Toolkit
// ============================================================================
// Professional authentication slice with async thunks and proper error handling
// Replaces Zustand auth store with Redux Toolkit implementation

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  AuthState, 
  User, 
  LoginData, 
  RegisterData, 
  LoginResponse, 
  RegisterResponse,
  ApiResponse 
} from '../../types';
import { authApi } from '../services/authApi';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  pendingEmailVerification: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Login user with email and password
 */
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(loginData);
      
      // Store tokens in cookies/localStorage
      if (typeof window !== 'undefined') {
        document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`;
        document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Register new user
 */
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(registerData);
      
      // Store tokens in cookies
      if (typeof window !== 'undefined') {
        document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`;
        document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Refresh access token
 */
export const refreshAccessToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>(
  'auth/refreshAccessToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken || getRefreshTokenFromCookie();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.refreshToken(refreshToken);
      
      // Update cookies
      if (typeof window !== 'undefined') {
        document.cookie = `accessToken=${response.accessToken}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`;
        document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

/**
 * Verify email
 */
export const verifyEmail = createAsyncThunk<
  { user: User },
  string,
  { rejectValue: string }
>(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Email verification failed');
    }
  }
);

/**
 * Initialize auth from stored tokens
 */
export const initializeAuth = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string } | null,
  void,
  { rejectValue: string }
>(
  'auth/initializeAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const accessToken = getAccessTokenFromCookie();
      const refreshToken = getRefreshTokenFromCookie();
      
      if (!accessToken || !refreshToken) {
        return null;
      }
      
      // Check if access token is valid
      if (isTokenExpired(accessToken)) {
        // Try to refresh the token
        const refreshResult = await dispatch(refreshAccessToken()).unwrap();
        const user = await authApi.getCurrentUser();
        return {
          user,
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken,
        };
      } else {
        // Token is valid, get current user
        const user = await authApi.getCurrentUser();
        return { user, accessToken, refreshToken };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Auth initialization failed');
    }
  }
);

// ============================================================================
// AUTH SLICE
// ============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    logout: (state) => {
      // Clear cookies
      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // Reset state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.pendingEmailVerification = false;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.pendingEmailVerification = action.payload.requiresEmailVerification || false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      })
      
      // Refresh token cases
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // If refresh fails, logout user
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.pendingEmailVerification = false;
      })
      
      // Email verification cases
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.pendingEmailVerification = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Email verification failed';
      })
      
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get access token from cookie
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  } catch {
    return null;
  }
}

/**
 * Get refresh token from cookie
 */
function getRefreshTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

// ============================================================================
// SELECTORS
// ============================================================================

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectPendingEmailVerification = (state: { auth: AuthState }) => state.auth.pendingEmailVerification;

// ============================================================================
// EXPORTS
// ============================================================================

export const { logout, clearError, setLoading, updateUser, setTokens } = authSlice.actions;
export default authSlice.reducer;