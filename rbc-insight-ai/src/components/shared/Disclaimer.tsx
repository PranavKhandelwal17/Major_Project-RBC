import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg ${className}`}>
        <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Disclaimer:</span> AI-generated analysis is not a medical diagnosis.
          Results should be reviewed by a qualified healthcare professional.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl ${className}`}>
      <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mt-0.5">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-800 mb-1">
          Research &amp; Educational Purposes Only
        </p>
        <p className="text-xs text-amber-700 leading-relaxed">
          This AI-powered tool is designed for research and educational demonstration only. It does{' '}
          <span className="font-semibold">not</span> constitute a medical diagnosis, clinical
          recommendation, or substitute for professional medical judgment. All results must be
          reviewed and interpreted by a qualified healthcare professional using appropriate laboratory
          and patient information.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
