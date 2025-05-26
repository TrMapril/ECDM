import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import named export
import { User } from '../types/auth';
import { login, register } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
  id: number;
  role: string;
  [key: string]: any; // Cho phép thêm các trường khác nếu có
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: { id: number; role: string } = jwtDecode(storedToken); // Sử dụng jwtDecode
        setUser({ id: decoded.id, email: '', role: decoded.role });
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const data = await login(email, password);
    const decoded: { id: number; role: string } = jwtDecode(data.token); // Sử dụng jwtDecode
    setUser({ id: decoded.id, email, role: decoded.role });
    setToken(data.token);
    localStorage.setItem('token', data.token);
  };

  const registerUser = async (email: string, password: string) => {
    await register(email, password);
    await loginUser(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};