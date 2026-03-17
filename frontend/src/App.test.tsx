import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // For testing with React Router
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

describe('App Component', () => {
  test('renders Project Manager title in Navbar', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );
    const titleElement = screen.getByText(/Project Management /i);
    expect(titleElement).toBeInTheDocument();
  });
});