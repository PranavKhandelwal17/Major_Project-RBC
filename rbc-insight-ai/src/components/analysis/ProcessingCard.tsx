import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Sliders } from 'lucide-react';
import type { AnalysisResult } from '../../types';
import { MOCK_PROCESSED_IMAGE, MOCK_RBC_IMAGE } from '../../data/mockData';

interface ProcessingCardProps {
  preprocessing: AnalysisResult['preprocessing'];
  originalImageUrl: string;
  processedImageUrl?: string;
}

const ops = [
  { label: 'Resize to 224×224', key: 'resize' as const },
  { label: 'Normalization', key: 'normalization' as const },
  { label: 'Contrast Enhancement', key: 'contrastEnhancement' as const },
  { label: 'Noise Reduction', key: 'noiseReduction' as const },
  { label: 'Data Augmentation', key: 'dataAugmentation' as const },
];

const ProcessingCard: React.FC<ProcessingCardProps> = ({ preprocessing, originalImageUrl, processedImageUrl }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <Sliders size={15} className="text-teal-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Image Preprocessing</h3>
          <p className="text-xs text-slate-500">Resize · Normalize · Enhance · Denoise</p>
        </div>
        <span className="ml-auto badge-green">Completed</span>
      </div>

      <div className="p-5">
        {/* Images side by side */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 text-center">Original Image</p>
            <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={originalImageUrl || MOCK_RBC_IMAGE}
                alt="Original blood smear"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 text-center">Processed Image</p>
            <div className="aspect-square rounded-xl overflow-hidden border border-blue-200 bg-slate-900 relative">
              <img
                src={processedImageUrl || MOCK_PROCESSED_IMAGE}
                alt="Processed image"
                className="w-full h-full object-cover"
              />
              {/* Scanning overlay animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-80 scan-line"
                />
              </div>
              <div className="absolute bottom-2 right-2">
                <span className="badge-teal text-xs">224 × 224</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {ops.map((op) => (
            <div
              key={op.key}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100"
            >
              <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
              <span className="text-xs font-medium text-green-800">{op.label}</span>
            </div>
          ))}
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide' : 'View'} Processing Details
        </button>

        {expanded && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {[
              { label: 'Original Resolution', value: preprocessing.originalResolution },
              { label: 'Processed Resolution', value: preprocessing.processedResolution },
              { label: 'Normalization', value: 'Applied' },
              { label: 'Contrast Enhancement', value: 'Applied' },
              { label: 'Noise Reduction', value: 'Applied' },
              { label: 'Data Augmentation', value: 'Applied' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingCard;
