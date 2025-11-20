import React from 'react';
import type { HistoryEvent } from '../types';

export const HistoryPage: React.FC<{ log: HistoryEvent[] }> = ({ log }) => {
  const typeIcons: { [key: string]: string } = {
    alert: '⚠️',
    schedule_completed: '✅',
    metric_added: '📊',
    note: '📝',
    appointment: '📅',
  };
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📋 Histórico</h1>
      
      {log.length === 0 && (
        <div className="text-center p-6 sm:p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-base sm:text-lg">Nenhum evento registrado.</p>
        </div>
      )}
      
      <div className="space-y-2 sm:space-y-3">
        {log.map(e => (
          <div key={e.id} className="p-3 sm:p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg flex-shrink-0">{typeIcons[e.type] || '📌'}</span>
                  <div className="font-semibold text-gray-800 truncate">{e.title || e.type}</div>
                </div>
                {e.description && <div className="text-xs sm:text-sm text-gray-600 ml-6 break-words">{e.description}</div>}
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0 sm:ml-2 sm:text-right">
                {e.timestamp instanceof Date
                  ? e.timestamp.toLocaleString('pt-BR')
                  : e.timestamp?.toString?.() || ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
