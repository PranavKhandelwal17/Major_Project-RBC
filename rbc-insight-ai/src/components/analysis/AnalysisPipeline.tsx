import React from 'react';
import {
  Upload,
  Sliders,
  Scissors,
  Cpu,
  BarChart2,
  Eye,
  FileText,
  Check,
  Loader2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { AnalysisStatus, PipelineStepId } from '../../types';
import { PulseDots } from '../shared/LoadingAnimation';

interface StepData {
  id: PipelineStepId;
  number: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  status: AnalysisStatus;
}

interface AnalysisPipelineProps {
  steps: StepData[];
  currentStep: number;
  progress: number;
}

const STEP_ICONS: Record<PipelineStepId, React.ReactNode> = {
  input: <Upload size={16} />,
  preprocessing: <Sliders size={16} />,
  segmentation: <Scissors size={16} />,
  classification: <Cpu size={16} />,
  prediction: <BarChart2 size={16} />,
  gradcam: <Eye size={16} />,
  report: <FileText size={16} />,
};

const StatusIcon: React.FC<{ status: AnalysisStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Check size={12} className="text-white" />;
    case 'processing':
      return <Loader2 size={12} className="text-white animate-spin" />;
    case 'error':
      return <AlertCircle size={12} className="text-white" />;
    default:
      return null;
  }
};

const statusColors: Record<AnalysisStatus, string> = {
  completed: 'bg-green-500 border-green-500',
  processing: 'bg-blue-600 border-blue-600 animate-pulse-ring',
  pending: 'bg-slate-200 border-slate-300',
  error: 'bg-red-500 border-red-500',
};

const statusTextColors: Record<AnalysisStatus, string> = {
  completed: 'text-green-600',
  processing: 'text-blue-600',
  pending: 'text-slate-400',
  error: 'text-red-600',
};

const statusLabels: Record<AnalysisStatus, string> = {
  completed: 'Completed',
  processing: 'Processing',
  pending: 'Pending',
  error: 'Error',
};

const AnalysisPipeline: React.FC<AnalysisPipelineProps> = ({ steps, currentStep, progress }) => {
  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Analysis Pipeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">EfficientNetV2 · Grad-CAM · Clinical Report</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Progress</p>
          <p className="text-lg font-bold text-blue-600">{Math.round(progress)}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start gap-0">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                {/* Circle */}
                <div
                  className={`
                    relative w-9 h-9 rounded-full border-2 flex items-center justify-center
                    transition-all duration-500 z-10
                    ${statusColors[step.status]}
                    ${step.status === 'processing' ? 'shadow-lg shadow-blue-200' : ''}
                  `}
                >
                  {step.status === 'pending' ? (
                    <span className="text-xs font-bold text-slate-400">{step.number}</span>
                  ) : step.status === 'processing' ? (
                    <Loader2 size={14} className="text-white animate-spin" />
                  ) : (
                    <StatusIcon status={step.status} />
                  )}
                  {/* Glow for active */}
                  {step.status === 'processing' && (
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`text-slate-400 transition-colors ${
                    step.status !== 'pending' ? 'text-blue-500' : ''
                  }`}
                >
                  {STEP_ICONS[step.id]}
                </div>

                {/* Title & status */}
                <div className="text-center px-1">
                  <p
                    className={`text-xs font-semibold truncate ${
                      step.status === 'pending' ? 'text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className={`text-xs ${statusTextColors[step.status]} flex items-center justify-center gap-1`}>
                    {step.status === 'processing' && <PulseDots />}
                    {step.status !== 'processing' && statusLabels[step.status]}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-shrink-0 h-px w-4 mt-4 mx-1">
                  <div
                    className={`w-full h-0.5 transition-all duration-500 ${
                      steps[idx].status === 'completed' ? 'bg-green-400' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-3">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start gap-3">
            {/* Left: circle + line */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${statusColors[step.status]}
                `}
              >
                {step.status === 'pending' ? (
                  <span className="text-xs font-bold text-slate-400">{step.number}</span>
                ) : step.status === 'processing' ? (
                  <Loader2 size={13} className="text-white animate-spin" />
                ) : (
                  <StatusIcon status={step.status} />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-0.5 h-6 mt-1 ${
                    step.status === 'completed' ? 'bg-green-300' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
            {/* Right: info */}
            <div className="flex-1 pb-1">
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-semibold ${
                    step.status === 'pending' ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  {step.number}. {step.title}
                </p>
                <span className={`text-xs font-medium ${statusTextColors[step.status]}`}>
                  {step.status === 'processing' ? (
                    <span className="flex items-center gap-1">
                      <Clock size={10} className="animate-spin" /> Processing
                    </span>
                  ) : (
                    statusLabels[step.status]
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Current step label */}
      {currentStep < steps.length && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Loader2 size={12} className="animate-spin text-blue-500" />
          Currently processing:{' '}
          <span className="font-semibold text-blue-600">{steps[currentStep]?.title}</span>
        </div>
      )}
    </div>
  );
};

export default AnalysisPipeline;
