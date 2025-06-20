
import React, { useState }  from 'react';
import { useLanguage } from '../../hooks/useLanguage'; 
import { ArrowRightOnRectangleIcon, UserPlusIcon, GlobeIcon, UserCircleIcon, KeyIcon } from '../../../components/icons/CoreIcons'; // Corrected path
import { Language } from '../../types';

const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'farmer' && password === 'password') {
      onLoginSuccess();
    } else {
      setError(t('loginErrorInvalid', 'Invalid credentials. Try "farmer" and "password".'));
    }
    setIsLoading(false);
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
    // Removed bg-gray-100, Layout component will handle page background type
    <div className="flex flex-col items-center justify-center min-h-full p-4"> 
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-2xl relative">
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

        <div className="flex justify-center mb-6 mt-8 sm:mt-4"> 
          {/* Placeholder for a logo if needed, or rely on appName */}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary-dark mb-2">{t('appName')}</h1>
        <p className="text-center text-gray-600 mb-8">{t('loginPageWelcome', 'Welcome back, please login to your account.')}</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t('loginUsernameLabel', 'Username / Mobile Number')}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus:ring-primary focus:border-primary block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                placeholder={t('loginUsernamePlaceholder', 'Enter your username or mobile')}
                />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('loginPasswordLabel', 'Password')}
            </label>
             <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-primary focus:border-primary block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                placeholder={t('loginPasswordPlaceholder', 'Enter your password')}
                />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {isLoading ? t('loggingIn', 'Logging in...') : t('loginButton', 'Login')}
              {!isLoading && <ArrowRightOnRectangleIcon className="ml-2 w-5 h-5"/>}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('loginNoAccount', "Don't have an account?")}{' '}
            <a href="#/signup-role" className="font-medium text-primary hover:text-primary-dark"> {/* Updated href */}
              {t('loginSignUpLink', 'Sign Up')}
               <UserPlusIcon className="inline ml-1 w-4 h-4 align-text-bottom" />
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

export default LoginPage;
