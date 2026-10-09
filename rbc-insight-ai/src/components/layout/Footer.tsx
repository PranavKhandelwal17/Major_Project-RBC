import React from 'react';
import { Microscope, AlertTriangle } from 'lucide-react';
import type { Page } from '../../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Disclaimer banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Research & Educational Use Only:</span> This application does not
            provide a medical diagnosis. Results must be interpreted by qualified healthcare professionals
            using appropriate clinical information.
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Microscope size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">RBC Insight AI</p>
              <p className="text-xs text-slate-500">AI-assisted RBC morphology analysis</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-4 text-xs text-slate-500">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-700 transition-colors">
              About
            </button>
            <button onClick={() => onNavigate('methodology')} className="hover:text-slate-700 transition-colors">
              Methodology
            </button>
            <button className="hover:text-slate-700 transition-colors">Privacy</button>
            <button className="hover:text-slate-700 transition-colors">Disclaimer</button>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-400">
            © 2026 RBC Insight AI · Final Year B.Tech Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
