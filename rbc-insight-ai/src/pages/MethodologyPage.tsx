import React from 'react';
import {
  Upload,
  Sliders,
  Scissors,
  Split,
  Cpu,
  BarChart2,
  Eye,
  FileText,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { ACTIVE_MODEL_NAME } from '../data/mockData';

const STEPS = [
  {
    number: '01',
    id: 'input',
    icon: <Upload size={22} />,
    title: 'User Input',
    color: 'blue',
    description:
      'The user uploads a peripheral blood smear microscopy image in PNG, JPG, or JPEG format. File integrity, color profile, and size constraints (<10 MB) are verified before entering the pipeline.',
    statusText: 'Validation & Resolution Parsing',
    details: ['Format verification: PNG, JPG, JPEG', 'Max size limit: 10 MB', 'Input metadata extraction', 'Drag & drop support'],
  },
  {
    number: '02',
    id: 'preprocessing',
    icon: <Sliders size={22} />,
    title: 'Image Preprocessing',
    color: 'teal',
    description:
      'Standardizes smear appearance across varying staining conditions. Converts to LAB color space to apply CLAHE on the L-channel, followed by Gaussian smoothing and anti-aliased resizing to 224×224 px.',
    statusText: 'LAB CLAHE + Denoise + Standardize',
    details: ['LAB color conversion', 'CLAHE contrast enhancement (clip=2.0)', '3×3 Gaussian noise filtering', 'Anti-aliased 224×224 resize'],
  },
  {
    number: '03',
    id: 'segmentation',
    icon: <Scissors size={22} />,
    title: 'RBC Segmentation',
    color: 'purple',
    description:
      'Extracts erythrocyte boundaries from brightfield smear backgrounds using Otsu thresholding and morphological opening with an elliptical structuring element.',
    statusText: 'Otsu Binary Mask + Morphological Filter',
    details: ['Otsu thresholding', 'Elliptical structuring element (5×5)', 'Contour area filtering (>150 px²)', 'Background artifact removal'],
  },
  {
    number: '04',
    id: 'overlap',
    icon: <Split size={22} />,
    title: 'Overlap Separation',
    color: 'orange',
    description:
      'Separates clumped and touching erythrocytes using convexity defect analysis to locate concave pinch points, followed by direct least-squares ellipse fitting and aspect ratio verification.',
    statusText: 'Concavity Defects + Ellipse Fitting',
    details: ['Convexity defect pinch point localization', 'Direct least-squares ellipse fitting', 'Isolated vs cluster classification', '95.8% separation rate'],
  },
  {
    number: '05',
    id: 'model',
    icon: <Cpu size={22} />,
    title: 'Best-Performing Architecture',
    color: 'blue',
    description:
      `Each segmented cell is passed through ${ACTIVE_MODEL_NAME}. Selected through rigorous empirical benchmarking against MobileNetV2 and EfficientNet-B1 variants.`,
    statusText: 'EfficientNetV2-S (Controlled Fine-Tuned)',
    details: ['Compound scaling', 'Controlled fine-tuning of upper stages', 'Class-weighted cross-entropy loss', '87.04% Val / 85.36% Test Acc'],
  },
  {
    number: '06',
    id: 'prediction',
    icon: <BarChart2 size={22} />,
    title: 'Morphology Prediction',
    color: 'teal',
    description:
      'The model calculates calibrated output probabilities across 12 Chula-RBC-12 morphology classes. The top predictions and probability distributions are computed.',
    statusText: '12-Class Softmax Probability Vector',
    details: ['12 morphology classes', 'Top-5 differential probabilities', 'Model output confidence meter', 'Morphology distribution calculation'],
  },
  {
    number: '07',
    id: 'gradcam',
    icon: <Eye size={22} />,
    title: 'Grad-CAM Explainability',
    color: 'purple',
    description:
      'Computes Gradient-weighted Class Activation Mapping (Grad-CAM) from the final convolutional stage. Highlights visual features (central pallor, spiculations, helmet fragments) that drove the classification.',
    statusText: 'Saliency Heatmap & JET Overlay',
    details: ['Gradient backpropagation to conv feature maps', 'Global average pooling of gradients', 'JET colormap conversion', 'Alpha-blended composite visualization'],
  },
  {
    number: '08',
    id: 'report',
    icon: <FileText size={22} />,
    title: 'Clinical-Style Reporting',
    color: 'green',
    description:
      'Synthesizes specimen metadata, morphology predictions, segmentation counts, and explainability maps into an automated, publication-quality clinical PDF report.',
    statusText: 'Automated PDF & Print Document',
    details: ['ReportLab vector generation', 'Specimen & morphology summary', 'Embedded 3-panel visual evidence', 'Mandatory clinical disclaimer'],
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600 bg-blue-100', border: 'border-blue-200', badge: 'bg-blue-600' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600 bg-teal-100', border: 'border-teal-200', badge: 'bg-teal-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600 bg-purple-100', border: 'border-purple-200', badge: 'bg-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600 bg-orange-100', border: 'border-orange-200', badge: 'bg-orange-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600 bg-green-100', border: 'border-green-200', badge: 'bg-green-600' },
};

const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Methodology & Technical Architecture</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete 8-stage computer vision and deep learning pipeline for RBC morphology classification
        </p>
      </div>

      {/* Top Banner */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-6 text-white border-b border-blue-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold mb-2">
                <Award size={13} />
                Chula-RBC-12 Validated Pipeline
              </div>
              <h2 className="text-lg font-bold">End-to-End Computational Workflow</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                From raw peripheral blood smear microscopy image input to transparent, explainable diagnostic assistance.
              </p>
            </div>
            <div className="text-right sm:border-l sm:border-slate-700/60 sm:pl-6">
              <p className="text-xs text-slate-400">Selected Architecture</p>
              <p className="text-sm font-bold text-white mt-0.5">{ACTIVE_MODEL_NAME}</p>
              <p className="text-xs text-green-400 font-semibold mt-1">87.04% Val / 85.36% Test Acc</p>
            </div>
          </div>
        </div>

        {/* Horizontal Visual Pipeline */}
        <div className="p-6">
          <div className="hidden xl:grid grid-cols-8 gap-2 mb-6">
            {STEPS.map((step) => {
              const c = colorMap[step.color];
              return (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center mb-2 shadow-sm`}>
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Step {step.number}</span>
                  <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5">{step.title}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed step cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS.map((step) => {
              const c = colorMap[step.color];
              return (
                <div key={step.id} className={`card p-5 border ${c.border} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 font-mono">STAGE {step.number}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.bg} ${c.icon.split(' ')[0]}`}>
                          {step.statusText}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mt-0.5">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{step.description}</p>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Technical Details:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {step.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologyPage;
