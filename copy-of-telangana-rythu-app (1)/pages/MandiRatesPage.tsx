
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MandiRateListItem from '../components/MandiRateListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { MandiRate } from '../types';
import { getMockMandiRates } from '../services/mockData';
import { useLanguage } from '../hooks/useLanguage';
import { MANDI_RATE_CATEGORIES } from '../constants';
import { PlusCircleIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '../components/icons/CoreIcons';


type CategoryKey = keyof typeof MANDI_RATE_CATEGORIES;

const MandiRatesPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>(MANDI_RATE_CATEGORIES.all as CategoryKey);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyCropsOnly, setShowMyCropsOnly] = useState(false);
  
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());

  const selectedYear = currentDisplayDate.getFullYear();
  const selectedMonth = currentDisplayDate.getMonth(); // 0-indexed

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      // Simulate API call, passing current year and month
      const mockRates = getMockMandiRates(t, selectedYear, selectedMonth);
      // Simulate "My Crops" - mark some crops as user's crops for filtering
      const ratesWithUserCrops = mockRates.map(rate => ({
        ...rate,
        isUserCrop: rate.cropName === t('cotton') || rate.cropName === t('paddy')
      }));
      setRates(ratesWithUserCrops);
      setLoading(false);
    };
    fetchRates();
  }, [t, selectedYear, selectedMonth]);

  const categoryTabs: { key: CategoryKey; labelKey: string }[] = [
    { key: MANDI_RATE_CATEGORIES.all as CategoryKey, labelKey: 'all' },
    { key: MANDI_RATE_CATEGORIES.grains as CategoryKey, labelKey: 'grains' },
    { key: MANDI_RATE_CATEGORIES.vegetables as CategoryKey, labelKey: 'vegetables' },
    { key: MANDI_RATE_CATEGORIES.pulses as CategoryKey, labelKey: 'pulses' },
  ];

  const filteredRates = useMemo(() => {
    return rates.filter(rate => {
      const matchesCategory = selectedCategory === MANDI_RATE_CATEGORIES.all || rate.category === selectedCategory;
      const matchesSearch = rate.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            rate.teluguCropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (rate.hindiCropName && rate.hindiCropName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            rate.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            rate.teluguMarketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (rate.hindiMarketName && rate.hindiMarketName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesMyCrops = !showMyCropsOnly || rate.isUserCrop;
      return matchesCategory && matchesSearch && matchesMyCrops;
    });
  }, [rates, selectedCategory, searchTerm, showMyCropsOnly]);

  const handleDateChange = useCallback((yearOffset: number, monthOffset: number) => {
    setCurrentDisplayDate(prevDate => {
      const newDate = new Date(prevDate);
      if (monthOffset !== 0) {
        newDate.setMonth(newDate.getMonth() + monthOffset);
      }
      if (yearOffset !== 0) {
        newDate.setFullYear(newDate.getFullYear() + yearOffset);
      }
      // Ensure day is valid for the new month/year (e.g. going from Mar 31 to Feb)
      // Setting day to 1 avoids issues with months having different number of days
      newDate.setDate(1); 
      return newDate;
    });
  }, []);

  const formattedMonthYear = useMemo(() => {
    const langCode = currentLanguage === 'telugu' ? 'te-IN' : currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
    return currentDisplayDate.toLocaleDateString(langCode, {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDisplayDate, currentLanguage]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sticky top-[60px] bg-gray-100 py-3 z-30 -mx-4 px-4 shadow-sm"> {/* Header compensation: approx 60px */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">{t('mandiRatesTitle')}</h2>
        <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow focus:outline-none focus:ring-2 focus:ring-primary-light">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          {t('setPriceAlert')}
        </button>
      </div>

      {/* Date Navigation */}
      <div className="bg-white p-3 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={() => handleDateChange(-1, 0)} 
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label={t('previousYear', 'Previous Year')}
          >
            <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => handleDateChange(0, -1)} 
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label={t('previousMonth', 'Previous Month')}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <span className="font-semibold text-gray-700 text-center text-lg">
          {formattedMonthYear}
        </span>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={() => handleDateChange(0, 1)} 
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label={t('nextMonth', 'Next Month')}
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => handleDateChange(1, 0)} 
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label={t('nextYear', 'Next Year')}
          >
            <ChevronDoubleRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>


      <div className="mb-4">
        <input
          type="text"
          placeholder={`${t('search')} ${t('crops')} / ${t('market')}...`}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1 sm:space-x-2 bg-gray-200 p-1 rounded-lg overflow-x-auto">
          {categoryTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap
                ${selectedCategory === tab.key ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-300'}`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <button
            onClick={() => setShowMyCropsOnly(!showMyCropsOnly)}
            className={`p-2 rounded-lg flex items-center text-sm whitespace-nowrap
            ${showMyCropsOnly ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
            <FilterIcon className="w-4 h-4 mr-1"/>
            {t('myCrops')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner text={t('loading')} />
        </div>
      ) : filteredRates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRates.map(rate => (
            <MandiRateListItem key={`${rate.id}-${selectedYear}-${selectedMonth}`} rate={rate} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10 text-lg">{t('noRatesFound')}</p>
      )}
    </div>
  );
};

export default MandiRatesPage;
