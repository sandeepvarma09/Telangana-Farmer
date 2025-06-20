
import React from 'react';
import { AiTipData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { LightBulbIcon } from './icons/CoreIcons';

interface AiTipCardProps {
  tipData: AiTipData | null;
}

const AiTipCard: React.FC<AiTipCardProps> = ({ tipData }) => {
  const { t } = useLanguage();

  if (!tipData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
        {t('loading')}
      </div>
    );
  }

  const { title, content } = tipData;

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="flex items-start mb-2">
        <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-yellow-700">{t('aiTipTitle')}</h3>
          <p className="text-md sm:text-lg font-semibold text-gray-800 mt-1">{title}</p>
        </div>
      </div>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed ml-9">{content}</p>
    </div>
  );
};

export default AiTipCard;
