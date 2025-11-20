import React from 'react';
import type { PatientProfile, TeamMember } from '../types';

export const PatientProfilePage: React.FC<{ profile: PatientProfile; onEdit: () => void; isCaregiver?: boolean; onManageTeam?: () => void }> = ({ profile, onEdit, isCaregiver, onManageTeam }) => {
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">👤 {profile.name}</h2>
        <p className="text-lg opacity-90">{getAge(profile.birthDate)} anos • {profile.gender}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Condição Principal</h3>
          <p className="text-gray-700">{profile.mainCondition || 'Não especificada'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Data de Nascimento</h3>
          <p className="text-gray-700">{new Date(profile.birthDate).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Histórico Médico</h3>
          <p className="text-gray-700">{profile.medicalHistory || 'Não informado'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Alergias</h3>
          <p className="text-gray-700">{profile.allergies || 'Nenhuma registrada'}</p>
        </div>
      </div>
      
      {isCaregiver && (
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            ✏️ Editar Perfil
          </button>
          <button
            onClick={onManageTeam}
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            👥 Gerenciar Equipe
          </button>
        </div>
      )}
    </div>
  );
};
