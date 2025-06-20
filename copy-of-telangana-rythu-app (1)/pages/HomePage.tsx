
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard';
import MyCropAlertCard from '../components/MyCropAlertCard';
import AiTipCard from '../components/AiTipCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { WeatherInfo, MyCropAlertData, AiTipData } from '../types';
import { getMockWeather, getMockMyCropAlert, getMockAiTip } from '../services/mockData';
import { useLanguage } from '../hooks/useLanguage';
import { useBackground, WeatherCondition } from '../src/contexts/BackgroundContext'; // Import useBackground
import { RatesIcon, ChatbotIcon as AiIcon } from '../components/icons/NavIcons';


const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { setWeatherCondition } = useBackground(); // Get setter from context
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [myCropAlertData, setMyCropAlertData] = useState<MyCropAlertData | null>(null);
  const [aiTipData, setAiTipData] = useState<AiTipData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const fetchedWeather = getMockWeather(t);
      setWeatherData(fetchedWeather);
      setMyCropAlertData(getMockMyCropAlert(t));
      setAiTipData(getMockAiTip(t));
      
      // Update background context with weather condition
      if (fetchedWeather) {
        // Map your app's weather condition string to WeatherCondition enum
        let conditionForBg: WeatherCondition = 'unknown';
        const mainCondition = fetchedWeather.condition.toLowerCase();
        if (mainCondition.includes(t('sunny').toLowerCase())) conditionForBg = 'clear';
        else if (mainCondition.includes(t('partlyCloudy').toLowerCase())) conditionForBg = 'partlyCloudy';
        else if (mainCondition.includes(t('cloudy').toLowerCase())) conditionForBg = 'overcast';
        else if (mainCondition.includes(t('rainExpected').toLowerCase())) conditionForBg = 'rain';
        // Add more specific storm/warning conditions if your weather data provides it
        // else if (mainCondition.includes("storm")) conditionForBg = 'warning'; 
        setWeatherCondition(conditionForBg);
      }
      setLoading(false);
    };
    fetchData();
  }, [t, setWeatherCondition]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text={t('loading')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WeatherCard weatherData={weatherData} />
      <MyCropAlertCard alertData={myCropAlertData} />
      <AiTipCard tipData={aiTipData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => navigate('/rates')}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center text-primary-dark"
        >
          <RatesIcon className="w-8 h-8 mr-3"/>
          <div>
            <h3 className="text-lg font-semibold">{t('mandiRatesTitle')}</h3>
            <p className="text-sm text-gray-600">{t('viewAllRates')}</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/chatbot')}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center text-primary-dark"
        >
          <AiIcon className="w-8 h-8 mr-3"/>
          <div>
            <h3 className="text-lg font-semibold">{t('aiChatbotTitle')}</h3>
            <p className="text-sm text-gray-600">{t('askAiAssistant')}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;