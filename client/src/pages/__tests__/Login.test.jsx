import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../contexts/AuthContext';
import Login from '../Login';

// Mock the navigation function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the jwt-decode function
jest.mock('jwt-decode', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/picture.jpg'
  }))
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: 'fake-token', user: { id: 1, email: 'test@example.com' } })
  })
);

const renderLoginComponent = () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with title and features', () => {
    renderLoginComponent();
    
    expect(screen.getByText('InvoiceAuto')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Invoice Processing & Inventory Management')).toBeInTheDocument();
    
    // Check if features are rendered
    expect(screen.getByText('AI-Powered Invoice Processing')).toBeInTheDocument();
    expect(screen.getByText('Smart Email Integration')).toBeInTheDocument();
    expect(screen.getByText('One-Click Approval')).toBeInTheDocument();
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
  });

  it('handles successful Google login', async () => {
    renderLoginComponent();
    
    // Simulate successful Google login
    const mockCredentialResponse = {
      credential: 'fake-credential'
    };
    
    // Find and trigger the Google login callback
    const googleLoginDiv = screen.getByRole('button');
    fireEvent.click(googleLoginDiv);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: mockCredentialResponse.credential,
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/picture.jpg'
        }),
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles Google login error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock fetch to return an error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid token' })
      })
    );
    
    renderLoginComponent();
    
    // Simulate failed Google login
    const googleLoginDiv = screen.getByRole('button');
    fireEvent.click(googleLoginDiv);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});
