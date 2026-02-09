import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, MapPin, Clock, User, AlertCircle } from 'lucide-react';
// import { Solicitacao } from '../../types';

// interface Props {
//   onBack: () => void;
// }

export default function SolicitacoesDisponiveis({ onBack }) {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);

  const loadSolicitacoes = () => {
    const todasSolicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const disponiveis = todasSolicitacoes
      .filter(s => s.status === 'pendente')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSolicitacoes(disponiveis);
  };

  useEffect(() => {
    loadSolicitacoes();
  }, []);

  const handleAceitar = (solicitacao) => {
    const todasSolicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const index = todasSolicitacoes.findIndex(s => s.id === solicitacao.id);
    
    if (index !== -1) {
      todasSolicitacoes[index] = {
        ...todasSolicitacoes[index],
        status: 'aceita',
        prestadorId: user.id,
        prestadorNome: user.nome,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('solicitacoes', JSON.stringify(todasSolicitacoes));
      setSelectedSolicitacao(null);
      loadSolicitacoes();
      alert('Solicitação aceita com sucesso!');
    }
  };

  if (selectedSolicitacao) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSolicitacao(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Detalhes da Solicitação</h1>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-4">
          {/* Cliente Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Informações do Cliente</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">{selectedSolicitacao.clienteNome}</div>
                <div className="text-sm text-gray-600">Cliente</div>
              </div>
            </div>
          </div>

          {/* Mapa Simulado */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-64 flex items-center justify-center relative">
              <MapPin className="w-12 h-12 text-blue-600" />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow text-sm max-w-[calc(100%-2rem)]">
                <div className="font-medium">Localização do Cliente</div>
                <div className="text-gray-600 text-xs truncate">
                  {selectedSolicitacao.localizacao.endereco}
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold">Detalhes do Atendimento</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Origem</div>
                  <div className="text-sm text-gray-600">{selectedSolicitacao.localizacao.endereco}</div>
                </div>
              </div>

              {selectedSolicitacao.destino && (
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Destino</div>
                    <div className="text-sm text-gray-600">{selectedSolicitacao.destino.endereco}</div>
                  </div>
                </div>
              )}

              {selectedSolicitacao.descricao && (
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Descrição do Problema</div>
                    <div className="text-sm text-gray-600">{selectedSolicitacao.descricao}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Solicitado em</div>
                  <div className="text-sm text-gray-600">
                    {new Date(selectedSolicitacao.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedSolicitacao(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => handleAceitar(selectedSolicitacao)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Aceitar Solicitação
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
          <h1 className="font-semibold">Solicitações Disponíveis</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {solicitacoes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma solicitação disponível</h2>
            <p className="text-gray-600">
              Não há solicitações aguardando atendimento no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitacoes.map((solicitacao) => (
              <div
                key={solicitacao.id}
                onClick={() => setSelectedSolicitacao(solicitacao)}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{solicitacao.clienteNome}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(solicitacao.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Aguardando
                  </div>
                </div>

                {/* Localização */}
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="text-gray-600">{solicitacao.localizacao.endereco}</div>
                  </div>

                  {solicitacao.descricao && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {solicitacao.descricao}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 pt-3 border-t">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Ver Detalhes e Aceitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
