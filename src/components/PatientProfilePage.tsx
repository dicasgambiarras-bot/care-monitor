import React from 'react';
import type { PatientProfile, TeamMember } from '../types';

export const PatientProfilePage: React.FC<{ profile: PatientProfile; onEdit: () => void; isCaregiver?: boolean; onManageTeam?: () => void }> = ({ profile, onEdit, isCaregiver, onManageTeam }) => {
  return (
    <div className="p-4 bg-white rounded">
      <h2 className="text-xl font-bold">Perfil</h2>
      <div>Nome: {profile.name}</div>
      <div>Data Nasc: {profile.birthDate}</div>
      {isCaregiver && <div className="mt-2"><button onClick={onEdit}>Editar</button> <button onClick={onManageTeam}>Equipe</button></div>}
    </div>
  );
};
