import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RiskTierGuide from './components/RiskTierGuide';
import FeatureHighlights from './components/FeatureHighlights';
import InteractiveDemoPreview from './components/InteractiveDemoPreview';
import Footer from './components/Footer';
import DocsView from './components/DocsView';
import BulkView from './components/BulkView';
import SingleView from './components/SingleView';
import { ShieldCheck, ArrowRight, Sparkles, UploadCloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [apiConnected, setApiConnected] = useState(false);

  // Ping FastAPI server on load to check status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/', { method: 'GET' });
        setApiConnected(res.ok || res.status === 404); // If server answers, backend is running
      } catch (err) {
        setApiConnected(false);
      }
    };
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)' }}>
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiConnected={apiConnected} 
      />

      {/* Main Content Body */}
      <main style={{ flex: 1 }}>
        {activeTab === 'landing' && (
          <>
            {/* 1. Hero Section */}
            <HeroSection 
              onStartSingle={() => setActiveTab('single')} 
              onStartBulk={() => setActiveTab('bulk')} 
            />

            {/* 2. Risk Tier Matrix Guide */}
            <RiskTierGuide />

            {/* 3. Interactive Quick Risk Preview Widget */}
            <InteractiveDemoPreview 
              onNavigateSingle={() => setActiveTab('single')} 
            />

            {/* 4. Platform Architectural Highlights */}
            <FeatureHighlights />
          </>
        )}

        {/* Single Applicant Evaluation View */}
        {activeTab === 'single' && <SingleView />}

        {/* Bulk CSV Batch Processing View */}
        {activeTab === 'bulk' && <BulkView />}

        {activeTab === 'docs' && <DocsView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
