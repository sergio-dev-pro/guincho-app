import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, MapPin, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';
// import { Solicitacao } from '../../types';

// interface Props {
//   onBack: () => void;
// }

export default function HistoricoSolicitacoes({ onBack }) {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    // Busca todas as solicitações do cliente
    const todasSolicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const minhasSolicitacoes = todasSolicitacoes
      .filter(s => s.clienteId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSolicitacoes(minhasSolicitacoes);
  }, [user]);

  const getStatusBadge = (status) => {
    const configs = {
      pendente: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pendente',
        icon: Clock,
      },
      aceita: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Aceita',
        icon: CheckCircle2,
      },
      em_andamento: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Em Andamento',
        icon: Truck,
      },
      finalizada: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Finalizada',
        icon: CheckCircle2,
      },
      cancelada: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Cancelada',
        icon: XCircle,
      },
    };
    return configs[status] || configs.pendente;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Histórico de Solicitações</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {solicitacoes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma solicitação</h2>
            <p className="text-gray-600">
              Você ainda não fez nenhuma solicitação de guincho.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitacoes.map((solicitacao) => {
              const statusConfig = getStatusBadge(solicitacao.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={solicitacao.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} text-xs font-medium flex items-center gap-1`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(solicitacao.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-700">Origem</div>
                        <div className="text-gray-600">{solicitacao.localizacao.endereco}</div>
                      </div>
                    </div>

                    {solicitacao.destino && (
                      <div className="flex gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-700">Destino</div>
                          <div className="text-gray-600">{solicitacao.destino.endereco}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Descrição */}
                  {solicitacao.descricao && (
                    <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                      {solicitacao.descricao}
                    </div>
                  )}

                  {/* Prestador */}
                  {solicitacao.prestadorNome && (
                    <div className="flex items-center gap-2 pt-3 border-t text-sm">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Prestador:</span>
                      <span className="font-medium">{solicitacao.prestadorNome}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
