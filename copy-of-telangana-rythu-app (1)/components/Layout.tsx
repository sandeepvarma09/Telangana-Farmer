

import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import DynamicBackground from '../src/components/DynamicBackground'; 
import { useBackground } from '../src/contexts/BackgroundContext'; 
import { REPORTS_PAGE_PATH } from '../constants';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isHighContrastMode } = useBackground();
  const [backgroundClass, setBackgroundClass] = React.useState('bg-page-default');
  const [showDynamicBackground, setShowDynamicBackground] = React.useState(false);

  useEffect(() => {
    let newBgClass = 'bg-page-default';
    let newShowDynamicBg = false;

    if (isHighContrastMode) {
      newBgClass = ''; 
    } else {
      switch (location.pathname) {
        case '/home':
          newShowDynamicBg = true;
          newBgClass = ''; 
          break;
        case '/guide':
          newBgClass = 'bg-page-cropguide';
          break;
        case '/rates':
          newBgClass = 'bg-page-mandirates';
          break;
        case '/calculator':
        case REPORTS_PAGE_PATH: 
          newBgClass = 'bg-page-form';
          break;
        default:
          newBgClass = 'bg-page-default';
          break;
      }
    }
    setBackgroundClass(newBgClass);
    setShowDynamicBackground(newShowDynamicBg);

  }, [location.pathname, isHighContrastMode]);

  // Header effective height: h-13 (3.25rem)
  // Bottom Navbar height: h-16 (4rem)
  // Main content internal padding: py-4 (1rem top/bottom), md:py-6 (1.5rem top/bottom)

  // Top padding: Header height + internal top padding
  // Small screens: pt-[calc(3.25rem+1rem)] = pt-[4.25rem]
  // Medium screens: md:pt-[calc(3.25rem+1.5rem)] = md:pt-[4.75rem]
  // Bottom padding: Bottom Navbar height + internal bottom padding
  // Small screens: pb-[calc(4rem+1rem)] = pb-20 (5rem)
  // Medium screens: md:pb-[calc(4rem+1.5rem)] = md:pb-[5.5rem]
  const mainContentPaddingClasses = "pt-[4.25rem] pb-20 md:pt-[4.75rem] md:pb-[5.5rem]";


  return (
    <div className={`flex flex-col min-h-screen relative ${backgroundClass}`}>
      {showDynamicBackground && !isHighContrastMode && <DynamicBackground />}
      <Header /> {/* Fixed top, h-13 (3.25rem) */}
      <main className={`flex-grow container mx-auto px-4 ${mainContentPaddingClasses} relative z-10`}> 
        {children}
      </main>
      <Navbar /> {/* Fixed bottom, h-16 (4rem) */}
      {/* Footer or other elements can go here if needed */}
    </div>
  );
};

export default Layout;