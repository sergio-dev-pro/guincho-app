import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, LogOut, Menu, Users, UserCheck } from 'lucide-react';
import AprovacaoPrestadores from './AprovacaoPrestadores';
import VisualizacaoUsuarios from './VisualizacaoUsuarios';

// type View = 'home' | 'aprovacao' | 'usuarios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'aprovacao':
        return <AprovacaoPrestadores onBack={() => setCurrentView('home')} />;
      case 'usuarios':
        return <VisualizacaoUsuarios onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="p-6 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-2">Painel Administrativo</h2>
              <p className="text-gray-600">Gerencie prestadores e usuários da plataforma</p>
            </div>

            <button
              onClick={() => setCurrentView('aprovacao')}
              className="w-full bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              <UserCheck className="w-12 h-12 mx-auto mb-3" />
              <div className="text-xl font-semibold">Aprovação de Prestadores</div>
              <p className="text-blue-100 text-sm mt-1">Analise e aprove novos prestadores</p>
            </button>

            <button
              onClick={() => setCurrentView('usuarios')}
              className="w-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-blue-100"
            >
              <Users className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <div className="text-xl font-semibold text-gray-900">Visualizar Usuários</div>
              <p className="text-gray-600 text-sm mt-1">Veja todos os usuários cadastrados</p>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">GuinchoApp</div>
              <div className="text-xs text-blue-100">Administrador</div>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Menu Dropdown */}
      {menuOpen && (
        <div className="bg-white shadow-lg max-w-2xl mx-auto">
          <button
            onClick={logout}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto pb-6">
        {renderView()}
      </div>
    </div>
  );
}
