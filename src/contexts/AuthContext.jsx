import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { User, UserRole } from '../types';

// interface AuthContextType {
//   user | null;
//   login: (email: string, password: string, role: UserRole) => Promise<boolean>;
//   register: (userData & { password: string }) => Promise<boolean>;
//   logout: () => void;
//   updateUser: (user: User) => void;
// }

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //  const storedUser = localStorage.getItem('user')
  // }, [])
  

  const login = async (email, password, role) => {
    // Mock login - em produção, isso faria uma chamada API
    const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = mockUsers.find(
        u => u.email === email && u.role === role
    );
    console.log('@@@ mockUsers', mockUsers);
    console.log('@@@ foundUser', foundUser);
    
    if (foundUser) {
      setUser(foundUser);
      console.log('@@@ foundUser', foundUser)
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData) => {
    try {
      const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verifica se email já existe
      if (mockUsers.some((u) => u.email === userData.email)) {
        return false;
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        approved: userData.role === 'prestador' ? false : undefined,
      };

      mockUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(mockUsers));

      // Auto-login para clientes, prestadores precisam de aprovação
      if (userData.role === 'cliente') {
        const { password, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Atualiza no storage
    const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const index = mockUsers.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updatedUser };
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
