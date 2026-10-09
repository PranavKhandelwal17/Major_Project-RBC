import React from 'react';

interface LoadingAnimationProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  message = 'Processing...',
  size = 'md',
  className = '',
}) => {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };
  const textMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin`}
        />
        <div
          className={`absolute inset-1 rounded-full border-2 border-teal-200 border-b-teal-500 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
      </div>
      {message && (
        <p className={`text-slate-500 font-medium ${textMap[size]}`}>{message}</p>
      )}
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card p-5 ${className}`}>
    <div className="space-y-3">
      <div className="shimmer h-4 w-1/3 rounded" />
      <div className="shimmer h-8 w-2/3 rounded" />
      <div className="shimmer h-3 w-1/2 rounded" />
    </div>
  </div>
);

// Pulse dots loader
export const PulseDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

export default LoadingAnimation;
