import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RiskTierGuide from './components/RiskTierGuide';
import FeatureHighlights from './components/FeatureHighlights';
import InteractiveDemoPreview from './components/InteractiveDemoPreview';
import Footer from './components/Footer';
import BulkView from './components/BulkView';
import SingleView from './components/SingleView';
import AboutView from './components/AboutView';
import { API_BASE_URL } from './config';

function LandingPage() {
  return (
    <>
      <HeroSection />
      <RiskTierGuide />
      <InteractiveDemoPreview />
      <FeatureHighlights />
    </>
  );
}

export default function App() {
  const [apiConnected, setApiConnected] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Sync theme with HTML root class & localStorage
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Ping FastAPI server on load to check status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/`, { method: 'GET' });
        setApiConnected(res.ok || res.status === 404);
      } catch (err) {
        setApiConnected(false);
      }
    };
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)', transition: 'background-color 0.3s ease' }}>
      {/* Navigation Header */}
      <Navbar apiConnected={apiConnected} theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Body */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/single" element={<SingleView />} />
          <Route path="/bulk" element={<BulkView />} />
          <Route path="/about" element={<AboutView />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
