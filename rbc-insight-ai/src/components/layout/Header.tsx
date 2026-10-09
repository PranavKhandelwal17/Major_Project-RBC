import React from 'react';
import { Menu, Bell, User, Circle, Microscope, Plus } from 'lucide-react';
import type { Page } from '../../types';

interface HeaderProps {
  currentPage: Page;
  onMenuToggle: () => void;
  onNavigate: (page: Page) => void;
}

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  'new-analysis': 'New Analysis',
  results: 'Analysis Results',
  report: 'Clinical Report',
  history: 'Analysis History',
  methodology: 'Methodology',
  about: 'About',
};

const Header: React.FC<HeaderProps> = ({ currentPage, onMenuToggle, onNavigate }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: menu + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          {/* Logo for mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Microscope size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">RBC Insight AI</span>
          </div>
          {/* Page title on desktop */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-slate-800">{pageTitles[currentPage]}</h1>
          </div>
        </div>

        {/* Right: status + actions */}
        <div className="flex items-center gap-2">
          {/* System status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <Circle size={7} className="text-green-500 fill-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">System Online</span>
          </div>

          {/* New analysis button */}
          {currentPage !== 'new-analysis' && (
            <button
              onClick={() => onNavigate('new-analysis')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={14} />
              New Analysis
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          {/* User profile */}
          <button className="flex items-center gap-2 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
