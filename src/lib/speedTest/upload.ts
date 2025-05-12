
import { SpeedCallback, ProgressCallback, DataPointCallback, CompleteCallback, TestController } from './types';

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
  
  // Upload endpoints - these should accept POST requests
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
  
  // Create test data blobs of different sizes
  const testData = [
    generateData(256),   // 256KB
    generateData(512),   // 512KB
    generateData(1024),  // 1MB
    generateData(2048),  // 2MB
  ];
  
  // Run upload test
  const runTest = () => {
    if (isCancelled) return;
    
    // Update progress
    const now = performance.now();
    progress = Math.min(100, ((now - testStartTime) / testDuration) * 100);
    onProgress(progress);
    
    // Complete test if duration is reached
    if (progress >= 100) {
      // Calculate average speed
      const avgSpeed = dataPoints.length > 0 
        ? dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length
        : 0;
      
      onComplete(avgSpeed);
      return;
    }
    
    // Choose a random endpoint and data size
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const data = testData[Math.floor(Math.random() * testData.length)];
    
    // Prepare FormData for the upload
    const formData = new FormData();
    formData.append('file', data, 'speedtest.bin');
    
    // Track upload timing
    const uploadStartTime = performance.now();
    const uploadSize = data.size;
    
    // Set timeout for this upload attempt
    const timeoutId = setTimeout(() => {
      console.log('Upload test timeout');
      setTimeout(runTest, 200);
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
      
      // Calculate upload speed
      const uploadTime = performance.now() - uploadStartTime;
      const duration = uploadTime / 1000; // convert to seconds
      
      if (duration > 0) {
        // Calculate speed in Mbps: bytes * 8 (bits) / 1000000 (to Mb) / duration (seconds)
        const speed = (uploadSize * 8) / 1000000 / duration;
        
        // Record data point
        const timePoint = (performance.now() - testStartTime) / 1000;
        onDataPoint(timePoint, speed);
        onSpeed(speed);
        dataPoints.push(speed);
      }
      
      // Continue with next upload
      setTimeout(runTest, 200);
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.log('Upload test error:', error.message);
      
      // Continue testing with next attempt
      setTimeout(runTest, 200);
    });
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
