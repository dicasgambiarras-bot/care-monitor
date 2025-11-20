import React from 'react';

export const AlertCard: React.FC<{ alert: { level: string; message: string } }> = ({ alert }) => {
  const levelConfig: { [key: string]: { bg: string; border: string; icon: string } } = {
    critical: { bg: 'bg-red-50', border: 'border-red-400', icon: '🔴' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: '🟡' },
    info: { bg: 'bg-blue-50', border: 'border-blue-400', icon: '🔵' },
  };
  
  const config = levelConfig[alert.level] || levelConfig.info;
  
  return (
    <div className={`p-3 sm:p-4 border-l-4 rounded-lg ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="text-base sm:text-lg flex-shrink-0">{config.icon}</span>
        <div className="min-w-0 flex-1">
          <strong className="text-xs sm:text-sm uppercase font-semibold block">{alert.level}</strong>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">{alert.message}</p>
        </div>
      </div>
    </div>
  );
};
