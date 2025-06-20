
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MandiRatesPage from './pages/MandiRatesPage';
import CropGuidePage from './pages/CropGuidePage';
import ChatbotPage from './pages/ChatbotPage';
import CalculatorPage from './pages/CalculatorPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './src/pages/LoginPage';
import SignupPage from './src/pages/SignupPage';
import SignupRoleSelectionPage from './src/pages/SignupRoleSelectionPage'; // Added import
import SplashScreenAnimated from './src/components/SplashScreenAnimated'; 
import { useLanguage } from './hooks/useLanguage';
import { useBackground } from './src/contexts/BackgroundContext'; 
import { REPORTS_PAGE_PATH } from './constants';
import { Language } from './types';


const App: React.FC = () => {
  const { currentLanguage } = useLanguage(); 
  const { isHighContrastMode } = useBackground(); 
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const getFontClass = () => {
    switch (currentLanguage) {
      case Language.Telugu:
        return 'telugu-font';
      case Language.Hindi:
        return 'hindi-font';
      case Language.English:
      default:
        return 'english-font';
    }
  };

  const handleSplashSequenceComplete = () => {
    setShowSplashScreen(false); 
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const bodyClasses = ['bg-page-default', getFontClass()]; 
    if (isHighContrastMode) {
      bodyClasses.push('high-contrast-mode');
    }
    document.body.className = bodyClasses.join(' ');
    
    if (showSplashScreen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    }
    return () => { 
        document.documentElement.style.overflowY = '';
        document.documentElement.style.overflowX = '';
        document.body.style.overflowY = '';
        document.body.style.overflowX = '';
    };
  }, [currentLanguage, showSplashScreen, isHighContrastMode]);


  return (
    <div className={`h-full ${getFontClass()}`}>
      <div 
        id="appRouterContainer" 
        className="h-full relative z-10" 
        style={{ opacity: showSplashScreen ? 0 : 1, display: showSplashScreen ? 'none' : 'block' }} 
      >
        <HashRouter>
          {!isLoggedIn ? (
            <Routes>
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/signup-role" element={<SignupRoleSelectionPage />} /> {/* Added route */}
              <Route path="/signup" element={<SignupPage />} /> 
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <Layout> 
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/rates" element={<MandiRatesPage />} />
                <Route path="/guide" element={<CropGuidePage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path={REPORTS_PAGE_PATH} element={<ReportsPage />} />
                <Route path="/login" element={<Navigate to="/home" replace />} />
                <Route path="/signup-role" element={<Navigate to="/home" replace />} />
                <Route path="/signup" element={<Navigate to="/home" replace />} />
              </Routes>
            </Layout>
          )}
        </HashRouter>
      </div>

      {showSplashScreen && (
        <SplashScreenAnimated 
          onAnimationComplete={handleSplashSequenceComplete} 
          loginContainerSelector="#appRouterContainer"
        />
      )}
    </div>
  );
};

export default App;
