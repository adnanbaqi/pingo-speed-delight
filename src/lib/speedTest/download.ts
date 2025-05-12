
import { SpeedCallback, ProgressCallback, DataPointCallback, CompleteCallback, TestController } from './types';

/**
 * Measures download speed using real file downloads
 */
export const simulateDownloadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onDataPoint: DataPointCallback,
  onComplete: CompleteCallback
): TestController => {
  let isCancelled = false;
  let testStartTime = performance.now();
  const testDuration = 10000; // 10 seconds
  const dataPoints: number[] = [];
  
  // Array of test file URLs with different sizes
  const testFiles = [
    // Cloudflare speed test files - these generate files of specific sizes
    'https://speed.cloudflare.com/__down?bytes=1000000', // 1MB
    'https://speed.cloudflare.com/__down?bytes=5000000', // 5MB
    'https://speed.cloudflare.com/__down?bytes=10000000', // 10MB
    // Fallback URLs in case Cloudflare is blocked
    'https://cdn.jsdelivr.net/gh/librespeed/speedtest@master/garbage.php?ckSize=10',
    'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js' // ~90KB
  ];
  
  // Create an abort controller to cancel fetches if needed
  const controller = new AbortController();
  const { signal } = controller;
  
  // Track download progress
  let progress = 0;
  
  // Function to run the download test
  const runTest = () => {
    if (isCancelled) return;
    
    // Update progress
    const now = performance.now();
    progress = Math.min(100, ((now - testStartTime) / testDuration) * 100);
    onProgress(progress);
    
    // Complete test if duration is reached
    if (progress >= 100) {
      // Calculate average speed from collected data points
      const avgSpeed = dataPoints.length > 0 
        ? dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length
        : 0;
      
      onComplete(avgSpeed);
      return;
    }
    
    // Select a random test file
    const fileUrl = testFiles[Math.floor(Math.random() * testFiles.length)];
    
    // Add cache buster
    const url = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}cachebust=${Date.now()}`;
    
    // Track timing for this download
    const downloadStartTime = performance.now();
    let bytesReceived = 0;
    let lastUpdateTime = downloadStartTime;
    let lastBytes = 0;
    
    // Set up timeout to abort download after 5 seconds
    const timeoutId = setTimeout(() => {
      console.log('Download test timeout');
      // Continue testing with next file
      setTimeout(runTest, 200);
    }, 5000);
    
    // Use fetch with streams for accurate measurement
    fetch(url, { 
      signal,
      cache: 'no-store',
      mode: 'cors' 
    })
    .then(response => {
      clearTimeout(timeoutId);
      
      if (!response.ok && response.status !== 0) {
        throw new Error('Network response was not ok');
      }
      
      // Get total file size if available
      const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
      
      // Set up stream reader
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Reader not available');
      }
      
      // Process downloaded chunks
      const processStream = async ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
        if (done || isCancelled) {
          // Continue with next file when done
          setTimeout(runTest, 200);
          return;
        }
        
        // Track received bytes
        bytesReceived += value.length;
        
        // Calculate speed every 200ms
        const now = performance.now();
        if (now - lastUpdateTime > 200) {
          const duration = (now - lastUpdateTime) / 1000; // seconds
          const chunkSize = bytesReceived - lastBytes;
          
          // Speed in Mbps: bytes * 8 (bits) / 1000000 (to Mb) / duration (seconds)
          if (duration > 0) {
            const currentSpeed = (chunkSize * 8) / 1000000 / duration;
            
            // Record data point
            const timePoint = (now - testStartTime) / 1000;
            onDataPoint(timePoint, currentSpeed);
            onSpeed(currentSpeed);
            dataPoints.push(currentSpeed);
            
            // Reset for next chunk
            lastUpdateTime = now;
            lastBytes = bytesReceived;
          }
        }
        
        return reader.read().then(processStream);
      };
      
      // Start reading the stream
      return reader.read().then(processStream);
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.log('Download test error:', error.message);
      
      // Try next file
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
