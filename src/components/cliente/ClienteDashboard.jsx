import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, MapPin, Clock, LogOut, Menu } from 'lucide-react';
import NovaSolicitacao from './NovaSolicitacao';
import AcompanhamentoStatus from './AcompanhamentoStatus';
import HistoricoSolicitacoes from './HistoricoSolicitacoes';

// type View = 'home' | 'nova-solicitacao' | 'acompanhamento' | 'historico';

export default function ClienteDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'nova-solicitacao':
        return <NovaSolicitacao onBack={() => setCurrentView('home')} />;
      case 'acompanhamento':
        return <AcompanhamentoStatus onBack={() => setCurrentView('home')} />;
      case 'historico':
        return <HistoricoSolicitacoes onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="p-6 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-2">Olá, {user?.nome}!</h2>
              <p className="text-gray-600">Como podemos ajudar você hoje?</p>
            </div>

            <button
              onClick={() => setCurrentView('nova-solicitacao')}
              className="w-full bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Truck className="w-12 h-12 mx-auto mb-3" />
              <div className="text-xl font-semibold">Solicitar Guincho</div>
              <p className="text-blue-100 text-sm mt-1">Precisando de reboque agora?</p>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentView('acompanhamento')}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Acompanhar</div>
                <p className="text-xs text-gray-500 mt-1">Status em tempo real</p>
              </button>

              <button
                onClick={() => setCurrentView('historico')}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Histórico</div>
                <p className="text-xs text-gray-500 mt-1">Seus atendimentos</p>
              </button>
            </div>
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
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">GuinchoApp</div>
              <div className="text-xs text-blue-100">Cliente</div>
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
