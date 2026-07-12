import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredToken,
  getProfile,
  getStoredToken,
  login as loginService,
  registerUser as registerUserService,
  storeToken
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        setUser(response?.data || null);
      } catch (error) {
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, [token]);

  const signIn = async (credentials) => {
    const response = await loginService(credentials);
    const accessToken = response?.data?.accessToken;
    const loggedInUser = response?.data?.user;

    if (!accessToken) {
      throw new Error('Authentication failed');
    }

    storeToken(accessToken);
    setToken(accessToken);
    setUser(loggedInUser || null);

    return response;
  };

  const registerUser = async (payload) => {
    const response = await registerUserService(payload);
    return response;
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'ADMIN',
    signIn,
    registerUser,
    logout
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
