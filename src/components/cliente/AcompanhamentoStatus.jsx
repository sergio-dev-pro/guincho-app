import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, MapPin, User, Truck, Phone, Clock, CheckCircle2 } from 'lucide-react';
// import { Solicitacao } from '../../types';

// interface Props {
//   onBack: () => void;
// }

export default function AcompanhamentoStatus({ onBack }) {
  const { user } = useAuth();
  const [solicitacaoAtiva, setSolicitacaoAtiva] = useState(null);

  useEffect(() => {
    // Busca solicitação ativa do cliente
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const ativa = solicitacoes.find(
      s => s.clienteId === user?.id && ['pendente', 'aceita', 'em_andamento'].includes(s.status)
    );
    setSolicitacaoAtiva(ativa || null);
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pendente':
        return {
          color: 'yellow',
          icon: Clock,
          title: 'Aguardando Prestador',
          description: 'Procurando um prestador disponível próximo a você...',
        };
      case 'aceita':
        return {
          color: 'blue',
          icon: CheckCircle2,
          title: 'Solicitação Aceita',
          description: 'O prestador está a caminho!',
        };
      case 'em_andamento':
        return {
          color: 'green',
          icon: Truck,
          title: 'Em Andamento',
          description: 'O prestador está realizando o atendimento.',
        };
      default:
        return {
          color: 'gray',
          icon: Clock,
          title: 'Status Desconhecido',
          description: '',
        };
    }
  };

  const getStatusColor = (color) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color] || colors.gray;
  };

  if (!solicitacaoAtiva) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm sticky top-0">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Acompanhamento</h1>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma solicitação ativa</h2>
            <p className="text-gray-600 mb-6">
              Você não possui solicitações em andamento no momento.
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(solicitacaoAtiva.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Acompanhamento em Tempo Real</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        {/* Status Card */}
        <div className={`border-2 rounded-xl p-6 ${getStatusColor(statusInfo.color)}`}>
          <div className="flex items-center gap-3 mb-2">
            <StatusIcon className="w-8 h-8" />
            <div>
              <div className="font-semibold text-lg">{statusInfo.title}</div>
              <div className="text-sm opacity-80">{statusInfo.description}</div>
            </div>
          </div>
        </div>

        {/* Mapa Simulado */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-600 animate-pulse" />
            </div>
            <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow text-sm">
              <div className="font-medium">Sua Localização</div>
              <div className="text-gray-600 text-xs">{solicitacaoAtiva.localizacao.endereco}</div>
            </div>
          </div>
        </div>

        {/* Informações da Solicitação */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold">Detalhes da Solicitação</h3>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Origem</div>
                <div className="text-sm text-gray-600">{solicitacaoAtiva.localizacao.endereco}</div>
              </div>
            </div>

            {solicitacaoAtiva.destino && (
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Destino</div>
                  <div className="text-sm text-gray-600">{solicitacaoAtiva.destino.endereco}</div>
                </div>
              </div>
            )}

            {solicitacaoAtiva.descricao && (
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Descrição</div>
                  <div className="text-sm text-gray-600">{solicitacaoAtiva.descricao}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Prestador (se aceita) */}
        {solicitacaoAtiva.prestadorNome && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold">Prestador Responsável</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{solicitacaoAtiva.prestadorNome}</div>
                <div className="text-sm text-gray-600">Prestador de Serviço</div>
              </div>
              <button className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">Progresso</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="w-0.5 h-full bg-green-200 mt-1"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="font-medium text-sm">Solicitação Criada</div>
                <div className="text-xs text-gray-500">
                  {new Date(solicitacaoAtiva.createdAt).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            {solicitacaoAtiva.status !== 'pendente' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  {solicitacaoAtiva.status !== 'aceita' && (
                    <div className="w-0.5 h-full bg-green-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="font-medium text-sm">Prestador Aceitou</div>
                  <div className="text-xs text-gray-500">Atendimento confirmado</div>
                </div>
              </div>
            )}

            {solicitacaoAtiva.status === 'em_andamento' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Em Andamento</div>
                  <div className="text-xs text-gray-500">Prestador realizando atendimento</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
