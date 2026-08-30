import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserDetailContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ai-prep-user');
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      localStorage.removeItem('ai-prep-user');
      return null;
    }
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem('ai-prep-user', JSON.stringify(u));
    } else {
      localStorage.removeItem('ai-prep-user');
    }
  };

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export const useUser = () => useContext(UserDetailContext);
