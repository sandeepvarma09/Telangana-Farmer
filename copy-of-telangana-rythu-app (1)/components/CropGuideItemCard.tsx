import React from 'react';
import { CropGuideItem, Language } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { StarIcon } from './icons/CoreIcons'; // For AI Rating

interface CropGuideItemCardProps {
  crop: CropGuideItem;
}

const CropGuideItemCard: React.FC<CropGuideItemCardProps> = ({ crop }) => {
  const { t, currentLanguage } = useLanguage();

  const displayName =
    currentLanguage === Language.Telugu ? crop.teluguName :
    currentLanguage === Language.Hindi && crop.hindiName ? crop.hindiName :
    crop.name;

  const displaySowingPeriod =
    currentLanguage === Language.Telugu ? crop.teluguSowingPeriod :
    currentLanguage === Language.Hindi && crop.hindiSowingPeriod ? crop.hindiSowingPeriod :
    crop.sowingPeriod;

  const displayDuration =
    currentLanguage === Language.Telugu ? crop.teluguDuration :
    currentLanguage === Language.Hindi && crop.hindiDuration ? crop.hindiDuration :
    crop.duration;

  const displayAiRating =
    currentLanguage === Language.Telugu ? crop.teluguAiRating :
    currentLanguage === Language.Hindi && crop.hindiAiRating ? crop.hindiAiRating :
    crop.aiRating;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <img src={crop.image} alt={displayName} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{displayName}</h4>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>{t('sowingPeriod')}:</strong> {displaySowingPeriod}</p>
          <p><strong>{t('duration')}:</strong> {displayDuration}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-1">{t('aiSuitability')}:</p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              // Simplified star rating based on keywords in aiRating
              <StarIcon key={i} className={`w-5 h-5 ${displayAiRating.toLowerCase().includes('highly') || displayAiRating.includes('చాలా') || displayAiRating.includes('अत्यधिक') && i < 4 ? 'text-yellow-400' : (displayAiRating.toLowerCase().includes('suitable') || displayAiRating.includes('అనుకూలం') || displayAiRating.includes('उपयुक्त') && i < 3 ? 'text-yellow-400' : 'text-gray-300')}`} />
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-1">{displayAiRating}</p>
        </div>
      </div>
    </div>
  );
};

export default CropGuideItemCard;