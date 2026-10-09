import React from 'react';
import { Microscope, Github, BookOpen, AlertTriangle, Cpu, Brain, Zap } from 'lucide-react';
import type { Page } from '../types';
import { MORPHOLOGY_CLASSES } from '../data/mockData';
import MorphologyBadge from '../components/shared/MorphologyBadge';
import type { MorphologyClass } from '../types';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">About RBC Insight AI</h1>
        <p className="text-sm text-slate-500 mt-1">
          Final Year B.Tech AI/ML Project · EfficientNetV2 · Grad-CAM
        </p>
      </div>

      {/* Hero card */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <Microscope size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">RBC Insight AI</h2>
              <p className="text-blue-100 text-sm">AI-Powered RBC Morphology Analysis System</p>
            </div>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            RBC Insight AI is an end-to-end artificial intelligence system for automated red blood
            cell morphology classification. It combines computer vision, deep learning, and
            explainable AI to provide research-grade analysis of peripheral blood smear images.
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Model', value: 'EfficientNetV2', icon: <Cpu size={16} className="text-blue-500" /> },
              { label: 'Explainability', value: 'Grad-CAM', icon: <Brain size={16} className="text-purple-500" /> },
              { label: 'Classes', value: '12 Types', icon: <Zap size={16} className="text-teal-500" /> },
              { label: 'Framework', value: 'React + TS', icon: <BookOpen size={16} className="text-green-500" /> },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-center mb-1">{item.icon}</div>
                <p className="text-sm font-bold text-slate-800">{item.value}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen size={15} className="text-blue-500" />
            Project Overview
          </h3>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              This system was developed as a final-year B.Tech project in Artificial Intelligence and
              Machine Learning. The goal is to demonstrate an end-to-end AI pipeline for automated
              hematological image analysis.
            </p>
            <p>
              The application combines classical image processing techniques (OpenCV-based
              segmentation) with modern deep learning (EfficientNetV2 transfer learning) and
              explainable AI (Grad-CAM) to provide interpretable predictions.
            </p>
            <p>
              The system supports 12 RBC morphology classes, covering the most clinically significant
              abnormalities found in peripheral blood smears.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Cpu size={15} className="text-purple-500" />
            Technical Stack
          </h3>
          <div className="space-y-2">
            {[
              { category: 'Frontend', items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
              { category: 'Deep Learning', items: ['EfficientNetV2', 'Transfer Learning', 'TensorFlow/PyTorch'] },
              { category: 'Image Processing', items: ['OpenCV', 'Watershed Segmentation', 'CLAHE Enhancement'] },
              { category: 'Explainability', items: ['Grad-CAM', 'Gradient Analysis', 'Heatmap Visualization'] },
            ].map((section) => (
              <div key={section.category} className="flex gap-3">
                <span className="text-xs font-semibold text-slate-500 w-28 flex-shrink-0 pt-0.5">
                  {section.category}
                </span>
                <div className="flex flex-wrap gap-1">
                  {section.items.map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Morphology classes */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Supported RBC Morphology Classes (12 Total)
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {MORPHOLOGY_CLASSES.map((cls) => (
            <MorphologyBadge key={cls} morphology={cls as MorphologyClass} size="md" />
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Each class represents a distinct red blood cell morphology pattern that may be associated with
          various hematological conditions. The model is trained to classify individual RBCs into one of
          these 12 categories.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="card p-5 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-800 mb-2">Important Disclaimer</h3>
            <div className="space-y-2 text-xs text-amber-700">
              <p>
                <span className="font-semibold">Research & Educational Use Only:</span> RBC Insight AI is
                developed strictly for academic and research demonstration purposes as part of a final-year
                undergraduate project.
              </p>
              <p>
                <span className="font-semibold">Not a Medical Device:</span> This application is not a
                certified medical device and has not been validated for clinical use. It should not be used
                to make any medical decisions.
              </p>
              <p>
                <span className="font-semibold">Professional Review Required:</span> All AI-generated
                results must be interpreted by qualified medical professionals with appropriate clinical
                context, laboratory data, and patient information.
              </p>
              <p>
                <span className="font-semibold">Accuracy Limitations:</span> The model may not accurately
                classify all RBC morphologies, especially in cases of mixed abnormalities or image quality
                issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('methodology')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <BookOpen size={15} />
          View Methodology
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
          <Github size={15} />
          GitHub Repository
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
