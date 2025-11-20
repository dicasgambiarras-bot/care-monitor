import React from 'react';
import type { UrgentService } from '../types';

export const UrgentContactsBar: React.FC<{ services: UrgentService[] }> = ({ services }) => {
  return (
    <div className="bg-red-600 text-white p-2">
      <div className="container mx-auto flex gap-4">
        {services.map(s => (
          <a key={s.name} href={`tel:${s.phone}`} className="px-3 py-1 rounded bg-red-700">{s.name}: {s.phone}</a>
        ))}
      </div>
    </div>
  );
};
