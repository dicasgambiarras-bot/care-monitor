import React from 'react';
import { PatientProfile, Contact, TeamMember, UserRole } from '../types';
import { PencilIcon, UserCircleIcon, UsersIcon } from './icons';

interface PatientProfilePageProps {
  profile: PatientProfile;
  onEdit: () => void;
  onManageTeam: () => void;
  isCaregiver: boolean;
}

const ProfileCard: React.FC<{ title: string; children: React.ReactNode, actions?: React.ReactNode }> = ({ title, children, actions }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          {actions}
        </div>
        <div className="space-y-4 flex-grow">{children}</div>
    </div>
);

const ProfileDetail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-800 whitespace-pre-wrap">{value || 'Não informado'}</p>
    </div>
);

const ContactItem: React.FC<{ contact: Contact }> = ({ contact }) => (
    <div className="py-2">
        <p className="font-semibold text-gray-800">{contact.name}</p>
        <p className="text-sm text-gray-600">{contact.relationship}</p>
        <p className="text-sm text-gray-500">{contact.phone}</p>
    </div>
);

const roleLabels: { [key in UserRole]: string } = {
    [UserRole.Caregiver]: 'Cuidador',
    [UserRole.Observer]: 'Acompanhante',
    [UserRole.Professional]: 'Profissional de Saúde',
};

const TeamMemberItem: React.FC<{ member: TeamMember }> = ({ member }) => (
     <div className="py-2">
        <p className="font-semibold text-gray-800">{member.name}</p>
        <p className="text-sm text-gray-600">{roleLabels[member.role]}</p>
    </div>
)

const getAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}


export const PatientProfilePage: React.FC<PatientProfilePageProps> = ({ profile, onEdit, onManageTeam, isCaregiver }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <UserCircleIcon className="w-16 h-16 text-blue-500" />
                    <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-gray-600">{getAge(profile.birthDate)} anos, {profile.gender}</p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    disabled={!isCaregiver}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center space-x-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <PencilIcon className="w-5 h-5" />
                    <span>Editar Perfil</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <ProfileCard title="Informações Médicas">
                        <ProfileDetail label="Condição Principal" value={profile.mainCondition} />
                        <ProfileDetail label="Histórico Médico" value={profile.medicalHistory} />
                        <ProfileDetail label="Alergias" value={profile.allergies} />
                         <ProfileDetail label="Cirurgias Anteriores" value={profile.surgeries} />
                    </ProfileCard>
                </div>
                
                <div className="space-y-6">
                     <ProfileCard 
                        title="Equipe de Cuidadores"
                        actions={
                            <button
                                onClick={onManageTeam}
                                disabled={!isCaregiver}
                                className="text-sm text-blue-600 hover:text-blue-800 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                            >
                                <UsersIcon className="w-4 h-4" />
                                <span>Gerenciar</span>
                            </button>
                        }
                    >
                         <div className="divide-y">
                            {profile.team.length > 0 ? profile.team.map(member => (
                                <TeamMemberItem key={member.id} member={member} />
                            )) : <p className="text-gray-500">Nenhum membro na equipe.</p>}
                        </div>
                    </ProfileCard>

                    <ProfileCard title="Contatos de Emergência">
                        <div className="divide-y">
                            {profile.emergencyContacts.length > 0 ? profile.emergencyContacts.map(contact => (
                                <ContactItem key={contact.id} contact={contact} />
                            )) : <p className="text-gray-500">Nenhum contato de emergência.</p>}
                        </div>
                    </ProfileCard>

                     <ProfileCard title="Contatos Médicos">
                        <div className="divide-y">
                            {profile.physicianContacts.length > 0 ? profile.physicianContacts.map(contact => (
                                <ContactItem key={contact.id} contact={contact} />
                            )) : <p className="text-gray-500">Nenhum contato médico.</p>}
                        </div>
                    </ProfileCard>
                </div>
            </div>
        </div>
    );
};