import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/stores/auth-store'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useAuthStore.getState().logout()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.token).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('should set user and token on login', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    const mockToken = 'mock-jwt-token'

    act(() => {
      result.current.login(mockToken, mockUser)
    })

    expect(result.current.token).toBe(mockToken)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoggedIn).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockToken)
  })

  it('should clear state on logout', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    const mockToken = 'mock-jwt-token'

    // First login
    act(() => {
      result.current.login(mockToken, mockUser)
    })

    expect(result.current.isLoggedIn).toBe(true)

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.token).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
  })

  it('should update user data', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    const updatedUser = { ...mockUser, name: 'Updated Name' }

    act(() => {
      result.current.setUser(updatedUser)
    })

    expect(result.current.user).toEqual(updatedUser)
  })

  it('should persist token to localStorage on login', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockToken = 'mock-jwt-token'

    act(() => {
      result.current.login(mockToken, { id: '1', email: 'test@example.com' })
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockToken)
  })
})
