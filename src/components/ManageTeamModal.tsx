import React, { useState } from 'react';
import type { TeamMember, UserRole } from '../types';

export const ManageTeamModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (team: TeamMember[]) => void; currentTeam?: TeamMember[] }> = ({ isOpen, onClose, onSave, currentTeam = [] }) => {
  const [team, setTeam] = useState<TeamMember[]>(currentTeam);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('caregiver');
  
  const handleAdd = () => {
    if (email.trim() && name.trim()) {
      setTeam([...team, { 
          id: String(Date.now()), 
          name, 
          email: email.toLowerCase().trim(), 
          role,
          joinedAt: new Date() 
      }]);
      setEmail('');
      setName('');
      setRole('caregiver');
    }
  };
  
  const translateRole = (r: string) => {
      if (r === 'caregiver') return 'Cuidador (Edita)';
      if (r === 'professional') return 'Profissional (Vê)';
      if (r === 'observer') return 'Observador (Vê)';
      return r;
  }
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">👥 Equipe de Cuidados</h3>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">Adicionar Membro</h4>
            <div className="space-y-3">
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nome (ex: Dr. Silva, Tia Maria)"
                    className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email de Login"
                    className="w-full px-3 py-2 border rounded-lg"
                />
                <select 
                    value={role} 
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                    <option value="caregiver">Cuidador (Pode registrar dados)</option>
                    <option value="professional">Profissional de Saúde (Visualiza)</option>
                    <option value="observer">Familiar/Observador (Visualiza)</option>
                </select>
                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
                >
                    + Adicionar à Equipe
                </button>
            </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Membros Atuais</h4>
          {team.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">Apenas você.</p>
          ) : (
            <div className="space-y-2">
              {team.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                  <div>
                    <div className="font-semibold text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-600">{m.email} • {translateRole(m.role)}</div>
                  </div>
                  <button onClick={() => setTeam(team.filter(x => x.id !== m.id))} className="text-red-500 font-bold">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onSave(team)} className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg">Salvar Equipe</button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg">Fechar</button>
        </div>
      </div>
    </div>
  );
};