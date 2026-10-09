import React from 'react';
import type { MorphologyClass } from '../../types';
import { MORPHOLOGY_COLORS } from '../../data/mockData';

interface MorphologyBadgeProps {
  morphology: MorphologyClass;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MorphologyBadge: React.FC<MorphologyBadgeProps> = ({
  morphology,
  size = 'md',
  className = '',
}) => {
  const color = MORPHOLOGY_COLORS[morphology] || '#94a3b8';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {morphology}
    </span>
  );
};

export default MorphologyBadge;
