import React from 'react';
import type { AnalysisResult, Page } from '../types';
import { MOCK_ANALYSIS_RESULT } from '../data/mockData';
import ClinicalReport from '../components/analysis/ClinicalReport';

interface ReportPageProps {
  result?: AnalysisResult;
  onNavigate: (page: Page) => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ result: propResult }) => {
  const result = propResult || MOCK_ANALYSIS_RESULT;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Clinical Report</h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-generated analysis report for {result.analysisId}
        </p>
      </div>
      <ClinicalReport result={result} />
    </div>
  );
};

export default ReportPage;
