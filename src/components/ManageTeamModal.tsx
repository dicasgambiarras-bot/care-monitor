import React, { useState } from 'react';
import type { TeamMember } from '../types';

export const ManageTeamModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (team: TeamMember[]) => void; currentTeam?: TeamMember[] }> = ({ isOpen, onClose, onSave, currentTeam = [] }) => {
  const [team, setTeam] = useState<TeamMember[]>(currentTeam);
  const [email, setEmail] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h3>Gerenciar Equipe</h3>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <button onClick={() => { setTeam([...team, { id: String(Date.now()), name: email.split('@')[0], email, role: 'caregiver' as any }]); setEmail(''); }}>Adicionar</button>
        <div className="space-y-2 mt-2">
          {team.map(m => (
            <div key={m.id} className="flex justify-between">
              <div>{m.name} ({m.email})</div>
              <button onClick={() => setTeam(team.filter(x => x.id !== m.id))}>Remover</button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2 mt-2">
          <button onClick={() => onSave(team)}>Salvar</button>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};
