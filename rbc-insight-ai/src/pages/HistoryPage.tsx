import React, { useState } from 'react';
import { Search, Eye, Filter, CheckCircle2, Calendar } from 'lucide-react';
import type { Page } from '../types';
import { MOCK_HISTORY, MOCK_RBC_IMAGE } from '../data/mockData';
import MorphologyBadge from '../components/shared/MorphologyBadge';
import type { MorphologyClass } from '../types';

interface HistoryPageProps {
  onNavigate: (page: Page) => void;
}

const MORPHOLOGY_OPTIONS = [
  'All', 'Normal', 'Macrocyte', 'Microcyte', 'Spherocyte', 'Target Cell',
  'Stomatocyte', 'Ovalocyte', 'Teardrop', 'Burr Cell', 'Schistocyte',
  'Hypochromia', 'Uncategorized',
];

const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [morphFilter, setMorphFilter] = useState('All');
  const [confFilter, setConfFilter] = useState('All');

  const filtered = MOCK_HISTORY.filter((item) => {
    const matchSearch =
      item.analysisId.toLowerCase().includes(search.toLowerCase()) ||
      item.predictedClass.toLowerCase().includes(search.toLowerCase());
    const matchMorph = morphFilter === 'All' || item.predictedClass === morphFilter;
    const matchConf =
      confFilter === 'All' ||
      (confFilter === 'High' && item.confidence >= 90) ||
      (confFilter === 'Medium' && item.confidence >= 70 && item.confidence < 90) ||
      (confFilter === 'Low' && item.confidence < 70);
    return matchSearch && matchMorph && matchConf;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Analysis History</h1>
        <p className="text-sm text-slate-500 mt-1">{MOCK_HISTORY.length} total analyses</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-48 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 text-sm"
            />
          </div>

          {/* Morphology filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={morphFilter}
              onChange={(e) => setMorphFilter(e.target.value)}
              className="input-field text-sm pr-8 cursor-pointer"
            >
              {MORPHOLOGY_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Confidence filter */}
          <select
            value={confFilter}
            onChange={(e) => setConfFilter(e.target.value)}
            className="input-field text-sm pr-8 cursor-pointer"
          >
            {['All', 'High (≥90%)', 'Medium (70-90%)', 'Low (<70%)'].map((o) => (
              <option key={o} value={o.split(' ')[0]}>
                {o}
              </option>
            ))}
          </select>

          {(search || morphFilter !== 'All' || confFilter !== 'All') && (
            <button
              onClick={() => { setSearch(''); setMorphFilter('All'); setConfFilter('All'); }}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Analysis ID', 'Image', 'Prediction', 'Confidence', 'Date', 'Status', 'Actions'].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    No analyses match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-blue-600">
                        {item.analysisId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                        <img src={MOCK_RBC_IMAGE} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <MorphologyBadge morphology={item.predictedClass as MorphologyClass} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {item.confidence.toFixed(2)}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={11} />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onNavigate('results')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={11} />
                          View
                        </button>
                        <button
                          onClick={() => onNavigate('report')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {MOCK_HISTORY.length} results</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
