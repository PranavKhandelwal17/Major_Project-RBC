import React from 'react';
import { Scissors, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import type { AnalysisResult } from '../../types';
import { MOCK_RBC_IMAGE, MOCK_SEGMENTED_IMAGE } from '../../data/mockData';

interface SegmentationViewerProps {
  stats: AnalysisResult['segmentation'];
  originalImageUrl: string;
  segmentedImageUrl?: string;
}

// Individual cell thumbnails (mock SVG cells)
const CellThumbnail: React.FC<{ index: number }> = ({ index }) => {
  const hue = 0; // red
  const lightness = 40 + (index % 5) * 4;
  return (
    <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="24" fill={`hsl(${hue}, 70%, ${lightness}%)`} opacity="0.85" />
        <circle cx="30" cy="30" r="14" fill={`hsl(${hue}, 70%, ${lightness - 12}%)`} opacity="0.6" />
        <ellipse cx="30" cy="30" rx="26" ry="26" stroke="#00ff00" strokeWidth="1.5" fill="none" opacity="0.7" />
      </svg>
    </div>
  );
};

const SegmentationViewer: React.FC<SegmentationViewerProps> = ({ stats, originalImageUrl, segmentedImageUrl }) => {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Scissors size={15} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">RBC Segmentation & Overlap Separation</h3>
          <p className="text-xs text-slate-500">Ellipse fitting · Watershed algorithm · Individual cell isolation</p>
        </div>
        <span className="ml-auto badge-purple">Completed</span>
      </div>

      <div className="p-5">
        {/* Three image cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Original Image', src: originalImageUrl || MOCK_RBC_IMAGE, tag: 'Input' },
            {
              label: 'Detected RBCs',
              src: segmentedImageUrl || MOCK_SEGMENTED_IMAGE,
              tag: `${stats.totalDetected} Cells`,
              border: 'border-green-300',
            },
            {
              label: 'Separated Cells',
              src: segmentedImageUrl || MOCK_SEGMENTED_IMAGE,
              tag: `${stats.separated} Isolated`,
              border: 'border-teal-300',
            },
          ].map((img, i) => (
            <div key={i}>
              <p className="text-xs font-semibold text-slate-600 mb-2 text-center">{img.label}</p>
              <div
                className={`aspect-video rounded-xl overflow-hidden border-2 bg-slate-900 relative ${
                  img.border || 'border-slate-200'
                }`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                <div className="absolute bottom-1.5 left-1.5">
                  <span className="px-1.5 py-0.5 bg-black/60 text-white text-xs rounded font-medium">
                    {img.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { icon: <Target size={16} className="text-blue-500" />, value: stats.totalDetected, label: 'Total RBCs', bg: 'bg-blue-50' },
            { icon: <AlertTriangle size={16} className="text-amber-500" />, value: stats.overlapping, label: 'Overlapping', bg: 'bg-amber-50' },
            { icon: <CheckCircle2 size={16} className="text-green-500" />, value: stats.separated, label: 'Separated', bg: 'bg-green-50' },
            { icon: <Scissors size={16} className="text-purple-500" />, value: `${stats.accuracy}%`, label: 'Accuracy', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-xl p-3 flex items-center gap-3`}>
              <div>{stat.icon}</div>
              <div>
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Individual cell grid */}
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-2">Separated Individual Cells</p>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5">
            {Array.from({ length: Math.min(stats.separated, 24) }).map((_, i) => (
              <CellThumbnail key={i} index={i} />
            ))}
            {stats.separated > 24 && (
              <div className="aspect-square rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500 font-medium">
                +{stats.separated - 24}
              </div>
            )}
          </div>
        </div>

        {/* Methodology note */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <span className="font-semibold">Methodology:</span> Ellipse fitting is used to detect RBC boundaries
          and separate overlapping cells into individual cell regions using the Watershed algorithm.
          Detected boundaries are shown in green; overlapping regions in amber.
        </div>
      </div>
    </div>
  );
};

export default SegmentationViewer;
