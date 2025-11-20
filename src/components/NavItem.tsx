import React from 'react';

export const NavItem: React.FC<{ label: string; icon?: React.ReactNode; isActive?: boolean; onClick?: () => void }> = ({ label, icon, isActive, onClick }) => {
  return (
    <button onClick={onClick} className={`${isActive ? 'bg-blue-600 text-white' : ''} px-3 py-2 rounded`}>
      {icon} <span>{label}</span>
    </button>
  );
};
