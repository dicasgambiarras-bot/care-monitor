import React from 'react';
import { UrgentService } from '../types';
import { PhoneIcon } from './icons';

interface UrgentContactsBarProps {
  services: UrgentService[];
}

export const UrgentContactsBar: React.FC<UrgentContactsBarProps> = ({ services }) => {
  return (
    <div className="bg-red-600 text-white z-20">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center md:justify-end space-x-4 md:space-x-6">
        <span className="hidden md:block font-bold text-sm uppercase">Emergência:</span>
        {services.map(service => (
          <a
            key={service.name}
            href={`tel:${service.phone}`}
            className="flex items-center space-x-2 text-sm font-semibold hover:bg-red-700 p-2 rounded-md transition-colors"
          >
            <PhoneIcon className="w-4 h-4" />
            <span>{service.name} <span className="font-bold">{service.phone}</span></span>
          </a>
        ))}
      </div>
    </div>
  );
};
