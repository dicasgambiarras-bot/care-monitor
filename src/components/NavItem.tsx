import React from 'react';

export const NavItem: React.FC<{ label: string; icon?: React.ReactNode; isActive?: boolean; onClick?: () => void }> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
