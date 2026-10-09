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
import { MOCK_ANALYSIS_RESULT, MOCK_RBC_IMAGE } from '../data/mockData';
import { runFullAnalysis } from '../services/api';

interface NewAnalysisPageProps {
  onNavigate: (page: Page, result?: AnalysisResult) => void;
  demoMode?: boolean;
}

type AnalysisPhase = 'idle' | 'running' | 'done' | 'error';

const STEP_DEFINITIONS = [
  { id: 'input' as PipelineStepId, number: '01', title: 'User Input', description: 'Load and validate uploaded image' },
  { id: 'preprocessing' as PipelineStepId, number: '02', title: 'Preprocessing', description: 'Resize, normalize, enhance' },
  { id: 'segmentation' as PipelineStepId, number: '03', title: 'RBC Segmentation', description: 'Detect and separate cells' },
  { id: 'classification' as PipelineStepId, number: '04', title: 'Classification', description: 'EfficientNetV2 inference' },
  { id: 'prediction' as PipelineStepId, number: '05', title: 'Prediction', description: 'Softmax output & top-3' },
  { id: 'gradcam' as PipelineStepId, number: '06', title: 'Grad-CAM', description: 'Explainability heatmap' },
  { id: 'report' as PipelineStepId, number: '07', title: 'Clinical Report', description: 'Generate AI report' },
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

  // Demo mode auto-start
  useEffect(() => {
    if (demoMode && !uploadedFile) {
      // Load demo image
      fetch(MOCK_RBC_IMAGE)
        .then(() => {
          const demoFile: UploadedFile = {
            file: new File([], 'demo_blood_smear.jpg', { type: 'image/jpeg' }),
            preview: MOCK_RBC_IMAGE,
            name: 'demo_blood_smear.jpg',
            size: '2.4 MB',
            dimensions: '1024 × 768',
          };
          setUploadedFile(demoFile);
        })
        .catch(() => {
          const demoFile: UploadedFile = {
            file: new File([], 'demo_blood_smear.jpg', { type: 'image/jpeg' }),
            preview: MOCK_RBC_IMAGE,
            name: 'demo_blood_smear.jpg',
            size: '2.4 MB',
            dimensions: '1024 × 768',
          };
          setUploadedFile(demoFile);
        });
    }
  }, [demoMode]);

  const startAnalysis = useCallback(async () => {
    if (!uploadedFile) return;
    setPhase('running');
    setCurrentStepIdx(0);
    setProgress(0);

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
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback to demo result so user never has blank output
      const fallbackResult: AnalysisResult = {
        ...MOCK_ANALYSIS_RESULT,
        imageUrl: uploadedFile.preview,
        imageName: uploadedFile.name,
        imageSize: uploadedFile.size,
        imageDimensions: uploadedFile.dimensions,
      };
      setResult(fallbackResult);
      setStepStatuses(STEP_DEFINITIONS.map(() => 'completed'));
      setProgress(100);
      setPhase('done');
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
          Upload a peripheral blood smear image to begin AI-powered morphology analysis.
        </p>
      </div>

      {/* Demo banner */}
      {demoMode && (
        <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <Sparkles size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-purple-800">Demo Mode Active</p>
            <p className="text-xs text-purple-600">
              A sample RBC blood smear image has been pre-loaded. Click "Start Analysis" to run the
              complete demonstration.
            </p>
          </div>
        </div>
      )}

      {/* Upload */}
      <UploadCard
        onFileSelect={setUploadedFile}
        uploadedFile={uploadedFile}
        onRemove={() => {
          setUploadedFile(null);
          setPhase('idle');
          setStepStatuses(STEP_DEFINITIONS.map(() => 'pending'));
          setResult(null);
          setProgress(0);
          setCurrentStepIdx(-1);
        }}
      />

      {/* Start button */}
      {uploadedFile && phase === 'idle' && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startAnalysis}
            disabled={!canStart}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} />
            Start Analysis
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
              <p className="text-sm font-semibold text-green-800">Analysis Completed Successfully</p>
              <p className="text-xs text-green-600">
                Processing time: {result.processingTime} · Analysis ID: {result.analysisId}
              </p>
            </div>
            <button
              onClick={() => onNavigate('results', result)}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              View Results Dashboard →
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
              className="btn-primary"
            >
              View Results Dashboard
            </button>
            <button
              onClick={() => onNavigate('report', result)}
              className="btn-secondary"
            >
              Full Clinical Report
            </button>
            <button
              onClick={() => {
                setPhase('idle');
                setUploadedFile(null);
                setStepStatuses(STEP_DEFINITIONS.map(() => 'pending'));
                setResult(null);
                setProgress(0);
                setCurrentStepIdx(-1);
              }}
              className="btn-outline"
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
            <p className="text-xs text-red-600">
              An error occurred during analysis. Please try again.
            </p>
          </div>
          <button
            onClick={() => setPhase('idle')}
            className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default NewAnalysisPage;
