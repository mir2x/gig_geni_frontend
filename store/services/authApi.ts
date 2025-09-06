// ============================================================================
// AUTHENTICATION API SERVICE
// ============================================================================
// Professional API service layer for authentication endpoints
// Uses mock data for development - easily replaceable with real API calls

import { api } from '../../lib/axios';
import type {
  User,
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ApiResponse
} from '../../types';

// ============================================================================
// MOCK DATA (Remove when integrating real API)
// ============================================================================

const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@giggeni.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@giggeni.com',
    role: 'admin',
    title: 'System Administrator',
    password: 'password123',
    isEmailVerified: true,
    isProfileComplete: true,
  },
  'employer@giggeni.com': {
    id: '2',
    name: 'John Smith',
    email: 'employer@giggeni.com',
    role: 'employer',
    company: 'TechCorp Solutions',
    title: 'HR Manager',
    password: 'password123',
    isEmailVerified: true,
    isProfileComplete: true,
  },
  'employee@giggeni.com': {
    id: '3',
    name: 'Sarah Johnson',
    email: 'employee@giggeni.com',
    role: 'employee',
    title: 'Frontend Developer',
    password: 'password123',
    isEmailVerified: true,
    isProfileComplete: true,
  },
  'hr@techcorp.com': {
    id: '4',
    name: 'Mike Wilson',
    email: 'hr@techcorp.com',
    role: 'employer',
    company: 'TechCorp Inc',
    title: 'Senior Recruiter',
    password: 'password123',
    isEmailVerified: true,
    isProfileComplete: true,
  },
  'dev@example.com': {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'dev@example.com',
    role: 'employee',
    title: 'Full Stack Developer',
    password: 'password123',
    isEmailVerified: false,
    isProfileComplete: false,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a mock JWT token for development
 */
function createMockJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    title: user.title,
    isEmailVerified: user.isEmailVerified,
    isProfileComplete: user.isProfileComplete,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Create a mock refresh token
 */
function createMockRefreshToken(userId: string): string {
  const payload = btoa(JSON.stringify({
    sub: userId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  }));
  return `refresh.${payload}.mock-signature`;
}

/**
 * Simulate API delay
 */
function simulateDelay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Decode JWT payload (for mock tokens)
 */
function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ============================================================================
// AUTHENTICATION API SERVICE
// ============================================================================

export const authApi = {
  /**
   * Login user with email and password
   */
  async login(loginData: LoginData): Promise<LoginResponse> {
    // TODO: Replace with real API call
    // const response = await api.post<LoginResponse>('/auth/login', loginData);
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(1000);
    
    const user = MOCK_USERS[loginData.email.toLowerCase()];
    
    if (!user || user.password !== loginData.password) {
      throw new Error('Invalid email or password');
    }
    
    const { password, ...userWithoutPassword } = user;
    const accessToken = createMockJWT(userWithoutPassword);
    const refreshToken = createMockRefreshToken(user.id);
    
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  },

  /**
   * Register new user
   */
  async register(registerData: RegisterData): Promise<RegisterResponse> {
    // TODO: Replace with real API call
    // const response = await api.post<RegisterResponse>('/auth/register', registerData);
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(1500);
    
    // Check if user already exists
    if (MOCK_USERS[registerData.email.toLowerCase()]) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: registerData.name,
      email: registerData.email,
      role: registerData.role,
      company: registerData.companyName,
      title: registerData.role === 'admin' ? 'Administrator' : 
             registerData.role === 'employer' ? 'Recruiter' : 'Job Seeker',
      isEmailVerified: false,
      isProfileComplete: false,
    };
    
    // Add to mock users (in real app, this would be handled by the API)
    MOCK_USERS[registerData.email.toLowerCase()] = {
      ...newUser,
      password: registerData.password,
    };
    
    const accessToken = createMockJWT(newUser);
    const refreshToken = createMockRefreshToken(newUser.id);
    
    return {
      user: newUser,
      accessToken,
      refreshToken,
      requiresEmailVerification: true,
    };
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    // TODO: Replace with real API call
    // const response = await api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(500);
    
    try {
      const payload = decodeJWT(refreshToken);
      
      if (!payload || payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        throw new Error('Refresh token expired');
      }
      
      // Find user by ID
      const user = Object.values(MOCK_USERS).find(u => u.id === payload.sub);
      if (!user) {
        throw new Error('User not found');
      }
      
      const { password, ...userWithoutPassword } = user;
      const newAccessToken = createMockJWT(userWithoutPassword);
      const newRefreshToken = createMockRefreshToken(user.id);
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    // TODO: Replace with real API call
    // const response = await api.get<User>('/auth/me');
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(300);
    
    // In a real implementation, the token would be validated by the server
    // For now, we'll get the user from the token in the cookie
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const payload = decodeJWT(accessToken);
    if (!payload) {
      throw new Error('Invalid access token');
    }
    
    const user = Object.values(MOCK_USERS).find(u => u.id === payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ user: User }> {
    // TODO: Replace with real API call
    // const response = await api.post<{ user: User }>('/auth/verify-email', { token });
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(800);
    
    // For mock purposes, we'll just mark the current user as verified
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const payload = decodeJWT(accessToken);
    if (!payload) {
      throw new Error('Invalid access token');
    }
    
    const user = MOCK_USERS[payload.email];
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user verification status
    user.isEmailVerified = true;
    
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  },

  /**
   * Logout user (revoke tokens)
   */
  async logout(): Promise<void> {
    // TODO: Replace with real API call
    // await api.post('/auth/logout');
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(300);
    
    // In a real implementation, this would revoke the refresh token on the server
    // For now, we'll just simulate the API call
    console.log('User logged out successfully');
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    // TODO: Replace with real API call
    // const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(1000);
    
    const user = MOCK_USERS[email.toLowerCase()];
    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }
    
    return { message: 'Password reset link has been sent to your email.' };
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // TODO: Replace with real API call
    // const response = await api.post<{ message: string }>('/auth/reset-password', { token, password: newPassword });
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(800);
    
    // For mock purposes, we'll just simulate success
    return { message: 'Password has been reset successfully.' };
  },

  /**
   * Change password (authenticated user)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    // TODO: Replace with real API call
    // const response = await api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword });
    // return response.data.data;
    
    // MOCK IMPLEMENTATION (Remove when integrating real API)
    await simulateDelay(600);
    
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) {
      throw new Error('No access token found');
    }
    
    const payload = decodeJWT(accessToken);
    if (!payload) {
      throw new Error('Invalid access token');
    }
    
    const user = MOCK_USERS[payload.email];
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    
    return { message: 'Password changed successfully.' };
  },
};

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

// ============================================================================
// REAL API ENDPOINTS (Uncomment when ready to integrate)
// ============================================================================

/*
// Real API implementation - uncomment and modify when integrating with backend

export const authApiReal = {
  async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', loginData);
    return response.data.data;
  },

  async register(registerData: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', registerData);
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data.data;
  },

  async verifyEmail(token: string): Promise<{ user: User }> {
    const response = await api.post<{ user: User }>('/auth/verify-email', { token });
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', { token, password: newPassword });
    return response.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword });
    return response.data.data;
  },
};
*/