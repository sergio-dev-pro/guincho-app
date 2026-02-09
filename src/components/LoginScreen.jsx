import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Truck, User, Shield } from "lucide-react";

export default function LoginScreen() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState();
  const [confirmedRole, setConfirmedRole] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    telefone: "",
    veiculo: "",
    placa: "",
  });
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const success = await login(formData.email, formData.password, role);
      if (!success) {
        setError("Email ou senha inválidos");
      }
    } else {
      // Validações
      if (
        !formData.nome ||
        !formData.email ||
        !formData.password ||
        !formData.telefone
      ) {
        setError("Preencha todos os campos obrigatórios");
        return;
      }

      if (role === "prestador" && (!formData.veiculo || !formData.placa)) {
        setError("Preencha os dados do veículo");
        return;
      }

      const userData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        role: role,
        password: formData.password,
      };

      if (role === "prestador") {
        userData.veiculo = formData.veiculo;
        userData.placa = formData.placa;
      }

      const success = await register(userData);
      if (!success) {
        setError("Email já cadastrado");
      } else if (role === "prestador") {
        setError("");
        alert("Cadastro realizado! Aguarde aprovação do administrador.");
        setMode("login");
      }
    }
  };

  const roleIcons = {
    cliente: User,
    prestador: Truck,
    admin: Shield,
  };

  const roleNames = {
    cliente: "Solicitar guincho",
    prestador: "Prestar serviço",
    admin: "Administrador",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">GuinchoApp</h1>
          <p className="text-blue-100 text-sm mt-1">Assistência 24 horas</p>
        </div>

        <div className="p-6">
          {/* Se regra não existir */}
          {!role || !confirmedRole ? (
            <>
              {/* <h2 className="text-2xl text-center pb-4 text-gray-600">
                O que deseja?
              </h2> */}
              {/* Role Selection */}
              <div className="grid  gap-2 mb-3">
                {["cliente", "prestador", "admin"].map((r) => {
                  const Icon = roleIcons[r];
                  return (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        role === r
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-1 ${role === r ? "text-blue-600" : "text-gray-400"}`}
                      />
                      <div
                        className={`text-xs font-medium ${role === r ? "text-blue-600" : "text-gray-600"}`}
                      >
                        {roleNames[r]}
                      </div>
                    </button>
                  );
                })}
              </div>
              {role && !confirmedRole && (
                <button
                  onClick={() => {
                    setConfirmedRole(true);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {"Continuar"}
                </button>
              )}
            </>
          ) : (
            <div className="grid  gap-2 mb-3">
              {[role].map((r) => {
                const Icon = roleIcons[r];
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === r
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-1 ${role === r ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <div
                      className={`text-xs font-medium ${role === r ? "text-blue-600" : "text-gray-600"}`}
                    >
                      {roleNames[r]}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {role && confirmedRole && (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6 mt-6">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === "login"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === "register"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Cadastrar
                </button>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) =>
                          setFormData({ ...formData, nome: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    {role === "prestador" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Veículo
                          </label>
                          <input
                            type="text"
                            value={formData.veiculo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                veiculo: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Caminhão Guincho"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Placa
                          </label>
                          <input
                            type="text"
                            value={formData.placa}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                placa: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ABC-1234"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {mode === "login" ? "Entrar" : "Cadastrar"}
                </button>
              </form>
            </>
          )}

          {mode === "login" && role === "admin" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p className="font-medium">Acesso Admin de Teste:</p>
              <p>Email: admin@guincho.com</p>
              <p>Senha: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
