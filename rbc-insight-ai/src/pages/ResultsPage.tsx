import React from 'react';
import {
  CheckCircle2,
  FileText,
  Microscope,
  BarChart2,
  Eye,
  Scissors,
  Download,
} from 'lucide-react';
import type { AnalysisResult, Page } from '../types';
import {
  MOCK_ANALYSIS_RESULT,
  MORPHOLOGY_DESCRIPTIONS,
  MOCK_SEGMENTED_IMAGE,
  MOCK_GRADCAM_IMAGE,
} from '../data/mockData';
import { downloadClinicalReport } from '../utils/reportExporter';
import PredictionCard from '../components/analysis/PredictionCard';
import GradCAMViewer from '../components/analysis/GradCAMViewer';
import { PredictionChart, MorphologyPieChart } from '../components/analysis/Charts';
import MorphologyBadge from '../components/shared/MorphologyBadge';
import Disclaimer from '../components/shared/Disclaimer';

interface ResultsPageProps {
  result?: AnalysisResult;
  onNavigate: (page: Page, result?: AnalysisResult) => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result: propResult, onNavigate }) => {
  const result = propResult || MOCK_ANALYSIS_RESULT;

  const originalImg = result.imageUrl || MOCK_ANALYSIS_RESULT.imageUrl;
  const segmentedImg = result.segmentedImageUrl || MOCK_SEGMENTED_IMAGE;
  const gradcamImg = result.overlayUrl || result.heatmapUrl || MOCK_GRADCAM_IMAGE;

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Analysis Completed ✓</h1>
              <p className="text-green-100 text-sm">
                {result.analysisId} · {result.date} · {result.processingTime}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('report', result)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              <FileText size={14} />
              Report
            </button>
            <button
              onClick={() => downloadClinicalReport(result)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              title="Download Clinical PDF / Report"
            >
              <Download size={14} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Top summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Prediction */}
        <div className="card p-5 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Predicted Morphology
          </p>
          <MorphologyBadge morphology={result.predictedClass} size="lg" className="mx-auto mb-2" />
          <p className="text-3xl font-black text-slate-800">{result.predictedClass}</p>
        </div>
        {/* Confidence */}
        <div className="card p-5 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Confidence Score
          </p>
          <p className="text-5xl font-black text-blue-600">{result.confidence.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">EfficientNetV2 Softmax</p>
        </div>
        {/* RBC Count */}
        <div className="card p-5 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            RBCs Analyzed
          </p>
          <p className="text-5xl font-black text-teal-600">{result.segmentation.separated}</p>
          <p className="text-xs text-slate-500 mt-1">
            of {result.segmentation.totalDetected} detected
          </p>
        </div>
      </div>

      {/* Row 2: Images */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Original Image', icon: <Microscope size={14} />, src: originalImg, border: 'border-slate-200' },
          { label: 'Segmentation', icon: <Scissors size={14} />, src: segmentedImg, border: 'border-purple-200' },
          { label: 'Grad-CAM', icon: <Eye size={14} />, src: gradcamImg, border: 'border-orange-200' },
        ].map((img, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-1.5">
              <span className="text-slate-500">{img.icon}</span>
              <p className="text-xs font-semibold text-slate-700">{img.label}</p>
            </div>
            <div className={`aspect-video border-b-2 ${img.border} bg-slate-900 overflow-hidden flex items-center justify-center`}>
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Charts + Prediction + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Prediction bar chart */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={15} className="text-blue-500" />
            <p className="text-sm font-semibold text-slate-800">Top Predictions</p>
          </div>
          <PredictionChart topPredictions={result.topPredictions} />
        </div>

        {/* Morphology pie chart */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={15} className="text-purple-500" />
            <p className="text-sm font-semibold text-slate-800">Morphology Distribution</p>
          </div>
          <MorphologyPieChart distribution={result.morphologyDistribution} />
        </div>

        {/* Analysis summary */}
        <div className="card p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">Analysis Summary</p>
            <dl className="space-y-2">
              {[
                { label: 'Analysis ID', value: result.analysisId },
                { label: 'Date', value: result.date },
                { label: 'Model', value: result.model },
                { label: 'Image', value: result.imageName },
                { label: 'Size', value: result.imageSize },
                { label: 'Dimensions', value: result.imageDimensions },
                { label: 'Total RBCs', value: result.segmentation.totalDetected },
                { label: 'Processed', value: result.segmentation.separated },
                { label: 'Seg. Accuracy', value: `${result.segmentation.accuracy}%` },
                { label: 'Proc. Time', value: result.processingTime },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-700">{item.value}</span>
                </div>
              ))}
            </dl>
          </div>

          {/* Morphology info */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-800 mb-1">{result.predictedClass}</p>
            <p className="text-xs text-blue-700">{MORPHOLOGY_DESCRIPTIONS[result.predictedClass]}</p>
          </div>
        </div>
      </div>

      {/* Full prediction card */}
      <PredictionCard result={result} onViewDetails={() => onNavigate('report', result)} />

      {/* Grad-CAM */}
      <GradCAMViewer result={result} />

      <Disclaimer />
    </div>
  );
};

export default ResultsPage;
