import React from 'react';
import type { HistoryEvent } from '../types';

export const HistoryPage: React.FC<{ log: HistoryEvent[] }> = ({ log }) => {
  return (
    <div>
      <h2>Histórico</h2>
      <div className="space-y-2">
        {log.map(e => (
          <div key={e.id} className="p-2 border rounded">
            <div className="font-semibold">{e.title || e.type}</div>
            <div className="text-sm">{e.description}</div>
            <div className="text-xs text-gray-500">{e.timestamp?.toString?.() || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
