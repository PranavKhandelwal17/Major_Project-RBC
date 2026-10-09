import React from 'react';
import { BarChart2, ChevronRight } from 'lucide-react';
import type { AnalysisResult } from '../../types';
import { MORPHOLOGY_COLORS } from '../../data/mockData';
import MorphologyBadge from '../shared/MorphologyBadge';

interface PredictionCardProps {
  result: AnalysisResult;
  onViewDetails?: () => void;
}

// SVG confidence ring
const ConfidenceRing: React.FC<{ confidence: number; color: string }> = ({ confidence, color }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg width="112" height="112" className="rotate-[-90deg]" viewBox="0 0 112 112">
        {/* Track */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-slate-800">{confidence.toFixed(1)}%</span>
        <span className="text-xs text-slate-500">Confidence</span>
      </div>
    </div>
  );
};

const PredictionCard: React.FC<PredictionCardProps> = ({ result, onViewDetails }) => {
  const color = MORPHOLOGY_COLORS[result.predictedClass] || '#3b82f6';
  const maxConf = Math.max(...result.topPredictions.map((p) => p.confidence));

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <BarChart2 size={15} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Prediction Result</h3>
          <p className="text-xs text-slate-500">EfficientNetV2 · Softmax output</p>
        </div>
        <span className="ml-auto badge-purple">Completed</span>
      </div>

      <div className="p-5">
        {/* Main prediction */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          {/* Confidence ring */}
          <ConfidenceRing confidence={result.confidence} color={color} />

          {/* Prediction label */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Predicted Morphology
            </p>
            <h2
              className="text-3xl font-black uppercase tracking-wide mb-2"
              style={{ color }}
            >
              {result.predictedClass}
            </h2>
            <MorphologyBadge morphology={result.predictedClass} size="lg" />
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-slate-500">Model</p>
                <p className="font-semibold text-slate-700">{result.model}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-slate-500">Processing</p>
                <p className="font-semibold text-slate-700">{result.processingTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top predictions */}
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-3">Top-3 Predictions</p>
          <div className="space-y-2.5">
            {result.topPredictions.map((pred, i) => {
              const predColor = MORPHOLOGY_COLORS[pred.class] || '#3b82f6';
              const barWidth = (pred.confidence / maxConf) * 100;
              return (
                <div key={pred.class} className="flex items-center gap-3">
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white`}
                    style={{ backgroundColor: predColor }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{pred.class}</span>
                      <span className="font-bold" style={{ color: predColor }}>
                        {pred.confidence.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${barWidth}%`, backgroundColor: predColor }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View details */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            View Detailed Prediction
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
