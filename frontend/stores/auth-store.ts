import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  pan: string;
  isVerified: boolean;
  isActive: boolean;
  role: string;
  primaryPersona?: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  verifyOTP: (userId: string, otp: string, type: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (userId: string, otp: string, newPassword: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  pan: string;
}

type AuthStore = AuthState & AuthActions;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        const { accessToken } = get();
        
        try {
          if (accessToken) {
            await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Token refresh failed');
          }

          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        } catch (error: any) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      verifyOTP: async (userId: string, otp: string, type: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, otp, type }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'OTP verification failed');
          }

          set({
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'OTP verification failed',
          });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Password reset request failed');
          }

          set({
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password reset request failed',
          });
          throw error;
        }
      },

      resetPassword: async (userId: string, otp: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, otp, newPassword }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Password reset failed');
          }

          set({
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password reset failed',
          });
          throw error;
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true,
    }
  )
);

// API helper function with automatic token refresh
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<Response> => {
  const { accessToken, refreshAccessToken, logout } = useAuthStore.getState();

  // Add authorization header if required
  if (requireAuth && accessToken) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };
  }

  let response = await fetch(url, options);

  // If unauthorized and we have a refresh token, try to refresh
  if (response.status === 401 && requireAuth && accessToken) {
    try {
      await refreshAccessToken();
      const { accessToken: newAccessToken } = useAuthStore.getState();
      
      if (newAccessToken) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        };
        response = await fetch(url, options);
      }
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
};

// Hydrate the store on client side
if (typeof window !== 'undefined') {
  useAuthStore.persist.rehydrate()
}

// Hook for making authenticated API requests
export const useApiRequest = () => {
  return {
    get: (url: string, options?: RequestInit) => 
      apiRequest(url, { ...options, method: 'GET' }),
    post: (url: string, data?: any, options?: RequestInit) => 
      apiRequest(url, { 
        ...options, 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: data ? JSON.stringify(data) : undefined 
      }),
    put: (url: string, data?: any, options?: RequestInit) => 
      apiRequest(url, { 
        ...options, 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: data ? JSON.stringify(data) : undefined 
      }),
    delete: (url: string, options?: RequestInit) => 
      apiRequest(url, { ...options, method: 'DELETE' }),
  };
};
