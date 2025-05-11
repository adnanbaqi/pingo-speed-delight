// Improved speed test simulator
// In a real app, this would use web sockets and actual data transfer

type SpeedCallback = (speed: number) => void;
type CompleteCallback = (finalSpeed: number) => void;
type ProgressCallback = (percent: number) => void;
type DataPointCallback = (time: number, value: number) => void;

const PING_MIN = 5;
const PING_MAX = 200;

// More realistic random speed generation
const getRandomSpeed = (min: number, max: number, bias: number = 0.5) => {
  // Use a more sophisticated algorithm for realistic speed distribution
  // The bias parameter (0-1) determines whether speeds are more likely to be in the higher or lower range
  const randomFactor = Math.pow(Math.random(), 1 - bias);
  return min + randomFactor * (max - min);
};

// More accurate ping simulation
const getRandomPing = (quality: number = 0.5): number => {
  // Quality parameter (0-1) determines likelihood of lower ping values
  // Higher quality = lower ping more likely
  const distribution = Math.pow(Math.random(), quality);
  return Math.floor(distribution * (PING_MAX - PING_MIN)) + PING_MIN;
};

// Enhanced jitter simulation that models real world conditions
const addJitter = (
  baseSpeed: number, 
  time: number,
  jitterPercent: number = 10, 
  patternIntensity: number = 0.3
) => {
  // Add time-based pattern to simulate network congestion patterns
  const jitterAmount = baseSpeed * (jitterPercent / 100);
  const patternFactor = Math.sin(time * 3) * patternIntensity * jitterAmount;
  const randomJitter = ((Math.random() * jitterAmount * 2) - jitterAmount);
  
  return baseSpeed + patternFactor + randomJitter;
};

// Improved ping test with variance
export const simulatePing = (): Promise<number> => {
  return new Promise((resolve) => {
    const pingBase = getRandomPing(0.7);
    const variance = pingBase * 0.1;
    
    // Run multiple ping measurements for more realistic results
    const pings: number[] = [];
    const pingCount = 5;
    
    for (let i = 0; i < pingCount; i++) {
      pings.push(pingBase + ((Math.random() * variance * 2) - variance));
    }
    
    // Sort and remove highest and lowest (outliers)
    pings.sort((a, b) => a - b);
    const filteredPings = pings.slice(1, -1);
    
    // Calculate average from remaining values
    const pingAverage = filteredPings.reduce((sum, val) => sum + val, 0) / filteredPings.length;
    
    setTimeout(() => {
      resolve(Math.round(pingAverage));
    }, 1500);
  });
};

// Enhanced download test with more realistic speed fluctuations
export const simulateDownloadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onDataPoint: DataPointCallback,
  onComplete: CompleteCallback
): { cancel: () => void } => {
  let isCancelled = false;
  
  // More realistic speed simulation
  const connectionQuality = Math.random() * 0.6 + 0.4; // Between 0.4 and 1.0
  const baseSpeed = getRandomSpeed(20, 180, connectionQuality);
  
  // Congestion modeling - speeds typically start higher then stabilize
  const congestionFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
  
  // Test duration in milliseconds - longer for more accuracy
  const testDuration = 10000;
  const updateInterval = 200;
  const steps = testDuration / updateInterval;
  let currentStep = 0;
  let totalSpeed = 0;
  let dataPoints = 0;

  // Map to store consistent jitter pattern
  const jitterMap = new Map();
  for (let i = 0; i <= Math.ceil(testDuration / 1000) + 1; i++) {
    jitterMap.set(i, (Math.random() - 0.5) * 2);
  }

  const interval = setInterval(() => {
    if (isCancelled) {
      clearInterval(interval);
      return;
    }
    
    currentStep++;
    const progress = (currentStep / steps) * 100;
    onProgress(progress);
    
    const timeInSeconds = (currentStep * updateInterval) / 1000;
    const progressRatio = currentStep / steps;
    
    // Calculate dynamic speed based on time progression
    // Early phases often show higher speeds that then stabilize
    const dynamicBaseFactor = 
      progressRatio < 0.1 ? 1.1 : // Initial burst
      progressRatio < 0.3 ? 0.9 + Math.random() * 0.2 : // Slight drop
      progressRatio < 0.7 ? 0.8 + Math.random() * 0.4 : // Stabilization with variation
      0.75 + Math.random() * 0.5; // Final stabilization
      
    // Get jitter patterns from our pre-calculated map
    const timeKey = Math.floor(timeInSeconds);
    const jitterPattern = 
      (jitterMap.get(timeKey) || 0) * 0.7 + 
      (jitterMap.get(timeKey + 1) || 0) * 0.3;
    
    // Calculate current speed with enhanced jitter and patterns
    const currentSpeed = baseSpeed * 
      dynamicBaseFactor * 
      congestionFactor * 
      (1 + jitterPattern * 0.15);
      
    const finalCurrentSpeed = Math.max(5, currentSpeed); // Ensure speed never drops below 5Mbps
    
    onSpeed(finalCurrentSpeed);
    onDataPoint(timeInSeconds, finalCurrentSpeed);
    
    // Keep running average for final result
    totalSpeed += finalCurrentSpeed;
    dataPoints++;
    
    if (currentStep >= steps) {
      clearInterval(interval);
      const avgSpeed = totalSpeed / dataPoints;
      // Apply a slight correction factor to account for TCP slowstart and other real-world factors
      const finalAvgSpeed = avgSpeed * 0.95;
      onComplete(finalAvgSpeed);
    }
  }, updateInterval);
  
  return {
    cancel: () => {
      isCancelled = true;
      clearInterval(interval);
    }
  };
};

// Enhanced upload test
export const simulateUploadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onDataPoint: DataPointCallback,
  onComplete: CompleteCallback
): { cancel: () => void } => {
  let isCancelled = false;
  
  // Upload is typically more consistent but slower than download
  const connectionQuality = Math.random() * 0.5 + 0.4; // Between 0.4 and 0.9
  const baseSpeed = getRandomSpeed(5, 90, connectionQuality) * 0.7; // 70% of potential speed
  
  // Test duration in milliseconds
  const testDuration = 10000;
  const updateInterval = 200;
  const steps = testDuration / updateInterval;
  let currentStep = 0;
  let totalSpeed = 0;
  let dataPoints = 0;

  // Create consistent pattern map
  const patternMap = new Map();
  for (let i = 0; i <= Math.ceil(testDuration / 1000) + 1; i++) {
    patternMap.set(i, (Math.random() - 0.5) * 2);
  }

  const interval = setInterval(() => {
    if (isCancelled) {
      clearInterval(interval);
      return;
    }
    
    currentStep++;
    const progress = (currentStep / steps) * 100;
    onProgress(progress);
    
    const timeInSeconds = (currentStep * updateInterval) / 1000;
    
    // Get pattern from map
    const timeKey = Math.floor(timeInSeconds);
    const patternFactor = 
      (patternMap.get(timeKey) || 0) * 0.8 + 
      (patternMap.get(timeKey + 1) || 0) * 0.2;
    
    // Upload speeds are more consistent but still have some jitter
    const currentSpeed = baseSpeed * (1 + patternFactor * 0.1);
    const finalCurrentSpeed = Math.max(1, currentSpeed);
    
    onSpeed(finalCurrentSpeed);
    onDataPoint(timeInSeconds, finalCurrentSpeed);
    
    // Keep running average
    totalSpeed += finalCurrentSpeed;
    dataPoints++;
    
    if (currentStep >= steps) {
      clearInterval(interval);
      const avgSpeed = totalSpeed / dataPoints;
      // Apply slight correction factor
      const finalAvgSpeed = avgSpeed * 0.95;
      onComplete(finalAvgSpeed);
    }
  }, updateInterval);
  
  return {
    cancel: () => {
      isCancelled = true;
      clearInterval(interval);
    }
  };
};

// Advanced function to estimate user's actual internet quality
export const estimateConnectionQuality = (
  ping: number, 
  downloadSpeed: number, 
  uploadSpeed: number
): { 
  score: number; // 0-100
  quality: 'Poor' | 'Average' | 'Good' | 'Excellent';
} => {
  // Normalize values to 0-1 range
  const normalizedPing = Math.max(0, Math.min(1, (200 - ping) / 200));
  const normalizedDownload = Math.max(0, Math.min(1, downloadSpeed / 200));
  const normalizedUpload = Math.max(0, Math.min(1, uploadSpeed / 100));
  
  // Weighted score calculation (ping is very important for real-time applications)
  const weightedScore = 
    normalizedPing * 0.4 + 
    normalizedDownload * 0.4 + 
    normalizedUpload * 0.2;
  
  // Convert to 0-100 scale
  const score = Math.round(weightedScore * 100);
  
  // Determine quality category
  let quality: 'Poor' | 'Average' | 'Good' | 'Excellent';
  if (score < 30) quality = 'Poor';
  else if (score < 60) quality = 'Average';
  else if (score < 85) quality = 'Good';
  else quality = 'Excellent';
  
  return { score, quality };
};
