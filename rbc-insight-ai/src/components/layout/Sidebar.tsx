import React from 'react';
import {
  LayoutDashboard,
  Plus,
  History,
  BookOpen,
  Info,
  Microscope,
  Circle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import type { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'new-analysis', label: 'New Analysis', icon: <Plus size={18} /> },
  { id: 'history', label: 'Analysis History', icon: <History size={18} /> },
  { id: 'methodology', label: 'Methodology', icon: <BookOpen size={18} /> },
  { id: 'about', label: 'About', icon: <Info size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-white border-r border-slate-200 shadow-lg
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0 lg:w-16'}
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 min-w-[64px]">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
            <Microscope size={16} className="text-white" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 whitespace-nowrap">RBC Insight AI</p>
              <p className="text-xs text-slate-400 whitespace-nowrap">Morphology Analyzer</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1 min-w-[64px]">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={!isOpen ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 cursor-pointer text-left
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 px-3 py-4 min-w-[64px]">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <Circle size={8} className="text-green-500 fill-green-500 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-700 whitespace-nowrap">AI System Ready</p>
                <p className="text-xs text-slate-400 whitespace-nowrap">EfficientNetV2 Loaded</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Circle size={8} className="text-green-500 fill-green-500" />
            </div>
          )}
        </div>

        {/* Toggle button (desktop) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2
            w-6 h-6 bg-white border border-slate-200 rounded-full shadow-sm
            items-center justify-center text-slate-500 hover:text-slate-700 hover:shadow-md
            transition-all duration-200 z-50"
        >
          {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </aside>

      {/* Mobile close button when open */}
      {isOpen && (
        <button
          onClick={onToggle}
          className="lg:hidden fixed top-4 right-4 z-50 w-8 h-8 bg-white rounded-full shadow-md
            flex items-center justify-center text-slate-500 hover:text-slate-700 border border-slate-200"
        >
          <X size={14} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
