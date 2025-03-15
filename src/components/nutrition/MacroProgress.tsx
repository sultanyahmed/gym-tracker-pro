import React from 'react';
import { cn } from '../../lib/utils';

interface MacroProgressProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: 'red' | 'green' | 'yellow';
}

export default function MacroProgress({
  icon,
  label,
  current,
  target,
  unit,
  color
}: MacroProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    red: 'bg-red-200 text-red-700',
    green: 'bg-green-200 text-green-700',
    yellow: 'bg-yellow-200 text-yellow-700'
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full mb-2">
        <div
          className={cn(
            "h-full rounded-full",
            colorClasses[color].split(' ')[0].replace('200', '500')
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="text-sm text-gray-600">
        {current} / {target} {unit}
      </div>
    </div>
  );
}