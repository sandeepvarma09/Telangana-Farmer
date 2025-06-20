
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useBackground } from '../src/contexts/BackgroundContext'; // Import useBackground
import { Language } from '../types';
import { BellIcon, GlobeIcon, SunIcon, MoonIcon } from './icons/CoreIcons'; // Added SunIcon, MoonIcon

// TODO: User, please replace "YOUR_NEW_LOGO_URL_HERE" with the actual URL of your new logo. 
// The image should be publicly accessible. The original path provided was a local file path.
const NEW_TELANGANA_GOVT_LOGO_URL = "YOUR_NEW_LOGO_URL_HERE"; 

const Header: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { isHighContrastMode, toggleHighContrastMode } = useBackground(); // Get high contrast state and toggle

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language);
  };

  const languageOptions = [
    { value: Language.English, label: t('english') },
    { value: Language.Telugu, label: t('telugu') },
    { value: Language.Hindi, label: t('hindi') },
  ];

  return (
    <header className="bg-primary-dark text-white shadow-md sticky top-0 z-50">
      {/* Container ensures padding and centering, h-13 sets the new effective height */}
      <div className="container mx-auto px-4 pt-1 pb-2 flex justify-between items-center h-13"> {/* Changed py-2 to pt-1 pb-2, and h-14 to h-13 */}
        <div className="flex items-center">
          <img 
            src={NEW_TELANGANA_GOVT_LOGO_URL === "YOUR_NEW_LOGO_URL_HERE" ? "https://i.ibb.co/6P6XyR7/image.png" : NEW_TELANGANA_GOVT_LOGO_URL} // Fallback to old logo if placeholder is not replaced
            alt="Telangana Government Logo" 
            className="h-10 w-auto mr-2 md:mr-3" // h-10 is 40px (2.5rem)
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate" title={t('appName')}>
            {t('appName')}
          </h1>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
          <button
            onClick={toggleHighContrastMode}
            className="p-1.5 sm:p-2 rounded-full hover:bg-primary-light/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isHighContrastMode ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
            title={isHighContrastMode ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
          >
            {isHighContrastMode ? <SunIcon className="w-5 h-5 md:w-6 md:h-6" /> : <MoonIcon className="w-5 h-5 md:w-6 md:h-6" />} 
          </button>
          <div className="relative flex items-center">
            <GlobeIcon className="w-5 h-5 md:w-6 md:h-6 mr-1 text-white flex-shrink-0" />
            <select
              value={currentLanguage}
              onChange={handleLanguageChange}
              className="bg-primary-dark text-white py-1 sm:py-1.5 pl-1 pr-6 sm:pr-8 border border-primary-light/50 rounded-md focus:outline-none focus:ring-1 focus:ring-white appearance-none text-xs sm:text-sm md:text-base"
              aria-label={t('language')}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-white text-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2 text-white">
              <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S5.922 9.581 5.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
              </svg>
            </div>
          </div>
          <button
            className="p-1.5 sm:p-2 rounded-full hover:bg-primary-light/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={t('notifications')}
          >
            <BellIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
