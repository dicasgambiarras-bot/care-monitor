import React from 'react';
import type { HealthMetric } from '../types';

export const MetricCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
  const displayValue = typeof metric.value === 'number' ? metric.value : JSON.stringify(metric.value);
  return (
    <div className="p-3 border rounded">
      <div className="text-sm text-gray-600 capitalize">{metric.type}</div>
      <div className="text-xl font-bold">{displayValue} <span className="text-xs">{metric.unit}</span></div>
      <div className="text-xs text-gray-400">{metric.timestamp.toString()}</div>
    </div>
  );
};
