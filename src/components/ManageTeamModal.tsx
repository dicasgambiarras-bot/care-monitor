import React, { useState } from 'react';
import type { TeamMember } from '../types';

export const ManageTeamModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (team: TeamMember[]) => void; currentTeam?: TeamMember[] }> = ({ isOpen, onClose, onSave, currentTeam = [] }) => {
  const [team, setTeam] = useState<TeamMember[]>(currentTeam);
  const [email, setEmail] = useState('');
  
  const handleAdd = () => {
    if (email.trim()) {
      setTeam([...team, { id: String(Date.now()), name: email.split('@')[0], email, role: 'caregiver' }]);
      setEmail('');
    }
  };
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">👥 Gerenciar Equipe</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email do Membro</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAdd()}
                placeholder="exemplo@email.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Membros da Equipe</h4>
          {team.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum membro adicionado.</p>
          ) : (
            <div className="space-y-2">
              {team.map(m => (
                <div
                  key={m.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-600">{m.email}</div>
                  </div>
                  <button
                    onClick={() => setTeam(team.filter(x => x.id !== m.id))}
                    className="text-red-600 hover:text-red-800 font-bold transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onSave(team)}
            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
