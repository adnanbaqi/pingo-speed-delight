
import { useState, useEffect } from 'react';

interface SpeedometerProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color?: string;
}

const Speedometer = ({ 
  value, 
  maxValue, 
  label, 
  unit, 
  color = "bg-gradient-to-r from-pingo-400 to-purple-500" 
}: SpeedometerProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate the value change
  useEffect(() => {
    if (value === displayValue) return;
    
    const step = value > displayValue ? 
      Math.max(1, Math.floor((value - displayValue) / 10)) : 
      Math.min(-1, Math.floor((value - displayValue) / 10));
    
    const timer = setTimeout(() => {
      setDisplayValue(current => {
        const next = current + step;
        if ((step > 0 && next >= value) || (step < 0 && next <= value)) {
          return value;
        }
        return next;
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [value, displayValue]);
  
  // Calculate the percentage and angle for the gauge
  const percentage = Math.min(100, Math.max(0, (displayValue / maxValue) * 100));
  const angle = (percentage * 180) / 100;
  
  return (
    <div className="relative flex flex-col items-center justify-center p-4 w-full">
      <div className="text-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      
      {/* Gauge Background */}
      <div className="relative w-48 h-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-muted rounded-t-full"></div>
        
        {/* Gauge Fill */}
        <div 
          className={`absolute top-0 left-0 w-full h-full ${color} rounded-t-full origin-bottom`}
          style={{ transform: `rotate(${angle - 180}deg)` }}
        ></div>
        
        {/* Inner circle for 3D effect */}
        <div className="absolute top-2 left-2 right-2 bottom-0 bg-background rounded-t-full"></div>
        
        {/* Gauge center line */}
        <div className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-primary transform -translate-x-1/2 origin-bottom"
             style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-primary"></div>
        </div>
        
        {/* Tick marks */}
        {[0, 45, 90, 135, 180].map((tick) => (
          <div 
            key={tick}
            className="absolute bottom-0 left-1/2 h-3 w-0.5 origin-bottom bg-muted-foreground/30"
            style={{ transform: `translateX(-50%) rotate(${tick - 90}deg)` }}
          ></div>
        ))}
      </div>
      
      {/* Value display */}
      <div className="mt-2 text-center">
        <span className="text-3xl font-bold">{displayValue.toFixed(1)}</span>
        <span className="text-xl ml-1 text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};

export default Speedometer;
