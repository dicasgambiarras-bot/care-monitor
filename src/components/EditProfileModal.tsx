import React, { useState } from 'react';
import type { PatientProfile } from '../types';

export const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (p: PatientProfile) => void; currentProfile: PatientProfile }> = ({ isOpen, onClose, onSave, currentProfile }) => {
  const [profile, setProfile] = useState(currentProfile);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h3>Editar Perfil</h3>
        <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
        <div className="flex space-x-2">
          <button onClick={() => onSave(profile)}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
