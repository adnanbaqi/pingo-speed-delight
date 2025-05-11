
// Simple speed test simulator
// In a real app, this would use web sockets and actual data transfer

type SpeedCallback = (speed: number) => void;
type CompleteCallback = (finalSpeed: number) => void;
type ProgressCallback = (percent: number) => void;

const PING_MIN = 5;
const PING_MAX = 200;

const getRandomSpeed = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getRandomPing = () => {
  return Math.floor(Math.random() * (PING_MAX - PING_MIN)) + PING_MIN;
};

// Add jitter to simulate real network conditions
const addJitter = (baseSpeed: number, jitterPercent: number = 10) => {
  const jitterAmount = baseSpeed * (jitterPercent / 100);
  return baseSpeed + ((Math.random() * jitterAmount * 2) - jitterAmount);
};

export const simulatePing = (): Promise<number> => {
  return new Promise((resolve) => {
    const delay = getRandomPing();
    setTimeout(() => {
      resolve(delay);
    }, 1500);
  });
};

export const simulateDownloadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onComplete: CompleteCallback
): { cancel: () => void } => {
  let isCancelled = false;
  
  // Base speed in Mbps
  const baseSpeed = getRandomSpeed(20, 150);
  
  // Test duration in milliseconds
  const testDuration = 8000;
  const updateInterval = 200;
  const steps = testDuration / updateInterval;
  let currentStep = 0;

  const interval = setInterval(() => {
    if (isCancelled) {
      clearInterval(interval);
      return;
    }
    
    currentStep++;
    const progress = (currentStep / steps) * 100;
    onProgress(progress);
    
    // Add jitter to make it look realistic
    const currentSpeed = addJitter(baseSpeed);
    onSpeed(currentSpeed);
    
    if (currentStep >= steps) {
      clearInterval(interval);
      onComplete(baseSpeed);
    }
  }, updateInterval);
  
  return {
    cancel: () => {
      isCancelled = true;
      clearInterval(interval);
    }
  };
};

export const simulateUploadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onComplete: CompleteCallback
): { cancel: () => void } => {
  let isCancelled = false;
  
  // Base speed in Mbps (upload usually slower than download)
  const baseSpeed = getRandomSpeed(5, 80);
  
  // Test duration in milliseconds
  const testDuration = 8000;
  const updateInterval = 200;
  const steps = testDuration / updateInterval;
  let currentStep = 0;

  const interval = setInterval(() => {
    if (isCancelled) {
      clearInterval(interval);
      return;
    }
    
    currentStep++;
    const progress = (currentStep / steps) * 100;
    onProgress(progress);
    
    // Add jitter to make it look realistic
    const currentSpeed = addJitter(baseSpeed);
    onSpeed(currentSpeed);
    
    if (currentStep >= steps) {
      clearInterval(interval);
      onComplete(baseSpeed);
    }
  }, updateInterval);
  
  return {
    cancel: () => {
      isCancelled = true;
      clearInterval(interval);
    }
  };
};
