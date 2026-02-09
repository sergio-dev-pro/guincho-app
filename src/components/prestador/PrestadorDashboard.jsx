import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, LogOut, Menu, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
// import { Prestador } from '../../types';
import SolicitacoesDisponiveis from './SolicitacoesDisponiveis';
import AtendimentosAtivos from './AtendimentosAtivos';

// type View = 'home' | 'disponiveis' | 'ativos';

export default function PrestadorDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    // Verifica se o prestador está aprovado
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const prestador = users.find((u) => u.id === user?.id);
    setIsApproved(prestador?.approved || false);
  }, [user]);

  const renderView = () => {
    if (!isApproved) {
      return (
        <div className="p-6">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Aguardando Aprovação</h3>
                <p className="text-sm text-yellow-800">
                  Seu cadastro está em análise. Assim que for aprovado pelo administrador, 
                  você poderá começar a receber solicitações de guincho.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-3">Informações do Cadastro</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Nome:</span>
                <span className="ml-2 font-medium">{user?.nome}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Telefone:</span>
                <span className="ml-2 font-medium">{user?.telefone}</span>
              </div>
              {user?.veiculo && (
                <div>
                  <span className="text-gray-600">Veículo:</span>
                  <span className="ml-2 font-medium">{user.veiculo}</span>
                </div>
              )}
              {user?.placa && (
                <div>
                  <span className="text-gray-600">Placa:</span>
                  <span className="ml-2 font-medium">{user.placa}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'disponiveis':
        return <SolicitacoesDisponiveis onBack={() => setCurrentView('home')} />;
      case 'ativos':
        return <AtendimentosAtivos onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="p-6 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-2">Olá, {user?.nome}!</h2>
              <p className="text-gray-600">Pronto para atender clientes?</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Disponível para atendimentos</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('disponiveis')}
              className="w-full bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Clock className="w-12 h-12 mx-auto mb-3" />
              <div className="text-xl font-semibold">Solicitações Disponíveis</div>
              <p className="text-blue-100 text-sm mt-1">Veja as solicitações aguardando atendimento</p>
            </button>

            <button
              onClick={() => setCurrentView('ativos')}
              className="w-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-blue-100"
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <div className="text-xl font-semibold text-gray-900">Meus Atendimentos</div>
              <p className="text-gray-600 text-sm mt-1">Gerencie seus atendimentos em andamento</p>
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
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">GuinchoApp</div>
              <div className="text-xs text-blue-100">Prestador</div>
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
