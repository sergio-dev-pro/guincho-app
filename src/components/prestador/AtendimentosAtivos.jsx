import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, MapPin, User, Phone, CheckCircle2, Truck } from 'lucide-react';
// import { Solicitacao } from '../../types';

// interface Props {
//   onBack: () => void;
// }

export default function AtendimentosAtivos({ onBack }) {
  const { user } = useAuth();
  const [atendimentos, setAtendimentos] = useState([]);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);

  const loadAtendimentos = () => {
    const todasSolicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const meusAtendimentos = todasSolicitacoes
      .filter(s => s.prestadorId === user?.id && ['aceita', 'em_andamento'].includes(s.status))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setAtendimentos(meusAtendimentos);
  };

  useEffect(() => {
    loadAtendimentos();
  }, [user]);

  const handleIniciarAtendimento = (solicitacao) => {
    const todasSolicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const index = todasSolicitacoes.findIndex(s => s.id === solicitacao.id);
    
    if (index !== -1) {
      todasSolicitacoes[index] = {
        ...todasSolicitacoes[index],
        status: 'em_andamento',
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('solicitacoes', JSON.stringify(todasSolicitacoes));
      loadAtendimentos();
      setSelectedAtendimento(todasSolicitacoes[index]);
    }
  };

  const handleFinalizarAtendimento = (solicitacao) => {
    if (!confirm('Deseja realmente finalizar este atendimento?')) {
      return;
    }

    const todasSolicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const index = todasSolicitacoes.findIndex(s => s.id === solicitacao.id);
    
    if (index !== -1) {
      todasSolicitacoes[index] = {
        ...todasSolicitacoes[index],
        status: 'finalizada',
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('solicitacoes', JSON.stringify(todasSolicitacoes));
      setSelectedAtendimento(null);
      loadAtendimentos();
      alert('Atendimento finalizado com sucesso!');
    }
  };

  if (selectedAtendimento) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedAtendimento(null);
                loadAtendimentos();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Detalhes do Atendimento</h1>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-4">
          {/* Status */}
          <div className={`border-2 rounded-xl p-6 ${
            selectedAtendimento.status === 'em_andamento'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-3">
              {selectedAtendimento.status === 'em_andamento' ? (
                <Truck className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
              <div>
                <div className="font-semibold text-lg">
                  {selectedAtendimento.status === 'em_andamento'
                    ? 'Atendimento em Andamento'
                    : 'Atendimento Aceito'}
                </div>
                <div className="text-sm opacity-80">
                  {selectedAtendimento.status === 'em_andamento'
                    ? 'Você está realizando este atendimento'
                    : 'Inicie o atendimento quando chegar ao local'}
                </div>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-64 flex items-center justify-center relative">
              <MapPin className="w-12 h-12 text-blue-600" />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow text-sm max-w-[calc(100%-2rem)]">
                <div className="font-medium">Localização do Cliente</div>
                <div className="text-gray-600 text-xs truncate">
                  {selectedAtendimento.localizacao.endereco}
                </div>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Cliente</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{selectedAtendimento.clienteNome}</div>
                <div className="text-sm text-gray-600">Cliente</div>
              </div>
              <button className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Detalhes */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
            <h3 className="font-semibold mb-3">Detalhes</h3>

            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Origem</div>
                <div className="text-sm text-gray-600">{selectedAtendimento.localizacao.endereco}</div>
              </div>
            </div>

            {selectedAtendimento.destino && (
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Destino</div>
                  <div className="text-sm text-gray-600">{selectedAtendimento.destino.endereco}</div>
                </div>
              </div>
            )}

            {selectedAtendimento.descricao && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Descrição do Problema</div>
                <div className="text-sm text-gray-600">{selectedAtendimento.descricao}</div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-3">
            {selectedAtendimento.status === 'aceita' && (
              <button
                onClick={() => handleIniciarAtendimento(selectedAtendimento)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Iniciar Atendimento
              </button>
            )}

            {selectedAtendimento.status === 'em_andamento' && (
              <button
                onClick={() => handleFinalizarAtendimento(selectedAtendimento)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Finalizar Atendimento
              </button>
            )}
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
          <h1 className="font-semibold">Meus Atendimentos</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {atendimentos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum atendimento ativo</h2>
            <p className="text-gray-600">
              Você não possui atendimentos em andamento no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {atendimentos.map((atendimento) => (
              <div
                key={atendimento.id}
                onClick={() => setSelectedAtendimento(atendimento)}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{atendimento.clienteNome}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(atendimento.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    atendimento.status === 'em_andamento'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {atendimento.status === 'em_andamento' ? 'Em Andamento' : 'Aceita'}
                  </div>
                </div>

                {/* Localização */}
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="text-gray-600">{atendimento.localizacao.endereco}</div>
                  </div>

                  {atendimento.descricao && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {atendimento.descricao}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 pt-3 border-t">
                  <div className="text-sm text-blue-600 font-medium">
                    Toque para ver detalhes
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
