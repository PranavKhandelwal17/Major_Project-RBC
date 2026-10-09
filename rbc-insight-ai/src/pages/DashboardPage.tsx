import React from 'react';
import {
  Activity,
  Target,
  Microscope,
  Server,
  TrendingUp,
  TrendingDown,
  Plus,
  BookOpen,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import type { Page } from '../types';
import { DASHBOARD_STATS, MOCK_HISTORY, MOCK_RBC_IMAGE } from '../data/mockData';
import MorphologyBadge from '../components/shared/MorphologyBadge';
import type { MorphologyClass } from '../types';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onStartDemo: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity size={20} />,
  target: <Target size={20} />,
  microscope: <Microscope size={20} />,
  server: <Server size={20} />,
};

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', badge: 'bg-teal-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'bg-green-100' },
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onStartDemo }) => {
  const recentAnalyses = MOCK_HISTORY.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white p-6 sm:p-8">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Left content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-400/30 mb-4">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-blue-200">AI System Ready · EfficientNetV2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              Intelligent RBC
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
                Morphology Analysis
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-lg">
              Upload a blood smear image and analyze red blood cell morphology using image
              preprocessing, segmentation, EfficientNetV2 classification, and Grad-CAM explainability.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('new-analysis')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5"
              >
                <Plus size={16} />
                New Analysis
              </button>
              <button
                onClick={onStartDemo}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all backdrop-blur-sm"
              >
                <Activity size={16} />
                Demo Analysis
              </button>
              <button
                onClick={() => onNavigate('methodology')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all backdrop-blur-sm"
              >
                <BookOpen size={16} />
                Methodology
              </button>
            </div>
          </div>

          {/* Right: AI illustration */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="relative">
              <div className="w-56 h-56 mx-auto relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-spin-slow" />
                <div className="absolute inset-3 rounded-full border border-teal-400/20" />

                {/* RBC visualization */}
                <div className="absolute inset-6 rounded-full bg-slate-900/80 overflow-hidden border border-blue-400/20 flex items-center justify-center">
                  <img
                    src={MOCK_RBC_IMAGE}
                    alt="RBC sample"
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Scan line */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-80 scan-line" />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 rounded-lg text-xs font-bold text-white shadow-lg">
                  AI Ready
                </div>
                <div className="absolute bottom-2 -left-8 px-2 py-1 bg-blue-600 rounded-lg text-xs font-bold text-white shadow-lg whitespace-nowrap">
                  EfficientNetV2
                </div>

                {/* Neural network nodes */}
                {[
                  { top: '15%', left: '-15%' },
                  { top: '50%', left: '-20%' },
                  { top: '80%', left: '-10%' },
                  { top: '15%', right: '-15%' },
                  { top: '50%', right: '-20%' },
                  { top: '80%', right: '-10%' },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-blue-400/60 border border-blue-300/50 animate-pulse-slow"
                    style={{ ...pos, animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">Live RBC Analysis Visualization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div key={stat.title} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <span className={colors.icon}>{iconMap[stat.icon]}</span>
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.trendUp ? 'text-green-600' : 'text-slate-500'}`}>
                  {stat.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                </span>
              </div>
              <p className="text-xl font-black text-slate-800 mb-0.5">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-600 mb-1">{stat.title}</p>
              <p className="text-xs text-slate-400">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Recent analyses */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Recent Analyses</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest RBC morphology analysis results</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Analysis ID', 'Image', 'Predicted Class', 'Confidence', 'Date', 'Status', 'Action'].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentAnalyses.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-blue-600">{item.analysisId}</td>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                      <img src={MOCK_RBC_IMAGE} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <MorphologyBadge morphology={item.predictedClass as MorphologyClass} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-slate-800">{item.confidence.toFixed(2)}%</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onNavigate('results')}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={11} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex-shrink-0 mt-0.5">⚠️</div>
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Research & Educational Use Only:</span> This AI tool is designed
          for academic demonstration. It does not constitute a medical diagnosis. All results require
          review by qualified healthcare professionals.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
