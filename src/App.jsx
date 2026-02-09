import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeMockData } from './utils/mockData';
import LoginScreen from './components/LoginScreen';
import ClienteDashboard from './components/cliente/ClienteDashboard';
import PrestadorDashboard from './components/prestador/PrestadorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializa dados mock
    initializeMockData();

    // Carrega usuário salvo se existir
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        updateUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  switch (user.role) {
    case 'cliente':
      return <ClienteDashboard />;
    case 'prestador':
      return <PrestadorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <LoginScreen />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}