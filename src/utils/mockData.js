// import { User, Solicitacao, Prestador } from '../types';

export function initializeMockData() {
  // Verifica se já existem dados
  const existingUsers = localStorage.getItem("users");
  const existingSolicitacoes = localStorage.getItem("solicitacoes");
  console.log("@@@existingUsers", existingUsers);
  // Inicializa usuários mock se não existirem
  const mockUsers = [
    // Admin
    {
      id: "admin-1",
      nome: "Administrador",
      email: "admin@guincho.com",
      telefone: "(11) 99999-9999",
      role: "admin",
      createdAt: new Date("2024-01-01").toISOString(),
    },
    // Clientes
    {
      id: "cliente-1",
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "(11) 98888-8888",
      role: "cliente",
      createdAt: new Date("2024-01-15").toISOString(),
    },
    {
      id: "cliente-2",
      nome: "Maria Santos",
      email: "maria@example.com",
      telefone: "(11) 97777-7777",
      role: "cliente",
      createdAt: new Date("2024-02-01").toISOString(),
    },
    // Prestadores aprovados
    {
      id: "prestador-1",
      nome: "Carlos Reboque",
      email: "carlos@guincho.com",
      telefone: "(11) 96666-6666",
      role: "prestador",
      veiculo: "Caminhão Guincho Mercedes",
      placa: "ABC-1234",
      approved: true,
      createdAt: new Date("2024-01-10").toISOString(),
    },
    {
      id: "prestador-2",
      nome: "Pedro Guincho",
      email: "pedro@guincho.com",
      telefone: "(11) 95555-5555",
      role: "prestador",
      veiculo: "Caminhão Plataforma",
      placa: "XYZ-5678",
      approved: true,
      createdAt: new Date("2024-01-20").toISOString(),
    },
    // Prestador pendente
    {
      id: "prestador-3",
      nome: "Roberto Serviços",
      email: "roberto@guincho.com",
      telefone: "(11) 94444-4444",
      role: "prestador",
      veiculo: "Caminhão Guincho Iveco",
      placa: "DEF-9012",
      approved: false,
      createdAt: new Date("2024-02-05").toISOString(),
    },
  ];

  if (!existingUsers) {
    localStorage.setItem("users", JSON.stringify(mockUsers));
  }

  // Inicializa solicitações mock se não existirem
  const mockSolicitacoes = [
    // Solicitação finalizada
    {
      id: "sol-1",
      clienteId: "cliente-1",
      clienteNome: "João Silva",
      prestadorId: "prestador-1",
      prestadorNome: "Carlos Reboque",
      localizacao: {
        lat: -23.5505,
        lng: -46.6333,
        endereco: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
      },
      destino: {
        lat: -23.5629,
        lng: -46.6544,
        endereco: "Rua da Consolação, 930 - Consolação, São Paulo - SP",
      },
      descricao: "Pneu furado, não consigo trocar sozinho",
      status: "finalizada",
      createdAt: new Date("2024-02-01T10:30:00").toISOString(),
      updatedAt: new Date("2024-02-01T12:15:00").toISOString(),
    },
    // Solicitação em andamento
    {
      id: "sol-2",
      clienteId: "cliente-2",
      clienteNome: "Maria Santos",
      prestadorId: "prestador-2",
      prestadorNome: "Pedro Guincho",
      localizacao: {
        lat: -23.5629,
        lng: -46.6544,
        endereco: "Av. Brasil, 2000 - Jardins, São Paulo - SP",
      },
      destino: {
        lat: -23.588,
        lng: -46.632,
        endereco: "Rua Augusta, 1500 - Consolação, São Paulo - SP",
      },
      descricao: "Motor não liga, bateria descarregada",
      status: "em_andamento",
      createdAt: new Date("2024-02-04T14:00:00").toISOString(),
      updatedAt: new Date("2024-02-04T14:30:00").toISOString(),
    },
    // Solicitação pendente
    {
      id: "sol-3",
      clienteId: "cliente-1",
      clienteNome: "João Silva",
      localizacao: {
        lat: -23.588,
        lng: -46.632,
        endereco: "Rua Oscar Freire, 500 - Jardins, São Paulo - SP",
      },
      descricao: "Carro não liga, preciso ir para a oficina",
      status: "pendente",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  if (!existingSolicitacoes) {
    localStorage.setItem("solicitacoes", JSON.stringify(mockSolicitacoes));
  }
}
