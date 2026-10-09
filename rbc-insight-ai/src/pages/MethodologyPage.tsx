import React from 'react';
import {
  Upload,
  Sliders,
  Scissors,
  Cpu,
  BarChart2,
  Eye,
  FileText,
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    id: 'input',
    icon: <Upload size={24} />,
    title: 'User Input',
    color: 'blue',
    description:
      'The user uploads a peripheral blood smear image in PNG or JPEG format. The system validates file type, size, and image integrity before proceeding.',
    details: ['Supported: PNG, JPG, JPEG', 'Max size: 10 MB', 'Validation & preview', 'Drag & drop interface'],
  },
  {
    number: '02',
    id: 'preprocessing',
    icon: <Sliders size={24} />,
    title: 'Image Preprocessing',
    color: 'teal',
    description:
      'The uploaded image is preprocessed to prepare it for deep learning classification. Preprocessing standardizes inputs and improves model performance.',
    details: ['Resize to 224 × 224 px', 'Pixel normalization [0,1]', 'CLAHE contrast enhancement', 'Gaussian noise reduction', 'Data augmentation'],
  },
  {
    number: '03',
    id: 'segmentation',
    icon: <Scissors size={24} />,
    title: 'RBC Segmentation',
    color: 'purple',
    description:
      'Individual red blood cells are detected and segmented from the blood smear image. Overlapping cells are separated using ellipse fitting and the Watershed algorithm.',
    details: ['Ellipse fitting for cell boundaries', 'Watershed algorithm', 'Overlap separation', 'Individual cell isolation', '94%+ accuracy'],
  },
  {
    number: '04',
    id: 'classification',
    icon: <Cpu size={24} />,
    title: 'EfficientNetV2 Classification',
    color: 'blue',
    description:
      'Each segmented RBC is classified using a fine-tuned EfficientNetV2 model trained with transfer learning on a labeled RBC morphology dataset.',
    details: ['Architecture: EfficientNetV2', 'Transfer learning from ImageNet', '12 morphology classes', 'Compound scaling', 'Fine-tuned on RBC dataset'],
  },
  {
    number: '05',
    id: 'prediction',
    icon: <BarChart2 size={24} />,
    title: 'Prediction Output',
    color: 'teal',
    description:
      'The model outputs a softmax probability vector across 12 RBC morphology classes. The highest-probability class is selected as the final prediction.',
    details: ['Softmax probability output', 'Top-3 predictions displayed', 'Confidence score', 'Probability distribution chart', 'Class labels'],
  },
  {
    number: '06',
    id: 'gradcam',
    icon: <Eye size={24} />,
    title: 'Grad-CAM Explainability',
    color: 'orange',
    description:
      'Gradient-weighted Class Activation Mapping (Grad-CAM) is used to generate heatmaps showing which regions of the RBC image most influenced the prediction.',
    details: ['Gradient-based visualization', 'Heatmap generation', 'Overlay mode', 'Attention highlighting', 'Feature importance analysis'],
  },
  {
    number: '07',
    id: 'report',
    icon: <FileText size={24} />,
    title: 'Clinical Report Generation',
    color: 'green',
    description:
      'A structured AI-generated analysis report is produced, including morphology details, prediction confidence, Grad-CAM explanation, and clinical significance notes.',
    details: ['PDF export', 'Print functionality', 'Clinical significance notes', 'Disclaimer included', 'Analysis ID & timestamp'],
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
      <div>
        <h1 className="text-2xl font-black text-slate-800">Methodology</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete AI pipeline for RBC morphology classification and explainability
        </p>
      </div>

      {/* Pipeline overview */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 text-white">
          <h2 className="text-base font-bold mb-1">AI Analysis Pipeline</h2>
          <p className="text-sm text-slate-300">
            A 7-step end-to-end pipeline from image upload to clinical report generation.
          </p>
        </div>
        <div className="p-6">
          {/* Horizontal pipeline for desktop */}
          <div className="hidden lg:flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => {
              const c = colorMap[step.color];
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
                      {step.icon}
                    </div>
                    <span className={`px-2 py-0.5 ${c.badge} text-white text-xs font-bold rounded-full`}>
                      {step.number}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 text-center max-w-[80px] leading-tight">
                      {step.title}
                    </p>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-shrink-0 flex items-center gap-0 pb-10">
                      <div className="w-6 h-0.5 bg-slate-200" />
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-slate-300" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step cards */}
          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const c = colorMap[step.color];
              return (
                <div key={step.id} className="flex gap-4">
                  {/* Left: number + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}
                    >
                      {step.icon}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 mt-2 mb-0 min-h-[16px]" />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className={`flex-1 p-4 ${c.bg} rounded-xl border ${c.border} mb-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 ${c.badge} text-white text-xs font-bold rounded-full`}
                      >
                        Step {step.number}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800">{step.title}</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">{step.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.details.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 bg-white/70 text-slate-600 text-xs font-medium rounded-md border border-white/80"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technical specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Deep Learning Model',
            items: ['EfficientNetV2-S architecture', 'Pre-trained on ImageNet', 'Fine-tuned on RBC dataset', '12 morphology classes', 'Transfer learning approach'],
          },
          {
            title: 'Image Processing',
            items: ['OpenCV preprocessing', 'Watershed segmentation', 'Ellipse fitting (Hough transform)', 'CLAHE enhancement', 'Gaussian blur denoising'],
          },
          {
            title: 'Explainability',
            items: ['Grad-CAM visualization', 'Last convolutional layer gradients', 'Heatmap generation', 'Overlay mode', 'Feature attribution analysis'],
          },
        ].map((section) => (
          <div key={section.title} className="card p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">{section.title}</h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MethodologyPage;
