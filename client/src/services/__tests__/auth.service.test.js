import axios from 'axios';
import AuthService from '../auth.service';

jest.mock('axios');

describe('AuthService', () => {
    const mockGoogleData = {
        email: 'test@example.com',
        id: '123456789',
        name: 'Test User',
        picture: 'https://example.com/picture.jpg',
        locale: 'en',
        verified_email: true,
        given_name: 'Test',
        family_name: 'User'
    };

    const mockAuthResponse = {
        data: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            user: {
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/picture.jpg'
            }
        }
    };

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('loginWithGoogle', () => {
        it('should successfully login with Google data', async () => {
            axios.post.mockResolvedValueOnce(mockAuthResponse);

            const result = await AuthService.loginWithGoogle(mockGoogleData);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/google/'),
                expect.objectContaining({
                    email: mockGoogleData.email,
                    google_id: mockGoogleData.id
                })
            );
            expect(result).toEqual(mockAuthResponse.data);
            expect(localStorage.getItem('user')).toBeTruthy();
        });

        it('should handle login failure', async () => {
            const errorMessage = 'Authentication failed';
            axios.post.mockRejectedValueOnce({ 
                response: { data: { error: errorMessage } }
            });

            await expect(AuthService.loginWithGoogle(mockGoogleData))
                .rejects
                .toThrow(errorMessage);
        });
    });

    describe('logout', () => {
        it('should remove user from localStorage', () => {
            localStorage.setItem('user', JSON.stringify(mockAuthResponse.data));
            AuthService.logout();
            expect(localStorage.getItem('user')).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        it('should return user data from localStorage', () => {
            localStorage.setItem('user', JSON.stringify(mockAuthResponse.data));
            const user = AuthService.getCurrentUser();
            expect(user).toEqual(mockAuthResponse.data);
        });

        it('should return null when no user data exists', () => {
            const user = AuthService.getCurrentUser();
            expect(user).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when access token exists', () => {
            localStorage.setItem('user', JSON.stringify(mockAuthResponse.data));
            expect(AuthService.isAuthenticated()).toBe(true);
        });

        it('should return false when no access token exists', () => {
            expect(AuthService.isAuthenticated()).toBe(false);
        });
    });
});
