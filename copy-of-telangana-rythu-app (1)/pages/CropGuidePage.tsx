
import React, { useState, useEffect, useMemo } from 'react';
import CropGuideItemCard from '../components/CropGuideItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { CropGuideItem, CropSeason } from '../types';
import { getMockCropGuideItems } from '../services/mockData';
import { useLanguage } from '../hooks/useLanguage';
import { CROP_SEASONS_TABS } from '../constants';

type SeasonKey = keyof typeof CROP_SEASONS_TABS;

const CropGuidePage: React.FC = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState<CropGuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>(CROP_SEASONS_TABS.kharif as SeasonKey);

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      setCrops(getMockCropGuideItems(t));
      setLoading(false);
    };
    fetchCrops();
  }, [t]);

  const seasonTabs: { key: SeasonKey; labelKey: string; seasonEnum: CropSeason }[] = [
    { key: CROP_SEASONS_TABS.kharif as SeasonKey, labelKey: 'kharifSeason', seasonEnum: CropSeason.Kharif },
    { key: CROP_SEASONS_TABS.rabi as SeasonKey, labelKey: 'rabiSeason', seasonEnum: CropSeason.Rabi },
  ];
  
  const filteredCrops = useMemo(() => {
    const currentSeasonEnum = seasonTabs.find(tab => tab.key === selectedSeason)?.seasonEnum;
    return crops.filter(crop => crop.season === currentSeasonEnum);
  }, [crops, selectedSeason, seasonTabs]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('cropGuideTitle')}</h2>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-4 bg-gray-200 p-1 rounded-lg sticky top-[60px] z-30 -mx-4 px-4 shadow-sm mb-6"> {/* Header compensation */}
        {seasonTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedSeason(tab.key)}
            className={`px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150 w-1/2
              ${selectedSeason === tab.key ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'}`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner text={t('loading')} />
        </div>
      ) : filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map(crop => (
            <CropGuideItemCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10 text-lg">{t('noCropsFound')}</p>
      )}
    </div>
  );
};

export default CropGuidePage;
