import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Truck, Shield, Search, Filter } from 'lucide-react';
// import { User as UserType, UserRole } from '../../types';

// interface Props {
//   onBack: () => void;
// }

export default function VisualizacaoUsuarios({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [roleFilter, setRoleFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUsuarios(users);
    setFilteredUsuarios(users);
  }, []);

  useEffect(() => {
    let filtered = usuarios;

    // Filtro por role
    if (roleFilter !== 'todos') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsuarios(filtered);
  }, [roleFilter, searchTerm, usuarios]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'cliente':
        return User;
      case 'prestador':
        return Truck;
      case 'admin':
        return Shield;
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'cliente':
        return 'Cliente';
      case 'prestador':
        return 'Prestador';
      case 'admin':
        return 'Admin';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'cliente':
        return 'bg-blue-100 text-blue-800';
      case 'prestador':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getStats = () => {
    return {
      total: usuarios.length,
      clientes: usuarios.filter(u => u.role === 'cliente').length,
      prestadores: usuarios.filter(u => u.role === 'prestador').length,
      admins: usuarios.filter(u => u.role === 'admin').length,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Usuários Cadastrados</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-900">{stats.clientes}</div>
            <div className="text-xs text-blue-700">Clientes</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-900">{stats.prestadores}</div>
            <div className="text-xs text-green-700">Prestadores</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-900">{stats.admins}</div>
            <div className="text-xs text-purple-700">Admins</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {['todos', 'cliente', 'prestador', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === role
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {role === 'todos' ? 'Todos' : getRoleName(role)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="space-y-3">
          {filteredUsuarios.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-1">Nenhum usuário encontrado</h3>
              <p className="text-sm text-gray-600">
                Tente ajustar os filtros de busca.
              </p>
            </div>
          ) : (
            filteredUsuarios.map((usuario) => {
              const RoleIcon = getRoleIcon(usuario.role);
              return (
                <div key={usuario.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      usuario.role === 'cliente' ? 'bg-blue-100' :
                      usuario.role === 'prestador' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      <RoleIcon className={`w-6 h-6 ${
                        usuario.role === 'cliente' ? 'text-blue-600' :
                        usuario.role === 'prestador' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-gray-900">{usuario.nome}</div>
                          <div className="text-sm text-gray-600">{usuario.email}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRoleBadgeColor(usuario.role)}`}>
                          {getRoleName(usuario.role)}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <div>{usuario.telefone}</div>
                        <div>•</div>
                        <div>Desde {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</div>
                      </div>

                      {usuario.role === 'prestador' && (
                        <div className="mt-2 flex items-center gap-2">
                          {usuario.approved ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              ✓ Aprovado
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              ⏳ Pendente
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
