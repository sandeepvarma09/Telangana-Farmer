
import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night';
export type WeatherCondition = 'clear' | 'partlyCloudy' | 'overcast' | 'rain' | 'warning' | 'unknown';

interface BackgroundContextType {
  timeOfDay: TimeOfDay;
  weatherCondition: WeatherCondition;
  isHighContrastMode: boolean;
  setTimeOfDay: (time: TimeOfDay) => void;
  setWeatherCondition: (condition: WeatherCondition) => void;
  toggleHighContrastMode: () => void;
  setHighContrastMode: (isOn: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning'); // Default
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('unknown'); // Default
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);

  const determineTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'dusk';
    return 'night';
  };

  useEffect(() => {
    setTimeOfDay(determineTimeOfDay());
    const interval = setInterval(() => {
      setTimeOfDay(determineTimeOfDay());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (isHighContrastMode) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [isHighContrastMode]);


  const toggleHighContrastMode = useCallback(() => {
    setIsHighContrastMode(prev => !prev);
  }, []);
  
  const setHighContrastModeCallback = useCallback((isOn: boolean) => {
    setIsHighContrastMode(isOn);
  }, []);

  return (
    <BackgroundContext.Provider value={{ 
      timeOfDay, 
      weatherCondition, 
      isHighContrastMode, 
      setTimeOfDay, 
      setWeatherCondition, 
      toggleHighContrastMode,
      setHighContrastMode: setHighContrastModeCallback
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};