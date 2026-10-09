import React, { useState, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardPage from './pages/DashboardPage';
import NewAnalysisPage from './pages/NewAnalysisPage';
import ResultsPage from './pages/ResultsPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import MethodologyPage from './pages/MethodologyPage';
import AboutPage from './pages/AboutPage';
import type { Page, AnalysisResult } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | undefined>();
  const [demoMode, setDemoMode] = useState(false);

  const handleNavigate = useCallback((page: Page, result?: AnalysisResult) => {
    setCurrentPage(page);
    if (result) setCurrentResult(result);
    if (page !== 'new-analysis') setDemoMode(false);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartDemo = useCallback(() => {
    setDemoMode(true);
    setCurrentPage('new-analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onStartDemo={handleStartDemo}
          />
        );
      case 'new-analysis':
        return (
          <NewAnalysisPage
            onNavigate={handleNavigate}
            demoMode={demoMode}
          />
        );
      case 'results':
        return (
          <ResultsPage
            result={currentResult}
            onNavigate={handleNavigate}
          />
        );
      case 'report':
        return (
          <ReportPage
            result={currentResult}
            onNavigate={handleNavigate}
          />
        );
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      case 'methodology':
        return <MethodologyPage />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      default:
        return null;
    }
  };

  const sidebarWidth = sidebarOpen ? 'lg:pl-64' : 'lg:pl-16';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="no-print">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarWidth} print:pl-0 print:m-0 print:p-0`}
      >
        {/* Header */}
        <div className="no-print">
          <Header
            currentPage={currentPage}
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 max-w-7xl mx-auto w-full print:p-0 print:m-0 print:max-w-none">
          {renderPage()}
        </main>

        {/* Footer */}
        <div className="no-print">
          <Footer onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  );
};

export default App;
