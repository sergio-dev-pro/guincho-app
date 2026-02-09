import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Truck, CheckCircle2, XCircle, Phone, Mail } from 'lucide-react';
// import { Prestador, User as UserType } from '../../types';

// interface Props {
//   onBack: () => void;
// }

export default function AprovacaoPrestadores({ onBack }) {
  const [prestadoresPendentes, setPrestadoresPendentes] = useState([]);
  const [selectedPrestador, setSelectedPrestador] = useState(null);

  const loadPrestadores = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const pendentes = users.filter(
      (u) => u.role === 'prestador' && u.approved === false
    );
    setPrestadoresPendentes(pendentes);
  };

  useEffect(() => {
    loadPrestadores();
  }, []);

  const handleAprovar = (prestador) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === prestador.id);
    
    if (index !== -1) {
      users[index] = { ...users[index], approved: true };
      localStorage.setItem('users', JSON.stringify(users));
      setSelectedPrestador(null);
      loadPrestadores();
      alert(`Prestador ${prestador.nome} aprovado com sucesso!`);
    }
  };

  const handleRejeitar = (prestador) => {
    if (!confirm(`Deseja realmente rejeitar o prestador ${prestador.nome}?`)) {
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.id !== prestador.id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    setSelectedPrestador(null);
    loadPrestadores();
    alert(`Prestador ${prestador.nome} rejeitado.`);
  };

  if (selectedPrestador) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPrestador(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Detalhes do Prestador</h1>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-4">
          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedPrestador.nome}</h2>
                <div className="text-sm text-gray-600">Prestador de Serviço</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium">{selectedPrestador.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Telefone</div>
                  <div className="font-medium">{selectedPrestador.telefone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Veículo</div>
                  <div className="font-medium">{selectedPrestador.veiculo}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-gray-400 font-bold">#</span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Placa</div>
                  <div className="font-medium">{selectedPrestador.placa}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-xs text-gray-500">Data de Cadastro</div>
                <div className="font-medium">
                  {new Date(selectedPrestador.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={() => handleRejeitar(selectedPrestador)}
              className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Rejeitar
            </button>
            <button
              onClick={() => handleAprovar(selectedPrestador)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Aprovar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Aprovação de Prestadores</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {prestadoresPendentes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma solicitação pendente</h2>
            <p className="text-gray-600">
              Não há prestadores aguardando aprovação no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prestadoresPendentes.map((prestador) => (
              <div
                key={prestador.id}
                onClick={() => setSelectedPrestador(prestador)}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-lg">{prestador.nome}</div>
                      <div className="text-sm text-gray-600">{prestador.email}</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Pendente
                  </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Veículo</div>
                    <div className="text-sm font-medium text-gray-900">{prestador.veiculo}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Placa</div>
                    <div className="text-sm font-medium text-gray-900">{prestador.placa}</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-3 border-t">
                  <div className="text-sm text-blue-600 font-medium">
                    Toque para analisar e aprovar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
