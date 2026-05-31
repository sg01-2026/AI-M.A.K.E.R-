import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | any | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: (id: string, pw: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMockAdmin = () => {
      const isMock = localStorage.getItem('mock_admin') === 'true';
      if (isMock) {
        setUser({
          uid: 'mock-admin',
          email: 'admin@maker.project',
          displayName: 'Administrator'
        } as any);
        setIsAdmin(true);
        setLoading(false);
        return true;
      }
      return false;
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (checkMockAdmin()) return;

      setUser(user);
      if (user) {
        // Check if user exists in Firestore, or create a default profile
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const isDefaultAdmin = user.email === 'sg01@gge.goe.go.kr';
          const newUser = {
            uid: user.uid,
            email: user.email,
            isAdmin: isDefaultAdmin, // Set user as admin if email matches
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, newUser);
          setIsAdmin(isDefaultAdmin);
        } else {
          // Also check for the hardcoded admin email even if user exists in case it was changed directly in DB
          const userData = userSnap.data();
          setIsAdmin(userData.isAdmin || user.email === 'sg01@gge.goe.go.kr');
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    localStorage.removeItem('mock_admin');
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const login = async (id: string, pw: string) => {
    if (id === 'admin' && pw === 'admin') {
      setUser({
        uid: 'mock-admin',
        email: 'admin@maker.project',
        displayName: 'Administrator'
      } as any);
      setIsAdmin(true);
      localStorage.setItem('mock_admin', 'true');
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
