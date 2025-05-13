
import { SpeedCallback, ProgressCallback, DataPointCallback, CompleteCallback, TestController } from './types';
import { generateSimulatedData } from './utils';

/**
 * Measures upload speed by sending data to endpoints
 */
export const simulateUploadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onDataPoint: DataPointCallback,
  onComplete: CompleteCallback
): TestController => {
  let isCancelled = false;
  let testStartTime = performance.now();
  const testDuration = 10000; // 10 seconds
  const dataPoints: number[] = [];
  
  // Upload endpoints - using more reliable endpoints
  const endpoints = [
    'https://httpbin.org/post',
    'https://www.postman-echo.com/post',
    'https://reqres.in/api/users'
  ];
  
  const controller = new AbortController();
  const { signal } = controller;
  
  let progress = 0;
  
  // Generate binary data of specified size
  const generateData = (sizeInKB: number): Blob => {
    const array = new Uint8Array(sizeInKB * 1024);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return new Blob([array]);
  };
  
  // Create test data blobs of different sizes for better reliability
  const testData = [
    { size: 256, blob: generateData(256) },   // 256KB
    { size: 512, blob: generateData(512) },   // 512KB
    { size: 1024, blob: generateData(1024) }, // 1MB
    { size: 2048, blob: generateData(2048) }, // 2MB
  ];
  
  let lastSpeedUpdate = 0;
  let totalBytesUploaded = 0;
  let measurementStartTime = performance.now();
  const speedUpdateInterval = 300; // ms between speed updates
  
  // Track and report upload speed periodically
  const trackSpeed = () => {
    const now = performance.now();
    const elapsed = now - measurementStartTime;
    
    if (elapsed > speedUpdateInterval) {
      const seconds = elapsed / 1000;
      // Convert bytes to bits (multiply by 8)
      // Then convert to megabits (divide by 1,000,000)
      const speed = (totalBytesUploaded * 8) / 1000000 / seconds;
      
      if (!isNaN(speed) && isFinite(speed)) {
        onSpeed(speed);
        const timePoint = (now - testStartTime) / 1000;
        onDataPoint(timePoint, speed);
        dataPoints.push(speed);
      }
      
      // Reset counters for next measurement window
      measurementStartTime = now;
      totalBytesUploaded = 0;
    }
  };
  
  // Run upload test with parallel uploads for more accurate measurement
  const runTest = () => {
    if (isCancelled) return;
    
    // Update progress
    const now = performance.now();
    progress = Math.min(100, ((now - testStartTime) / testDuration) * 100);
    onProgress(progress);
    
    // Complete test if duration is reached
    if (progress >= 100) {
      // Calculate median speed, more reliable than mean
      const sortedSpeeds = [...dataPoints].sort((a, b) => a - b);
      const medianSpeed = sortedSpeeds.length > 0 
        ? sortedSpeeds[Math.floor(sortedSpeeds.length / 2)]
        : 0;
      
      onComplete(medianSpeed);
      return;
    }
    
    // Run multiple uploads in parallel for better bandwidth utilization
    const parallelUploads = 3;
    for (let i = 0; i < parallelUploads; i++) {
      // Choose a random endpoint and data size
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const testItem = testData[Math.floor(Math.random() * testData.length)];
      
      // Prepare FormData for the upload
      const formData = new FormData();
      formData.append('file', testItem.blob, 'speedtest.bin');
      
      // Set timeout for this upload attempt
      const timeoutId = setTimeout(() => {
        console.log('Upload test timeout');
        uploadNextChunk();
      }, 5000);
      
      // Perform the upload
      fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Add the uploaded bytes to our counter
        totalBytesUploaded += testItem.size * 1024;
        trackSpeed();
        uploadNextChunk();
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.log('Upload test error:', error.message);
        uploadNextChunk();
      });
    }
  };
  
  // Schedule next chunk upload
  const uploadNextChunk = () => {
    if (!isCancelled && progress < 100) {
      setTimeout(runTest, 100);
    }
  };
  
  // Start the test
  runTest();
  
  return {
    cancel: () => {
      isCancelled = true;
      controller.abort();
    }
  };
};
