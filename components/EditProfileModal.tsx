import React, { useState, useEffect } from 'react';
import { PatientProfile, Contact } from '../types';
import { XCircleIcon, TrashIcon } from './icons';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: PatientProfile) => void;
    currentProfile: PatientProfile;
}

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
);

const TextAreaField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, name, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
);

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, currentProfile }) => {
    const [profile, setProfile] = useState(currentProfile);

    useEffect(() => {
        // Deep copy to prevent modifying the original state directly
        setProfile(JSON.parse(JSON.stringify(currentProfile)));
    }, [currentProfile, isOpen]);
    
     useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };
    
    const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, contactType: 'emergencyContacts' | 'physicianContacts') => {
        const { name, value } = e.target;
        const newContacts = [...profile[contactType]];
        newContacts[index] = { ...newContacts[index], [name]: value };
        setProfile(prev => ({ ...prev, [contactType]: newContacts }));
    };

    const addContact = (contactType: 'emergencyContacts' | 'physicianContacts') => {
        const newContact: Contact = {
            id: `contact-${Date.now()}`,
            name: '',
            relationship: '',
            phone: '',
        };
        setProfile(prev => ({
            ...prev,
            [contactType]: [...prev[contactType], newContact]
        }));
    };

    const removeContact = (id: string, contactType: 'emergencyContacts' | 'physicianContacts') => {
        setProfile(prev => ({
            ...prev,
            [contactType]: prev[contactType].filter(c => c.id !== id)
        }));
    };

    const handleSubmit = () => {
        onSave(profile);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start py-10" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 transform transition-all animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <style>{`
                    @keyframes fade-in-up {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                `}</style>
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 -mt-6 -mx-6 px-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Editar Perfil do Paciente</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Dados Pessoais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Nome Completo" name="name" value={profile.name} onChange={handleChange} />
                            <InputField label="Data de Nascimento" name="birthDate" value={profile.birthDate} onChange={handleChange} type="date" />
                             <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                                <select id="gender" name="gender" value={profile.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option>Masculino</option>
                                    <option>Feminino</option>
                                    <option>Outro</option>
                                </select>
                             </div>
                        </div>
                    </fieldset>
                    
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Histórico de Saúde</legend>
                        <div className="space-y-4">
                           <TextAreaField label="Condição Principal" name="mainCondition" value={profile.mainCondition} onChange={handleChange} />
                           <TextAreaField label="Histórico Médico" name="medicalHistory" value={profile.medicalHistory} onChange={handleChange} />
                           <TextAreaField label="Alergias" name="allergies" value={profile.allergies} onChange={handleChange} />
                           <TextAreaField label="Cirurgias Anteriores" name="surgeries" value={profile.surgeries} onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Contatos de Emergência</legend>
                        <div className="space-y-4">
                            {profile.emergencyContacts.map((contact, index) => (
                                <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-2 border-b">
                                    <InputField label="Nome" name="name" value={contact.name} onChange={e => handleContactChange(index, e, 'emergencyContacts')} />
                                    <InputField label="Parentesco" name="relationship" value={contact.relationship} onChange={e => handleContactChange(index, e, 'emergencyContacts')} />
                                    <InputField label="Telefone" name="phone" value={contact.phone} onChange={e => handleContactChange(index, e, 'emergencyContacts')} type="tel"/>
                                    <button onClick={() => removeContact(contact.id, 'emergencyContacts')} className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 h-10 flex items-center justify-center space-x-1"><TrashIcon className="w-4 h-4" /> <span>Remover</span></button>
                                </div>
                            ))}
                            <button onClick={() => addContact('emergencyContacts')} className="mt-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Adicionar Contato de Emergência
                            </button>
                        </div>
                    </fieldset>

                     <fieldset className="p-4 border rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Contatos Médicos</legend>
                        <div className="space-y-4">
                            {profile.physicianContacts.map((contact, index) => (
                                <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-2 border-b">
                                    <InputField label="Nome" name="name" value={contact.name} onChange={e => handleContactChange(index, e, 'physicianContacts')} />
                                    <InputField label="Especialidade" name="relationship" value={contact.relationship} onChange={e => handleContactChange(index, e, 'physicianContacts')} />
                                    <InputField label="Telefone" name="phone" value={contact.phone} onChange={e => handleContactChange(index, e, 'physicianContacts')} type="tel"/>
                                    <button onClick={() => removeContact(contact.id, 'physicianContacts')} className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 h-10 flex items-center justify-center space-x-1"><TrashIcon className="w-4 h-4" /> <span>Remover</span></button>
                                </div>
                            ))}
                            <button onClick={() => addContact('physicianContacts')} className="mt-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Adicionar Contato Médico
                            </button>
                        </div>
                    </fieldset>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};