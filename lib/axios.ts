// ============================================================================
// AXIOS CONFIGURATION
// ============================================================================
// Professional Axios setup with interceptors for token management
// Handles automatic token refresh and 401 error responses

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '../types';
import { store } from '../store';
import { refreshAccessToken, logout } from '../store/slices/authSlice';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================
// Automatically attach access token to requests

apiClient.interceptors.request.use(
  (config) => {
    // Get current auth state
    const state = store.getState();
    const accessToken = state.auth.accessToken || getAccessTokenFromCookie();
    
    // Attach token if available
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Add request timestamp for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================
// Handle token refresh and error responses

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh the token
        const refreshResult = await store.dispatch(refreshAccessToken()).unwrap();
        const newAccessToken = refreshResult.accessToken;
        
        // Process queued requests with new token
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        store.dispatch(logout());
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other errors
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      code: (error.response?.data as any)?.code,
      details: error.response?.data,
    };
    
    return Promise.reject(apiError);
  }
);

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
 * Create a request with custom configuration
 */
export const createRequest = <T = any>(
  config: AxiosRequestConfig & {
    requiresAuth?: boolean;
    retryOnFailure?: boolean;
  }
) => {
  return apiClient.request<ApiResponse<T>>(config);
};

/**
 * Upload file with progress tracking
 */
export const uploadFile = (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

/**
 * Download file
 */
export const downloadFile = async (url: string, filename?: string) => {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// ============================================================================
// HTTP METHODS
// ============================================================================

export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<ApiResponse<T>>(url, config),
  
  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<ApiResponse<T>>(url, data, config),
  
  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<ApiResponse<T>>(url, data, config),
  
  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<ApiResponse<T>>(url, data, config),
  
  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<ApiResponse<T>>(url, config),
};

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

// if (process.env.NODE_ENV === 'development') {
//   // Add request/response logging
//   apiClient.interceptors.request.use((config) => {
//     config.metadata = { startTime: new Date() };
//     return config;
//   });
  
//   apiClient.interceptors.response.use(
//     (response) => {
//       const endTime = new Date();
//       const duration = endTime.getTime() - response.config.metadata?.startTime?.getTime();
//       console.log(`⏱️ Request duration: ${duration}ms`);
//       return response;
//     },
//     (error) => {
//       const endTime = new Date();
//       const duration = endTime.getTime() - error.config?.metadata?.startTime?.getTime();
//       console.log(`⏱️ Failed request duration: ${duration}ms`);
//       return Promise.reject(error);
//     }
//   );
// }

export default apiClient;