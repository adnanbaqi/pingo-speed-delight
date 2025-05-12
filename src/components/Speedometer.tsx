
import { useState, useEffect, memo } from 'react';

interface SpeedometerProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color?: string;
}

// Memoized component for better performance
const Speedometer = memo(({ 
  value, 
  maxValue, 
  label, 
  unit, 
  color = "bg-gradient-to-r from-pingo-400 to-purple-500" 
}: SpeedometerProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Optimize animation with requestAnimationFrame
  useEffect(() => {
    if (value === displayValue) return;
    
    let animationFrameId: number;
    const start = displayValue;
    const end = value;
    const duration = 500; // ms
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const nextValue = start + (end - start) * progress;
      
      setDisplayValue(nextValue);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      // Clean up pending animations if component unmounts
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, displayValue]);
  
  // Calculate the percentage and angle for the gauge
  const percentage = Math.min(100, Math.max(0, (displayValue / maxValue) * 100));
  const angle = (percentage * 180) / 100;
  
  return (
    <div className="relative flex flex-col items-center justify-center p-4 w-full">
      <div className="text-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      
      {/* Gauge Background with improved visual effect */}
      <div className="relative w-48 h-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-muted/30 rounded-t-full"></div>
        
        {/* Gauge Fill with glow effect */}
        <div 
          className={`absolute top-0 left-0 w-full h-full ${color} rounded-t-full origin-bottom shadow-[0_0_15px_rgba(99,102,241,0.4)]`}
          style={{ transform: `rotate(${angle - 180}deg)` }}
        ></div>
        
        {/* Inner circle for 3D effect */}
        <div className="absolute top-2 left-2 right-2 bottom-0 bg-background/95 rounded-t-full backdrop-blur-sm"></div>
        
        {/* Gauge center line */}
        <div className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-primary transform -translate-x-1/2 origin-bottom"
             style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}>
          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
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
});

Speedometer.displayName = 'Speedometer';

export default Speedometer;
