import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Award,
  BarChart3,
  Layers,
  ArrowRight,
  Database,
  Sliders,
} from 'lucide-react';
import type { Page, ModelCandidate, PerClassMetric } from '../types';
import { getModelComparison } from '../services/api';
import { MODEL_CANDIDATES, PER_CLASS_METRICS } from '../data/mockData';
import MorphologyBadge from '../components/shared/MorphologyBadge';
import type { MorphologyClass } from '../types';

interface ModelPerformancePageProps {
  onNavigate?: (page: Page) => void;
}

const ModelPerformancePage: React.FC<ModelPerformancePageProps> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<ModelCandidate[]>(MODEL_CANDIDATES);
  const [perClass, setPerClass] = useState<PerClassMetric[]>(PER_CLASS_METRICS);
  const [selectedCandidate, setSelectedCandidate] = useState<ModelCandidate>(
    MODEL_CANDIDATES.find((c) => c.selected) || MODEL_CANDIDATES[0]
  );
  const [activeTab, setActiveTab] = useState<'comparison' | 'classwise' | 'matrix'>('comparison');

  useEffect(() => {
    getModelComparison().then((data) => {
      if (data?.candidates) setCandidates(data.candidates);
      if (data?.perClassMetrics) setPerClass(data.perClassMetrics);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border border-blue-900/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30 text-xs font-semibold text-blue-300 mb-3">
              <Award size={14} className="text-yellow-400" />
              Empirical Model Evaluation & Benchmark
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Model Evaluation & Selection
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Systematic comparison of 5 candidate deep learning architectures trained and evaluated on 
              17,707 RBC images from the Chula-RBC-12 dataset. The winner was selected based on test accuracy 
              and minority-class macro F1-score.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex-shrink-0 text-center min-w-[200px]">
            <p className="text-xs uppercase font-bold tracking-wider text-blue-200">Winner Architecture</p>
            <p className="text-lg font-black text-white mt-1">EfficientNetV2-S</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-300 rounded-lg text-xs font-semibold border border-green-500/30">
              <CheckCircle2 size={13} />
              87.04% Val / 85.36% Test
            </div>
          </div>
        </div>
      </div>

      {/* Dataset & Split Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Smear Cells', val: '17,707', desc: 'Chula-RBC-12 dataset', icon: <Database size={16} /> },
          { label: 'Training Set', val: '11,937', desc: 'Augmented transfer split', icon: <Layers size={16} /> },
          { label: 'Validation Split', val: '2,908', desc: 'Checkpoint optimization', icon: <Sliders size={16} /> },
          { label: 'Reserved Test Set', val: '2,862', desc: 'Final unbiased benchmark', icon: <BarChart3 size={16} /> },
        ].map((item, idx) => (
          <div key={idx} className="card p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <span className="text-blue-600">{item.icon}</span>
              {item.label}
            </div>
            <p className="text-2xl font-black text-slate-800">{item.val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'comparison'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Candidate Comparison Table
        </button>
        <button
          onClick={() => setActiveTab('classwise')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'classwise'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Per-Class Metrics (12 Morphologies)
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'matrix'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Confusion Matrix & Diagnostics
        </button>
      </div>

      {/* Tab 1: Candidate Comparison Table */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Experimental Model Benchmark Comparison</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  All models evaluated using the same normalized 224×224 input and 2,862 reserved test samples
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-md border border-blue-200 w-fit">
                Evaluated: October 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Architecture Candidate</th>
                    <th className="px-3 py-3 text-center">Val Acc</th>
                    <th className="px-3 py-3 text-center">Test Acc</th>
                    <th className="px-3 py-3 text-center">Macro F1</th>
                    <th className="px-3 py-3 text-center">Macro Recall</th>
                    <th className="px-3 py-3 text-center">Model Size</th>
                    <th className="px-3 py-3 text-center">Inference Latency</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {candidates.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className={`cursor-pointer transition-colors ${
                        c.selected ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {c.selected && <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />}
                          <div>
                            <p className="font-bold text-slate-800">{c.name}</p>
                            <p className="text-slate-400 font-mono text-[10px]">{c.checkpointPath}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center font-bold text-slate-700">{c.valAccuracy.toFixed(2)}%</td>
                      <td className="px-3 py-3.5 text-center font-black text-blue-600 text-sm">
                        {c.testAccuracy.toFixed(2)}%
                      </td>
                      <td className="px-3 py-3.5 text-center font-semibold text-slate-700">{c.macroF1.toFixed(2)}%</td>
                      <td className="px-3 py-3.5 text-center text-slate-600">{c.macroRecall.toFixed(2)}%</td>
                      <td className="px-3 py-3.5 text-center font-mono text-slate-600">{c.modelSizeMB.toFixed(1)} MB</td>
                      <td className="px-3 py-3.5 text-center font-mono text-slate-600">{c.avgInferenceLatencyMs} ms</td>
                      <td className="px-3 py-3.5 text-center">
                        {c.selected ? (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                            Selected Winner
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-medium text-[10px]">
                            Candidate
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selection Rationale Card */}
          {/* Selected Candidate Inspector */}
          {selectedCandidate && (
            <div className="card p-4 bg-slate-50 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inspecting Candidate</span>
                  <h4 className="text-sm font-bold text-slate-800">{selectedCandidate.name}</h4>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span><strong>Test Acc:</strong> {selectedCandidate.testAccuracy.toFixed(2)}%</span>
                  <span><strong>Macro F1:</strong> {selectedCandidate.macroF1.toFixed(2)}%</span>
                  <span><strong>Size:</strong> {selectedCandidate.modelSizeMB.toFixed(1)} MB</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                {selectedCandidate.selectionRationale}
              </p>
            </div>
          )}

          <div className="card p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award size={20} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-blue-900">
                    Why EfficientNetV2-S was Selected
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-[10px] font-bold rounded">
                    Objective Decision
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  While MobileNetV2 achieved faster latency (14.8 ms vs 42.5 ms), its macro precision (63.85%) and 
                  overall test accuracy (72.99%) were substantially inferior. EfficientNet-B1 fine-tuning achieved 77.85% 
                  accuracy, but struggled on highly critical, rare morphologies like Schistocytes (sheared helmet cells) and 
                  Teardrop cells. 
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>EfficientNetV2-S controlled fine-tuning</strong> achieved the highest test accuracy (<strong>85.36%</strong>) 
                  and the highest macro F1-score (<strong>79.02%</strong>), outperforming the baseline by <strong>+12.37%</strong>. 
                  Its progressive learning capability accurately captured subtle biconcave rim depressions and membrane 
                  spiculations while keeping inference latency well within real-time clinical inspection thresholds (&lt;50ms).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Per-Class Metrics */}
      {activeTab === 'classwise' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Per-Class Performance on Test Split (EfficientNetV2-S)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated across all 12 classes with class support breakdown
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Total Test Samples: 2,862</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">Class Name</th>
                  <th className="px-3 py-3 text-center">Precision</th>
                  <th className="px-3 py-3 text-center">Recall</th>
                  <th className="px-3 py-3 text-center">F1-Score</th>
                  <th className="px-3 py-3 text-center">Test Support</th>
                  <th className="px-4 py-3">Performance Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {perClass.map((m) => (
                  <tr key={m.classId} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MorphologyBadge morphology={m.className as MorphologyClass} size="sm" />
                        <span className="font-semibold text-slate-800">{m.className}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-semibold text-slate-700">
                      {(m.precision * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-semibold text-slate-700">
                      {(m.recall * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-black text-blue-600">
                      {(m.f1 * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-slate-500">{m.support}</td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${m.f1 * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Confusion Matrix & Visualization */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Normalized Confusion Matrix</h3>
              <p className="text-xs text-slate-500 mb-4">
                Demonstrating clear diagonal dominance with minimal inter-class confusion.
              </p>
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <img
                  src="http://localhost:8000/static/visualizations/01_confusion_matrix.png"
                  alt="Confusion Matrix"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Training & Validation Convergence</h3>
              <p className="text-xs text-slate-500 mb-4">
                Loss curves demonstrating controlled gradient convergence without overfitting.
              </p>
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <img
                  src="http://localhost:8000/static/visualizations/06_training_validation_accuracy.png"
                  alt="Training Accuracy"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action CTA */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-sm">Want to test this model on an RBC microscopy image?</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload an image or launch demo mode to observe real-time classification and Grad-CAM.
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('new-analysis')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl transition-all shadow-md flex-shrink-0"
        >
          Start New Analysis <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ModelPerformancePage;
