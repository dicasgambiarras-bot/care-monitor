import React from 'react';

export const AlertCard: React.FC<{ alert: { level: string; message: string } }> = ({ alert }) => {
  return (
    <div className="p-2 border rounded">
      <strong>{alert.level}</strong>
      <div>{alert.message}</div>
    </div>
  );
};
