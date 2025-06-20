
import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { MandiRate, Language } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { TrendingUpIcon, TrendingDownIcon, MinusSmallIcon } from './icons/CoreIcons'; // Added MinusSmallIcon

interface MandiRateListItemProps {
  rate: MandiRate;
}

const MandiRateListItem: React.FC<MandiRateListItemProps> = ({ rate }) => {
  const { t, currentLanguage } = useLanguage();

  const getTrendIcon = () => {
    if (rate.trendData.length < 2) return <MinusSmallIcon className="w-5 h-5 text-gray-400" />;
    // Trend based on first and last data point of the current trendData (month)
    const firstPrice = rate.trendData[0].price;
    const lastPrice = rate.trendData[rate.trendData.length - 1].price;
    if (lastPrice > firstPrice) return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
    if (lastPrice < firstPrice) return <TrendingDownIcon className="w-5 h-5 text-red-500" />;
    return <MinusSmallIcon className="w-5 h-5 text-gray-400" />; // Stable
  };

  const displayName =
    currentLanguage === Language.Telugu ? rate.teluguCropName :
    currentLanguage === Language.Hindi && rate.hindiCropName ? rate.hindiCropName :
    rate.cropName; // Fallback to English/key name

  const displayMarketName =
    currentLanguage === Language.Telugu ? rate.teluguMarketName :
    currentLanguage === Language.Hindi && rate.hindiMarketName ? rate.hindiMarketName :
    rate.marketName; // Fallback to English/key name


  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <div>
          <h4 className="text-lg font-semibold text-primary-dark">{displayName}</h4>
          <p className="text-sm text-gray-600">{displayMarketName}</p>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <p className="text-xl font-bold text-gray-800 mr-2">{rate.price}</p>
          <span className="text-xs text-gray-500">{t('price क्विंटल')}</span>
          <div className="ml-2">{getTrendIcon()}</div>
        </div>
      </div>
      {rate.trendData && rate.trendData.length > 1 && (
        <div className="h-20 sm:h-24 -ml-4 -mr-2"> {/* Negative margin to extend graph slightly */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rate.trendData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}> {/* Adjusted left/right margin */}
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                interval="preserveStartEnd" // Show first and last tick
                tickFormatter={(value, index) => { // Show tick for every 5-7 days approx
                    const totalTicks = rate.trendData.length;
                    const desiredTicks = Math.min(5, totalTicks); // Max 5 ticks
                    if (totalTicks <= desiredTicks) return value; // show all if few data points
                    if (index % Math.ceil(totalTicks / desiredTicks) === 0) return value;
                    return "";
                }}
                />
              <YAxis 
                domain={['auto', 'auto']} // Auto-scale Y axis
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                width={30}
                tickFormatter={(value) => `₹${value/1000}k`} // Format as thousands
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem', padding: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#333' }}
                labelStyle={{ fontWeight: 'bold', color: '#000', marginBottom: '4px' }}
                formatter={(value: number, name: string, props: any) => [`₹${value.toLocaleString('en-IN')}`, t('price क्विंटल').split('/')[0].trim()]}
                labelFormatter={(label) => `${t('day', 'Day')} ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#22c55e" // green-500
                strokeWidth={2} 
                dot={{ r: 2, fill: '#22c55e', strokeWidth:0 }} 
                activeDot={{ r: 4, stroke: '#166534', strokeWidth: 1, fill: '#22c55e' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MandiRateListItem;
