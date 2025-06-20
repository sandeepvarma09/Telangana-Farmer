
import React from 'react';
import { MyCropAlertData } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface MyCropAlertCardProps {
  alertData: MyCropAlertData | null;
}

const MyCropAlertCard: React.FC<MyCropAlertCardProps> = ({ alertData }) => {
  const { t } = useLanguage();

  if (!alertData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg text-center text-gray-500">
        {t('loading')}
      </div>
    );
  }

  const { cropName, price, mandi, trend, trendIcon: TrendIcon } = alertData;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{t('myCropAlertTitle')}</h3>
      <p className="text-sm text-gray-500 mb-3">{t('marketReport')}</p>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl sm:text-2xl font-semibold text-primary-dark">{cropName}</span>
        <TrendIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${trendColor}`} />
      </div>
      
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{price}</p>
      <p className="text-xs sm:text-sm text-gray-600">{t('price क्विंटल')}</p>
      <p className="text-sm sm:text-base text-gray-700 mt-2">{mandi}</p>
    </div>
  );
};

export default MyCropAlertCard;
