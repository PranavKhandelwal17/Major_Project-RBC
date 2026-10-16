import React, { useState, useCallback, useEffect } from 'react';
import { Play, Sparkles, AlertCircle } from 'lucide-react';
import type { UploadedFile, AnalysisResult, AnalysisStatus, PipelineStepId, Page } from '../types';
import UploadCard from '../components/analysis/UploadCard';
import AnalysisPipeline from '../components/analysis/AnalysisPipeline';
import ProcessingCard from '../components/analysis/ProcessingCard';
import SegmentationViewer from '../components/analysis/SegmentationViewer';
import ModelCard from '../components/analysis/ModelCard';
import PredictionCard from '../components/analysis/PredictionCard';
import GradCAMViewer from '../components/analysis/GradCAMViewer';
import ClinicalReport from '../components/analysis/ClinicalReport';
import Disclaimer from '../components/shared/Disclaimer';
import { runFullAnalysis, getSamplePresets, SamplePreset } from '../services/api';

interface NewAnalysisPageProps {
  onNavigate: (page: Page, result?: AnalysisResult) => void;
  demoMode?: boolean;
}

type AnalysisPhase = 'idle' | 'running' | 'done' | 'error';

const STEP_DEFINITIONS = [
  { id: 'input' as PipelineStepId, number: '01', title: 'User Input', description: 'Load and validate uploaded image' },
  { id: 'preprocessing' as PipelineStepId, number: '02', title: 'Preprocessing', description: 'LAB CLAHE, denoise, standardize' },
  { id: 'segmentation' as PipelineStepId, number: '03', title: 'RBC Segmentation', description: 'Detect & separate overlapping cells' },
  { id: 'classification' as PipelineStepId, number: '04', title: 'Classification', description: 'Final EfficientNetV2-S inference' },
  { id: 'prediction' as PipelineStepId, number: '05', title: 'Prediction', description: 'Calibrated softmax differential' },
  { id: 'gradcam' as PipelineStepId, number: '06', title: 'Grad-CAM', description: 'Real PyTorch saliency heatmap' },
  { id: 'report' as PipelineStepId, number: '07', title: 'Clinical Report', description: 'Generate AI diagnostic PDF report' },
];

const NewAnalysisPage: React.FC<NewAnalysisPageProps> = ({ onNavigate, demoMode = false }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [stepStatuses, setStepStatuses] = useState<AnalysisStatus[]>(
    STEP_DEFINITIONS.map(() => 'pending')
  );
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [presets, setPresets] = useState<SamplePreset[]>([]);
  const [selectedPresetCode, setSelectedPresetCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load sample presets on mount
  useEffect(() => {
    getSamplePresets().then((data) => setPresets(data));
  }, []);

  // Helper to load a real sample image into uploadedFile
  const loadPresetSample = useCallback(async (preset: SamplePreset) => {
    try {
      setSelectedPresetCode(preset.code);
      const res = await fetch(preset.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const filename = preset.url.split('/').pop() || `${preset.code}.png`;
      const file = new File([blob], filename, { type: blob.type || 'image/png' });
      const preview = URL.createObjectURL(file);
      setUploadedFile({
        file,
        preview,
        name: filename,
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        dimensions: '224 × 224',
      });
      setPhase('idle');
      setStepStatuses(STEP_DEFINITIONS.map(() => 'pending'));
      setResult(null);
      setProgress(0);
      setCurrentStepIdx(-1);
      setErrorMessage(null);
    } catch (err) {
      console.error('Failed to load preset sample:', err);
      setErrorMessage('Could not load sample microscopy image. Please try uploading manually.');
    }
  }, []);

  // Demo mode auto-load real Target Cell sample
  useEffect(() => {
    if (demoMode && !uploadedFile) {
      loadPresetSample({
        class: 'Target Cell',
        code: '4_Target_Cell',
        url: '/static/demo/4_Target_Cell_segmented.png',
        description: 'Bullseye appearance with central hemoglobin condensation',
      });
    }
  }, [demoMode, uploadedFile, loadPresetSample]);

  const startAnalysis = useCallback(async () => {
    if (!uploadedFile) return;
    setPhase('running');
    setCurrentStepIdx(0);
    setProgress(0);
    setErrorMessage(null);

    const statuses: AnalysisStatus[] = STEP_DEFINITIONS.map(() => 'pending');

    try {
      const analysisResult = await runFullAnalysis(uploadedFile.file, (stepIdx) => {
        statuses.forEach((_, idx) => {
          if (idx < stepIdx) statuses[idx] = 'completed';
          else if (idx === stepIdx) statuses[idx] = 'processing';
          else statuses[idx] = 'pending';
        });
        setStepStatuses([...statuses]);
        setCurrentStepIdx(stepIdx);
        setProgress(Math.round(((stepIdx + 0.5) / STEP_DEFINITIONS.length) * 100));
      });

      // Mark all completed
      setStepStatuses(STEP_DEFINITIONS.map(() => 'completed'));
      setProgress(100);
      setCurrentStepIdx(STEP_DEFINITIONS.length);

      const finalResult: AnalysisResult = {
        ...analysisResult,
        imageUrl: uploadedFile.preview || analysisResult.imageUrl,
        imageName: uploadedFile.name,
        imageSize: uploadedFile.size,
        imageDimensions: uploadedFile.dimensions,
      };

      setResult(finalResult);
      setPhase('done');
    } catch (err: any) {
      console.error('Analysis execution error:', err);
      setPhase('error');
      setErrorMessage(
        err?.message || 'Inference engine failed to process the image. Please verify backend service on port 8000.'
      );
    }
  }, [uploadedFile]);

  // Build steps with current statuses
  const steps = STEP_DEFINITIONS.map((s, i) => ({
    ...s,
    icon: s.id,
    status: stepStatuses[i],
  }));

  const canStart = uploadedFile && phase === 'idle';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">New RBC Analysis</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload a peripheral blood smear micrograph or test a morphology benchmark sample using the final EfficientNetV2-S model.
        </p>
      </div>

      {/* Demo banner */}
      {demoMode && (
        <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <Sparkles size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Demo Mode Active</p>
            <p className="text-xs text-purple-600">
              A verified Target Cell (Codocyte) sample has been loaded. Click "Start Analysis" below to run the complete 8-stage pipeline with the final model.
            </p>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <UploadCard
        onFileSelect={(f) => {
          setUploadedFile(f);
          setSelectedPresetCode(null);
          setPhase('idle');
          setStepStatuses(STEP_DEFINITIONS.map(() => 'pending'));
          setResult(null);
          setErrorMessage(null);
        }}
        uploadedFile={uploadedFile}
        onRemove={() => {
          setUploadedFile(null);
          setSelectedPresetCode(null);
          setPhase('idle');
          setStepStatuses(STEP_DEFINITIONS.map(() => 'pending'));
          setResult(null);
          setProgress(0);
          setCurrentStepIdx(-1);
          setErrorMessage(null);
        }}
      />

      {/* Quick Benchmark Presets Selector */}
      {phase === 'idle' && presets.length > 0 && (
        <div className="card p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                Quick Test Benchmark Samples (12 Morphology Classes)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any cell class below to load its genuine Chula-RBC-12 microscopy image directly into the analyzer:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
            {presets.map((preset) => {
              const isSelected = selectedPresetCode === preset.code;
              return (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => loadPresetSample(preset)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold truncate">{preset.class}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {preset.code.split('_')[0]}
                    </span>
                  </div>
                  <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Start button */}
      {uploadedFile && phase === 'idle' && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startAnalysis}
            disabled={!canStart}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Play size={16} />
            Start Analysis with Final Model
          </button>
        </div>
      )}

      {/* Pipeline (shown once analysis starts) */}
      {phase !== 'idle' && (
        <AnalysisPipeline
          steps={steps}
          currentStep={currentStepIdx}
          progress={progress}
        />
      )}

      {/* Processing complete — show all result sections */}
      {phase === 'done' && result && (
        <>
          {/* Success banner */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                Analysis Completed — Predicted:{' '}
                <span className="font-black text-green-900 underline">{result.predictedClass}</span> (
                {result.confidence.toFixed(1)}% Confidence)
              </p>
              <p className="text-xs text-green-600">
                Processing time: {result.processingTime} · Analysis ID: {result.analysisId} · Model: {result.model}
              </p>
            </div>
            <button
              onClick={() => onNavigate('results', result)}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              View Full Dashboard →
            </button>
          </div>

          <ProcessingCard
            preprocessing={result.preprocessing}
            originalImageUrl={result.imageUrl}
            processedImageUrl={result.processedImageUrl}
          />
          <SegmentationViewer
            stats={result.segmentation}
            originalImageUrl={result.imageUrl}
            segmentedImageUrl={result.segmentedImageUrl}
          />
          <ModelCard predictedClass={result.predictedClass} />
          <PredictionCard result={result} onViewDetails={() => onNavigate('results', result)} />
          <GradCAMViewer result={result} />
          <ClinicalReport result={result} />

          {/* Navigation CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('results', result)}
              className="btn-primary cursor-pointer"
            >
              View Results Dashboard
            </button>
            <button
              onClick={() => onNavigate('report', result)}
              className="btn-secondary cursor-pointer"
            >
              Full Clinical Report
            </button>
            <button
              onClick={() => {
                setPhase('idle');
                setUploadedFile(null);
                setSelectedPresetCode(null);
                setStepStatuses(STEP_DEFINITIONS.map(() => 'pending'));
                setResult(null);
                setProgress(0);
                setCurrentStepIdx(-1);
                setErrorMessage(null);
              }}
              className="btn-outline cursor-pointer"
            >
              New Analysis
            </button>
          </div>

          <Disclaimer />
        </>
      )}

      {/* Error state */}
      {phase === 'error' && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Analysis Failed</p>
            <p className="text-xs text-red-600 mt-0.5">
              {errorMessage || 'An error occurred during pipeline execution. Please verify backend service on port 8000.'}
            </p>
          </div>
          <button
            onClick={() => setPhase('idle')}
            className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default NewAnalysisPage;
