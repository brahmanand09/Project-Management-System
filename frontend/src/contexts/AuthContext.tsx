import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: { id: string; email: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: { id: string; email: string } = jwtDecode(token);
        console.log('Decoded token:', decoded);
        setUser(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = (token: string) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      console.error('Invalid token provided to login:', token);
      return;
    }
    localStorage.setItem('token', token);
    try {
      const decoded: { id: string; email: string } = jwtDecode(token);
      console.log('Login decoded token:', decoded);
      setUser(decoded);
    } catch (error) {
      console.error('Failed to decode token on login:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};