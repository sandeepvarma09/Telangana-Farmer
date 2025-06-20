
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Language } from '../../types';
import { GlobeIcon, UserGroupIcon, UserTieIcon } from '../../../components/icons/CoreIcons'; // Corrected path

const SignupRoleSelectionPage: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'farmer' | 'admin') => {
    // For now, both roles lead to the same generic signup form.
    // This could be expanded later to role-specific forms or data collection.
    navigate('/signup'); 
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language);
  };

  const languageOptions = [
    { value: Language.English, label: 'English' },
    { value: Language.Telugu, label: 'తెలుగు' },
    { value: Language.Hindi, label: 'हिन्दी' },
  ];


  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-2xl relative">
        <div className="absolute top-4 right-4 z-10">
          <div className="relative flex items-center">
            <GlobeIcon className="w-5 h-5 md:w-6 md:h-6 mr-1 text-gray-600" />
            <select
              value={currentLanguage}
              onChange={handleLanguageChange}
              className="bg-white text-gray-700 py-1.5 pl-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none text-sm"
              aria-label={t('language')}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-white text-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S5.922 9.581 5.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-center text-primary-dark mt-8 sm:mt-4 mb-2">
          {t('signUpAsTitle', '📝 Sign Up As')}
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
          {t('signUpAsPrompt', 'Choose your role to continue:')}
        </p>

        <div className="space-y-6">
          {/* Farmer Role Card */}
          <div className="bg-primary-light/10 p-6 rounded-lg border border-primary-light shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <UserGroupIcon className="w-10 h-10 text-primary mr-4" />
              <h2 className="text-xl font-semibold text-primary-dark">{t('roleFarmer', '👨‍🌾 Farmer')}</h2>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              {t('roleFarmerDesc', 'Access crop details, market rates, farming guides, and connect with experts.')}
            </p>
            <button
              onClick={() => handleRoleSelection('farmer')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-md transition-colors"
            >
              {t('signUpAsFarmerButton', 'Sign Up as Farmer')}
            </button>
          </div>

          {/* Admin Role Card */}
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <UserTieIcon className="w-10 h-10 text-accent mr-4" />
              <h2 className="text-xl font-semibold text-accent-dark">{t('roleAdmin', '🧑‍💼 Admin')}</h2>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              {t('roleAdminDesc', 'Manage platform content, user accounts, updates, and insights.')}
            </p>
            <button
              onClick={() => handleRoleSelection('admin')}
              className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-md transition-colors"
            >
              {t('signUpAsAdminButton', 'Sign Up as Admin')}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('signupHasAccount', "Already have an account?")}{' '}
            <a href="#/login" className="font-medium text-primary hover:text-primary-dark">
              {t('loginButton', 'Login')}
            </a>
          </p>
        </div>
      </div>
      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-600"> 
          © {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved', 'All rights reserved.')}
        </p>
      </footer>
    </div>
  );
};

export default SignupRoleSelectionPage;
