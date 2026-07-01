import { createContext, useContext, useState, useCallback } from 'react';
import { useData } from './DataContext';
import { ROLES } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { users, addUser } = useData();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rms_session');
      if (saved) {
        let session = JSON.parse(saved);
        if (session && session.name && session.name.trim().toLowerCase().includes('majesté')) {
           session.name = 'Hassan Mahamat';
           localStorage.setItem('rms_session', JSON.stringify(session));
        }
        return session;
      }
      return null;
    } catch { return null; }
  });

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Email ou mot de passe incorrect.' };
    if (user.status === 'suspended') return { success: false, error: 'Compte suspendu. Contactez l\'administrateur.' };
    const session = { ...user };
    delete session.password;
    setCurrentUser(session);
    localStorage.setItem('rms_session', JSON.stringify(session));
    return { success: true, user: session };
  }, [users]);

  const register = useCallback((data) => {
    const exists = users.find(u => u.email === data.email);
    if (exists) return { success: false, error: 'Cet email est déjà utilisé.' };
    const newUser = addUser({
      ...data,
      role: ROLES.CLIENT,
      avatar: data.name.slice(0, 2).toUpperCase(),
      status: 'active',
    });
    const session = { ...newUser };
    delete session.password;
    setCurrentUser(session);
    localStorage.setItem('rms_session', JSON.stringify(session));
    return { success: true, user: session };
  }, [users, addUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('rms_session');
  }, []);

  const updateProfile = useCallback((data) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('rms_session', JSON.stringify(updated));
  }, [currentUser]);

  const isSuperAdmin = currentUser?.role === ROLES.SUPERADMIN;
  const isCaissier = currentUser?.role === ROLES.CAISSIER;
  const isClient = currentUser?.role === ROLES.CLIENT;

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      updateProfile,
      isSuperAdmin,
      isCaissier,
      isClient,
      isAuthenticated: !!currentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
