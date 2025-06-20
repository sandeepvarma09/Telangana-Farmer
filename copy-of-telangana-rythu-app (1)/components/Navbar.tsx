
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { HomeIcon, RatesIcon, GuideIcon, ChatbotIcon, CalculatorIcon, ReportsIcon } from './icons/NavIcons'; 
import { REPORTS_PAGE_PATH } from '../constants';

interface NavItem {
  path: string;
  labelKey: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/home', labelKey: 'home', icon: HomeIcon },
  { path: '/rates', labelKey: 'rates', icon: RatesIcon },
  { path: '/guide', labelKey: 'guide', icon: GuideIcon },
  { path: REPORTS_PAGE_PATH, labelKey: 'reports', icon: ReportsIcon },
  { path: '/chatbot', labelKey: 'chatbot', icon: ChatbotIcon },
  { path: '/calculator', labelKey: 'calculator', icon: CalculatorIcon },
];

const Navbar: React.FC = () => {
  const { t } = useLanguage();

  const baseClasses = "fixed bottom-0 left-0 right-0 bg-white shadow-md z-40 h-16 border-t border-gray-200";

  return (
    <nav className={baseClasses}>
      <div className="container mx-auto flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-1/${navItems.length} text-xs p-1 h-full ${
                isActive ? 'text-primary-dark border-t-2 border-primary-dark -mt-px' : 'text-gray-500 hover:text-primary' // Adjusted for bottom border look
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-0.5" />
            <span className="truncate">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;