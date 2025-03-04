import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Login from '../Login';
import AuthService from '../../services/auth.service';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}));

jest.mock('@react-oauth/google', () => ({
    GoogleLogin: jest.fn()
}));

jest.mock('../../services/auth.service');

describe('Login Component', () => {
    const mockNavigate = jest.fn();
    
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        GoogleLogin.mockImplementation(({ onSuccess, onError }) => (
            <button 
                onClick={() => onSuccess({ credential: 'mock-credential' })}
                data-testid="google-login"
            >
                Sign in with Google
            </button>
        ));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders login page with Google button', () => {
        render(<Login />);
        
        expect(screen.getByText('Sign in to InvoiceAuto')).toBeInTheDocument();
        expect(screen.getByText('Automate your invoice management')).toBeInTheDocument();
        expect(screen.getByTestId('google-login')).toBeInTheDocument();
    });

    it('handles successful Google login', async () => {
        const mockAuthResponse = {
            access_token: 'mock-token',
            user: { email: 'test@example.com' }
        };
        
        AuthService.loginWithGoogle.mockResolvedValueOnce(mockAuthResponse);
        
        render(<Login />);
        
        const googleButton = screen.getByTestId('google-login');
        googleButton.click();
        
        await waitFor(() => {
            expect(AuthService.loginWithGoogle).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('handles Google login failure', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        AuthService.loginWithGoogle.mockRejectedValueOnce(new Error('Login failed'));
        
        render(<Login />);
        
        const googleButton = screen.getByTestId('google-login');
        googleButton.click();
        
        await waitFor(() => {
            expect(AuthService.loginWithGoogle).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
            expect(mockNavigate).not.toHaveBeenCalled();
        });
        
        consoleErrorSpy.mockRestore();
    });
});
