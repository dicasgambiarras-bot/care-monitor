import React, { useState } from 'react';
import type { PatientProfile } from '../types';

export const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (p: PatientProfile) => void; currentProfile: PatientProfile }> = ({ isOpen, onClose, onSave, currentProfile }) => {
  const [profile, setProfile] = useState(currentProfile);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">✏️ Editar Perfil do Paciente</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        {/* Foto Placeholder */}
        <div className="flex justify-center mb-6">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl border-4 border-white shadow-md">
                    👤
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-sm hover:bg-blue-700" title="Alterar foto (Em breve)">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Nascimento</label>
             <input
              type="date"
              value={profile.birthDate}
              onChange={e => setProfile({...profile, birthDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gênero</label>
            <select 
                value={profile.gender}
                onChange={e => setProfile({...profile, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Condição Principal</label>
            <input
              type="text"
              value={profile.mainCondition}
              onChange={e => setProfile({...profile, mainCondition: e.target.value})}
              placeholder="Ex: Pós-AVC Isquêmico, Alzheimer, Pós-Infarto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Isso ajuda a IA a dar alertas mais precisos.</p>
          </div>

           <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">⚠️ Alergias</label>
            <textarea
              value={profile.allergies}
              onChange={e => setProfile({...profile, allergies: e.target.value})}
              placeholder="Ex: Dipirona, Penicilina, Iodo..."
              className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
              rows={2}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Histórico Médico (Resumo)</label>
            <textarea
              value={profile.medicalHistory}
              onChange={e => setProfile({...profile, medicalHistory: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-8 border-t pt-4">
          <button
            onClick={() => onSave(profile)}
            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Salvar Alterações
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};