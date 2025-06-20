
import React from 'react';
import { WeatherInfo } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface WeatherCardProps {
  weatherData: WeatherInfo | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const { t, currentLanguage } = useLanguage();

  if (!weatherData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg text-center text-gray-500">
        {t('loading')}
      </div>
    );
  }

  const { temperature, condition, icon: WeatherIcon, forecast } = weatherData;

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">{t('weatherTitle')}</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-1">{temperature}°C</p>
          <p className="text-sm sm:text-base capitalize">{condition}</p>
        </div>
        <WeatherIcon className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300" />
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-300/50">
        <h4 className="text-sm sm:text-base font-semibold mb-2">{t('forecast')} (3 {t('days') || (currentLanguage === 'telugu' ? 'రోజులు' : 'days')})</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {forecast.map((item, index) => (
            <div key={index} className="bg-white/20 p-2 rounded-lg">
              <p className="text-xs sm:text-sm font-medium">{item.day}</p>
              <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto my-1 text-yellow-300" />
              <p className="text-xs sm:text-sm font-semibold">{item.temp}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
