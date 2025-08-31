import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer' | 'employee';
  avatar?: string;
  company?: string;
  title?: string;
  isEmailVerified?: boolean;
  isProfileComplete?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'employer' | 'employee';
  companyName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmailVerification: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUserVerificationStatus: (isEmailVerified: boolean, isProfileComplete?: boolean) => void;
}

// Dummy user credentials for testing
const DUMMY_USERS: Record<string, User> = {
  'admin@gigGeni.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@gigGeni.com',
    role: 'admin',
    title: 'System Administrator'
  },
  'employer@gigGeni.com': {
    id: '2',
    name: 'John Smith',
    email: 'employer@gigGeni.com',
    role: 'employer',
    company: 'TechCorp Solutions',
    title: 'HR Manager'
  },
  'employee@gigGeni.com': {
    id: '3',
    name: 'Sarah Johnson',
    email: 'employee@gigGeni.com',
    role: 'employee',
    title: 'Frontend Developer'
  },
  // Additional test users
  'hr@techcorp.com': {
    id: '4',
    name: 'Mike Wilson',
    email: 'hr@techcorp.com',
    role: 'employer',
    company: 'TechCorp Inc',
    title: 'Senior Recruiter'
  },
  'dev@example.com': {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'dev@example.com',
    role: 'employee',
    title: 'Full Stack Developer'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingEmailVerification: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check dummy credentials
        const user = DUMMY_USERS[email.toLowerCase()];
        
        if (user && password === 'password123') {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } else {
          set({ isLoading: false });
          return { 
            success: false, 
            error: 'Invalid email or password' 
          };
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user already exists
        if (DUMMY_USERS[data.email.toLowerCase()]) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: 'User with this email already exists' 
          };
        }
        
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          role: data.role,
          company: data.companyName,
          title: data.role === 'admin' ? 'Administrator' : 
                 data.role === 'employer' ? 'Recruiter' : 'Job Seeker',
          isEmailVerified: false,
          isProfileComplete: false
        };
        
        // Add to dummy users (in real app, this would be an API call)
        DUMMY_USERS[data.email.toLowerCase()] = newUser;
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false,
          pendingEmailVerification: true
        });
        
        return { success: true };
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          pendingEmailVerification: false
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUserVerificationStatus: (isEmailVerified: boolean, isProfileComplete?: boolean) => {
        const currentState = get();
        if (currentState.user) {
          const updatedUser = {
            ...currentState.user,
            isEmailVerified,
            ...(isProfileComplete !== undefined && { isProfileComplete })
          };
          
          set({
            user: updatedUser,
            pendingEmailVerification: !isEmailVerified
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        pendingEmailVerification: state.pendingEmailVerification
      }),
    }
  )
);