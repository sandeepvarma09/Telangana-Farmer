
import React from 'react';
import { TimeOfDay, WeatherCondition, useBackground } from '../contexts/BackgroundContext';

interface DynamicBackgroundProps {
  // Props are now primarily derived from context
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = () => {
  const { timeOfDay, weatherCondition, isHighContrastMode } = useBackground();

  if (isHighContrastMode) {
    // In high contrast mode, a global class on body handles the solid background.
    // This component can return null or a minimal structure if needed.
    return <div className="dynamic-background-container" />;
  }
  
  const timeOfDayClass = `bg-time-${timeOfDay}`;
  const weatherOverlayClass = `bg-overlay-${weatherCondition}`;

  return (
    <div className="dynamic-background-container">
      <div 
        className={`dynamic-background-image-layer ${timeOfDayClass}`}
        key={`bg-${timeOfDay}`} // Key change forces re-render for transition if CSS relies on it
      ></div>
      <div 
        className={`dynamic-background-overlay-layer ${weatherOverlayClass}`}
        key={`overlay-${weatherCondition}`} // Key change for transition
      ></div>
    </div>
  );
};

export default DynamicBackground;