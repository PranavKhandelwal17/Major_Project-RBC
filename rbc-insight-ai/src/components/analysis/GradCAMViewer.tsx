import React, { useState } from 'react';
import { Eye, Info } from 'lucide-react';
import type { AnalysisResult } from '../../types';
import { MOCK_RBC_IMAGE, MOCK_GRADCAM_IMAGE, MORPHOLOGY_DESCRIPTIONS } from '../../data/mockData';

interface GradCAMViewerProps {
  result: AnalysisResult;
}

type ViewMode = 'original' | 'gradcam' | 'overlay';

const GradCAMViewer: React.FC<GradCAMViewerProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('gradcam');

  const imageUrl = result.imageUrl || MOCK_RBC_IMAGE;
  const gradcamUrl = result.heatmapUrl || MOCK_GRADCAM_IMAGE;
  const overlayUrl = result.overlayUrl || result.heatmapUrl || MOCK_GRADCAM_IMAGE;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <Eye size={15} className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Model Explainability (Grad-CAM)</h3>
          <p className="text-xs text-slate-500">
            Gradient-weighted Class Activation Mapping visualization
          </p>
        </div>
        <span className="ml-auto badge bg-orange-100 text-orange-700">Completed</span>
      </div>

      <div className="p-5">
        {/* View toggle */}
        <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
          {(['original', 'gradcam', 'overlay'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize
                ${viewMode === mode
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Image display */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Original */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 text-center">Original Image</p>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img src={imageUrl} alt="Original" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Grad-CAM / Overlay */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 text-center">
              {viewMode === 'original' ? 'Original Image' : viewMode === 'gradcam' ? 'Grad-CAM Heatmap' : 'Overlay'}
            </p>
            <div className="aspect-video rounded-xl overflow-hidden border border-orange-300 bg-slate-900 relative">
              {viewMode === 'original' && (
                <img src={imageUrl} alt="Original" className="w-full h-full object-cover" />
              )}
              {viewMode === 'gradcam' && (
                <img src={gradcamUrl} alt="Grad-CAM heatmap" className="w-full h-full object-cover" />
              )}
              {viewMode === 'overlay' && (
                result.overlayUrl ? (
                  <img src={overlayUrl} alt="Grad-CAM overlay" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <img src={imageUrl} alt="Original" className="w-full h-full object-cover" />
                    <div className="absolute inset-0">
                      <img
                        src={gradcamUrl}
                        alt="Grad-CAM overlay"
                        className="w-full h-full object-cover opacity-60 mix-blend-screen"
                      />
                    </div>
                  </>
                )
              )}
              {/* Legend overlay */}
              <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-black/60 rounded-lg p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 rounded-sm bg-red-500" />
                  <span className="text-white text-xs">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 rounded-sm bg-yellow-400" />
                  <span className="text-white text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 rounded-sm bg-blue-500" />
                  <span className="text-white text-xs">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap legend bar */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-slate-500 whitespace-nowrap">Low Attention</span>
          <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-600" />
          <span className="text-xs text-slate-500 whitespace-nowrap">High Attention</span>
        </div>

        {/* Interpretation */}
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 mb-4">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-orange-800 mb-1">Interpretation</p>
              <p className="text-xs text-orange-700 leading-relaxed">
                The highlighted regions (red/yellow) indicate areas of the RBC image that contributed most
                strongly to the predicted <span className="font-bold">{result.predictedClass}</span> class.
                The model focuses on cell morphology features including size, shape, and color intensity
                patterns characteristic of{' '}
                {MORPHOLOGY_DESCRIPTIONS[result.predictedClass].split('.')[0]}.
              </p>
            </div>
          </div>
        </div>

        {/* Why this prediction */}
        <div className="card p-4 bg-slate-50">
          <p className="text-xs font-semibold text-slate-700 mb-3">
            Why this prediction? — Key contributing features:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'RBC Size', desc: 'Smaller than normal', strength: 90 },
              { label: 'Cell Morphology', desc: 'Compact disc shape', strength: 75 },
              { label: 'Shape Characteristics', desc: 'Reduced diameter', strength: 85 },
              { label: 'Color Intensity', desc: 'Normal hemoglobin', strength: 60 },
            ].map((feature) => (
              <div key={feature.label} className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-semibold text-slate-700">{feature.label}</p>
                  <span className="text-xs text-blue-600 font-bold">{feature.strength}%</span>
                </div>
                <p className="text-xs text-slate-500 mb-1.5">{feature.desc}</p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${feature.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            * Feature importance scores are indicative, not clinically validated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradCAMViewer;
