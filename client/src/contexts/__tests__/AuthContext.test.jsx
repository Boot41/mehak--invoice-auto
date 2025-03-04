import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Test component that uses the auth context
function TestComponent() {
  const { currentUser, isAuthenticated, token, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-email">{currentUser?.email || 'no-user'}</div>
      <div data-testid="token">{token || 'no-token'}</div>
      <button onClick={() => login({ token: 'test-token', user: { email: 'test@example.com' } })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial unauthenticated state', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('token')).toHaveTextContent('no-token');
  });

  it('loads authenticated state from localStorage', () => {
    const mockUser = { email: 'test@example.com' };
    const mockToken = 'test-token';
    
    mockLocalStorage.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('token')).toHaveTextContent('test-token');
  });

  it('updates state and localStorage on login', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginData = {
      token: 'new-token',
      user: { email: 'new@example.com' }
    };

    await act(async () => {
      await screen.getByText('Login').click();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', loginData.token);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(loginData.user));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('new@example.com');
    expect(screen.getByTestId('token')).toHaveTextContent('new-token');
  });

  it('clears state and localStorage on logout', async () => {
    const mockUser = { email: 'test@example.com' };
    const mockToken = 'test-token';
    
    mockLocalStorage.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await screen.getByText('Logout').click();
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('token')).toHaveTextContent('no-token');
  });
});
