// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock environment variables
process.env.REACT_APP_API_URL = 'http://localhost:8000/api';
process.env.REACT_APP_GOOGLE_CLIENT_ID = 'mock-google-client-id';
