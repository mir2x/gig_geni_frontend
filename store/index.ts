// ============================================================================
// REDUX STORE CONFIGURATION
// ============================================================================
// Professional Redux Toolkit store setup with TypeScript support
// Includes middleware for development tools and persistence

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import type { RootState } from '../types';

// Import slices (will be created next)
import authSlice from './slices/authSlice';

// ============================================================================
// PERSIST CONFIGURATION
// ============================================================================

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [], // Add slices to exclude from persistence
};

// ============================================================================
// ROOT REDUCER
// ============================================================================

const rootReducer = combineReducers({
  auth: authSlice,
  // Add other slices here as they are created
  // competitions: competitionsSlice,
  // notifications: notificationsSlice,
  // profile: profileSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ============================================================================
// STORE CONFIGURATION
// ============================================================================

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [
          'persist/FLUSH',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.error'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// ============================================================================
// PERSISTOR
// ============================================================================

export const persistor = persistStore(store);

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;

// ============================================================================
// TYPED HOOKS
// ============================================================================
// Use these hooks instead of plain `useDispatch` and `useSelector`

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

// ============================================================================
// STORE UTILITIES
// ============================================================================

/**
 * Get the current state from the store
 * Useful for accessing state outside of React components
 */
export const getStoreState = () => store.getState();

/**
 * Dispatch an action from outside React components
 * Useful for API services and utilities
 */
export const dispatchAction = (action: any) => store.dispatch(action);

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

// if (process.env.NODE_ENV === 'development') {
//   // Enable hot module replacement for reducers
//   if (module.hot) {
//     module.hot.accept('./slices/authSlice', () => {
//       const newAuthSlice = require('./slices/authSlice').default;
//       store.replaceReducer(
//         persistReducer(persistConfig, combineReducers({
//           auth: newAuthSlice,
//           // Add other slices here
//         }))
//       );
//     });
//   }

//   // Log store state changes in development
//   store.subscribe(() => {
//     console.log('🔄 Store updated:', store.getState());
//   });
// }

export default store;