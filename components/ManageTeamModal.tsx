import React, { useState, useEffect } from 'react';
import { TeamMember, UserRole } from '../types';
import { XCircleIcon, TrashIcon } from './icons';

interface ManageTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (team: TeamMember[]) => void;
    currentTeam: TeamMember[];
}

const roleLabels: { [key in UserRole]: string } = {
    [UserRole.Caregiver]: 'Cuidador',
    [UserRole.Observer]: 'Acompanhante',
    [UserRole.Professional]: 'Profissional de Saúde',
};

export const ManageTeamModal: React.FC<ManageTeamModalProps> = ({ isOpen, onClose, onSave, currentTeam }) => {
    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        // Deep copy to prevent modifying the original state directly
        if (isOpen) {
            setTeam(JSON.parse(JSON.stringify(currentTeam)));
        }
    }, [currentTeam, isOpen]);
    
     useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const handleMemberChange = (id: string, field: 'name' | 'role', value: string) => {
        setTeam(prevTeam => 
            prevTeam.map(member => 
                member.id === id ? { ...member, [field]: value } : member
            )
        );
    };

    const addMember = () => {
        const newMember: TeamMember = {
            id: `team-${Date.now()}`,
            name: '',
            role: UserRole.Observer,
        };
        setTeam(prev => [...prev, newMember]);
    };

    const removeMember = (id: string) => {
        // Prevent removing the last member
        if (team.length <= 1) return;
        setTeam(prev => prev.filter(m => m.id !== id));
    };

    const handleSubmit = () => {
        // Filter out any members with empty names before saving
        const finalTeam = team.filter(member => member.name.trim() !== '');
        onSave(finalTeam);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl m-4 transform transition-all animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <style>{`
                    @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                `}</style>
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">Gerenciar Equipe de Cuidadores</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {team.map((member) => (
                        <div key={member.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 border rounded-lg bg-gray-50">
                            <div>
                                <label htmlFor={`name-${member.id}`} className="text-xs font-medium text-gray-500">Nome</label>
                                <input
                                    type="text"
                                    id={`name-${member.id}`}
                                    value={member.name}
                                    onChange={e => handleMemberChange(member.id, 'name', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nome do membro"
                                />
                            </div>
                             <div>
                                <label htmlFor={`role-${member.id}`} className="text-xs font-medium text-gray-500">Função</label>
                                <select 
                                    id={`role-${member.id}`}
                                    value={member.role} 
                                    onChange={e => handleMemberChange(member.id, 'role', e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Object.values(UserRole).map(role => (
                                        <option key={role} value={role}>{roleLabels[role]}</option>
                                    ))}
                                </select>
                             </div>
                             <div className="flex justify-end mt-4 md:mt-0">
                                <button 
                                    onClick={() => removeMember(member.id)}
                                    disabled={team.length <= 1}
                                    className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 h-10 flex items-center justify-center space-x-1 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    <TrashIcon className="w-4 h-4" /> <span>Remover</span>
                                </button>
                             </div>
                        </div>
                    ))}
                    <button onClick={addMember} className="mt-2 bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 w-full">
                        Adicionar Novo Membro
                    </button>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    >
                        Salvar Equipe
                    </button>
                </div>
            </div>
        </div>
    );
};
