import React from 'react';
import { render } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

describe('ProtectedRoute Component', () => {
  const MockComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    Navigate.mockImplementation(() => null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    // Mock the AuthContext value
    const mockAuthContext = {
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn()
    };

    const { getByText } = render(
      <AuthProvider value={mockAuthContext}>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </AuthProvider>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
    expect(Navigate).not.toHaveBeenCalled();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock the AuthContext value
    const mockAuthContext = {
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn()
    };

    render(
      <AuthProvider value={mockAuthContext}>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </AuthProvider>
    );

    expect(Navigate).toHaveBeenCalledWith(
      { to: '/login', replace: true },
      {}
    );
  });
});
