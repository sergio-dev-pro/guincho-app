import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft, MapPin, Navigation, AlertCircle } from "lucide-react";
import Select from "react-select";
import { estados } from "../../utils/estadosECidades";
// import { Solicitacao } from '../../types';

// interface Props {
//   onBack: () => void;
// }
function obterLocalizacaoExata() {
  console.log("@@@3");
  if ("geolocation" in navigator) {
    // Opções para aumentar a precisão
    const options = {
      enableHighAccuracy: true, // Força o uso de GPS/melhor precisão
      timeout: 100000, // Tempo limite (10 segundos)
      maximumAge: 0, // Não aceita localização em cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Latitude: ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        console.log(`Precisão: ${accuracy} metros`);

        // Exemplo: usar as coordenadas em um mapa
        // alert(`Localizado com ${accuracy}m de precisão.`);
      },
      (error) => {
        console.error("Erro ao obter localização:", error.message);
      },
      options,
    );
  } else {
    console.error("Geolocalização não suportada pelo navegador.");
  }
}
export default function NovaSolicitacao({ onBack }) {
  const { user } = useAuth();
  const [step, setStep] = useState("localizacao");
  const [formData, setFormData] = useState({
    localizacao: "",
    destino: "",
    descricao: "",
  });

  useEffect(() => {
    obterLocalizacaoExata();
  }, []);

  const handleUseCurrentLocation = () => {
    // Simula obter localização atual
    obterLocalizacaoExata();
    setFormData({
      ...formData,
      localizacao: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
    });
  };

  const handleSubmit = () => {
    const novaSolicitacao = {
      id: Date.now().toString(),
      clienteId: user.id,
      clienteNome: user.nome,
      localizacao: {
        lat: -23.5505,
        lng: -46.6333,
        endereco: formData.localizacao,
      },
      destino: formData.destino
        ? {
            lat: -23.5629,
            lng: -46.6544,
            endereco: formData.destino,
          }
        : undefined,
      descricao: formData.descricao,
      status: "pendente",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salva no localStorage
    const solicitacoes = JSON.parse(
      localStorage.getItem("solicitacoes") || "[]",
    );
    solicitacoes.push(novaSolicitacao);
    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));

    setStep("confirmacao");
  };

  if (step === "confirmacao") {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Solicitação Enviada!</h2>
          <p className="text-gray-600 mb-6">
            Estamos procurando um prestador próximo a você. Aguarde...
          </p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Nova Solicitação</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b">
        <div className="flex max-w-2xl mx-auto">
          <div
            className={`flex-1 py-3 text-center border-b-2 ${
              step === "localizacao"
                ? "border-blue-600 text-blue-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            <div className="text-sm font-medium">1. Localização</div>
          </div>
          <div
            className={`flex-1 py-3 text-center border-b-2 ${
              step === "detalhes"
                ? "border-blue-600 text-blue-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            <div className="text-sm font-medium">2. Detalhes</div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {step === "localizacao" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                Informe sua localização atual para que possamos encontrar o
                prestador mais próximo.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onde você está? *
              </label>

              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={estados[0]}
                // isDisabled={isDisabled}
                // isLoading={isLoading}
                // isClearable={isClearable}
                // isRtl={isRtl}
                isSearchable={true}
                name="color"
                options={estados}
              />

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) =>
                    setFormData({ ...formData, localizacao: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o endereço"
                />
              </div>
              <button
                onClick={handleUseCurrentLocation}
                className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Navigation className="w-4 h-4" />
                Usar minha localização atual
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para onde deseja ir? (opcional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.destino}
                  onChange={(e) =>
                    setFormData({ ...formData, destino: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o endereço de destino"
                />
              </div>
            </div>

            <button
              onClick={() => setStep("detalhes")}
              disabled={!formData.localizacao}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {step === "detalhes" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descreva o problema
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Ex: Pneu furado, bateria descarregada, motor não liga..."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Resumo da Solicitação
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Origem:</div>
                    <div>{formData.localizacao}</div>
                  </div>
                </div>
                {formData.destino && (
                  <div className="flex gap-2 mt-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Destino:</div>
                      <div>{formData.destino}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("localizacao")}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Solicitar Guincho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
