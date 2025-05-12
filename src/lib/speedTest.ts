
// Real network speed testing implementation
// Uses multiple methods to get accurate results

type SpeedCallback = (speed: number) => void;
type CompleteCallback = (finalSpeed: number) => void;
type ProgressCallback = (percent: number) => void;
type DataPointCallback = (time: number, value: number) => void;

/**
 * Tests ping by measuring round-trip time to multiple endpoints
 * @returns Promise with ping in ms
 */
export const simulatePing = async (): Promise<number> => {
  return new Promise((resolve) => {
    // Start time measurement
    const startTime = performance.now();
    
    // Use fetch to multiple endpoints to get more accurate ping
    const endpoints = [
      'https://www.cloudflare.com/cdn-cgi/trace',
      'https://www.google.com',
      'https://www.microsoft.com'
    ];
    
    const pingPromises = endpoints.map(endpoint => 
      fetch(endpoint, { 
        method: 'HEAD',
        mode: 'no-cors', // This allows checking sites without CORS headers
        cache: 'no-cache'
      })
      .then(() => performance.now() - startTime)
      .catch(() => null) // Ignore errors
    );
    
    // Collect all successful pings and calculate average
    Promise.all(pingPromises).then(results => {
      const validPings = results.filter(result => result !== null) as number[];
      
      if (validPings.length === 0) {
        // Fallback if all pings failed
        resolve(100); // Default reasonable value
        return;
      }
      
      // Calculate average ping after removing outliers
      validPings.sort((a, b) => a - b);
      // Remove top and bottom if we have enough samples
      const trimmedPings = validPings.length > 3 
        ? validPings.slice(1, -1) 
        : validPings;
      
      const avgPing = Math.round(
        trimmedPings.reduce((sum, val) => sum + val, 0) / trimmedPings.length
      );
      
      resolve(avgPing);
    });
  });
};

/**
 * Measures download speed using fetch and Blob measurements
 */
export const simulateDownloadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onDataPoint: DataPointCallback,
  onComplete: CompleteCallback
): { cancel: () => void } => {
  let isCancelled = false;
  let totalBytesLoaded = 0;
  let startTime = performance.now();
  const testDuration = 10000; // 10 seconds
  const updateInterval = 200; // 200ms updates
  const dataPoints: number[] = [];
  
  // File sizes to test with (increasing sizes)
  const testFiles = [
    // Use files of different sizes for more accurate measurements
    "https://cdn.jsdelivr.net/gh/mathiasbynens/small/empty.js", // Tiny
    "https://cdn.jsdelivr.net/gh/mozilla/pdf.js@gh-pages/web/compressed.tracemonkey-pldi-09.pdf", // ~400KB
    "https://cdn.jsdelivr.net/gh/videojs/http-streaming@master/docs/contribs/test-streams/bipbop/bipbop_16x9_variant.m3u8", // Stream manifest
  ];
  
  const controller = new AbortController();
  const { signal } = controller;
  
  let progress = 0;
  let lastSpeedUpdate = 0;
  let testStartTime = performance.now();
  
  // Start the test
  const runTest = () => {
    if (isCancelled) return;
    
    // Progress update
    progress = Math.min(100, ((performance.now() - testStartTime) / testDuration) * 100);
    onProgress(progress);
    
    // If test duration exceeded, complete the test
    if (progress >= 100) {
      const avgSpeed = dataPoints.length > 0 
        ? dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length
        : 0;
      onComplete(avgSpeed);
      return;
    }
    
    // Choose a file to test with
    const fileIndex = Math.floor(Math.random() * testFiles.length);
    const fileUrl = testFiles[fileIndex];
    
    // Add cache buster to prevent cached responses
    const url = `${fileUrl}?cachebust=${Date.now()}`;
    
    // Fetch with progress tracking
    fetch(url, { signal, cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        
        const reader = response.body?.getReader();
        if (!reader) throw new Error('ReadableStream not supported');
        
        const contentLength = Number(response.headers.get('Content-Length')) || 0;
        let receivedLength = 0;
        let lastProgressTimestamp = performance.now();
        let chunks: Uint8Array[] = [];

        // Read the stream
        const processStream = ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
          if (done || isCancelled) {
            return Promise.resolve();
          }
          
          // Track progress
          chunks.push(value);
          receivedLength += value.length;
          totalBytesLoaded += value.length;
          
          const now = performance.now();
          const elapsed = now - lastProgressTimestamp;
          
          // Update speed every updateInterval ms
          if (elapsed > updateInterval) {
            const durationSec = (now - startTime) / 1000;
            if (durationSec > 0) {
              // Convert to Mbps: bytes * 8 (bits) / 1000000 (to Mb) / time (seconds)
              const currentSpeed = (totalBytesLoaded * 8) / 1000000 / durationSec;
              
              // Record data point
              const timePoint = (now - testStartTime) / 1000; // time in seconds
              onDataPoint(timePoint, currentSpeed);
              onSpeed(currentSpeed);
              
              // Store for average calculation
              dataPoints.push(currentSpeed);
              
              // Reset for next interval
              totalBytesLoaded = 0;
              startTime = now;
            }
            
            lastProgressTimestamp = now;
          }
          
          // Continue reading
          return reader.read().then(processStream);
        };
        
        return reader.read().then(processStream);
      })
      .catch(error => {
        if (error.name === 'AbortError') return;
        console.error('Download test error:', error);
      })
      .finally(() => {
        // Schedule next test iteration
        setTimeout(runTest, 100);
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

/**
 * Measures upload speed by sending data to a server
 */
export const simulateUploadTest = (
  onSpeed: SpeedCallback,
  onProgress: ProgressCallback,
  onDataPoint: DataPointCallback,
  onComplete: CompleteCallback
): { cancel: () => void } => {
  let isCancelled = false;
  let testStartTime = performance.now();
  const testDuration = 10000; // 10 seconds
  const updateInterval = 200; // 200ms updates
  const dataPoints: number[] = [];
  
  // Create test endpoints (public echo servers)
  const endpoints = [
    'https://httpbin.org/post',
    'https://postman-echo.com/post'
  ];
  
  let progress = 0;
  let totalBytesSent = 0;
  let startTime = performance.now();
  
  // Generate payloads of various sizes
  const generatePayload = (sizeInKB: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const iterations = sizeInKB * 1024 / chars.length;
    
    for (let i = 0; i < iterations; i++) {
      result += chars;
    }
    
    return result;
  };
  
  // Create payloads of different sizes
  const payloads = [
    generatePayload(10),   // 10KB
    generatePayload(100),  // 100KB
    generatePayload(500),  // 500KB
  ];
  
  const controller = new AbortController();
  const { signal } = controller;
  
  // Run upload test
  const runTest = () => {
    if (isCancelled) return;
    
    // Update progress
    const now = performance.now();
    progress = Math.min(100, ((now - testStartTime) / testDuration) * 100);
    onProgress(progress);
    
    // If test duration exceeded, complete the test
    if (progress >= 100) {
      const avgSpeed = dataPoints.length > 0 
        ? dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length
        : 0;
      onComplete(avgSpeed);
      return;
    }
    
    // Choose a payload and endpoint
    const payloadIndex = Math.floor(Math.random() * payloads.length);
    const endpointIndex = Math.floor(Math.random() * endpoints.length);
    const payload = payloads[payloadIndex];
    const endpoint = endpoints[endpointIndex];
    
    // Track timing for this chunk
    const chunkStartTime = performance.now();
    
    // Perform the upload
    fetch(endpoint, {
      method: 'POST',
      body: payload,
      signal,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(() => {
      if (isCancelled) return;
      
      const uploadTime = performance.now() - chunkStartTime;
      const bytesSent = payload.length;
      totalBytesSent += bytesSent;
      
      // Calculate speed in Mbps
      if (uploadTime > 0) {
        // Convert bytes to megabits: bytes * 8 (bits) / 1000000 (to Mb)
        const speed = (bytesSent * 8) / 1000000 / (uploadTime / 1000);
        
        const timePoint = (performance.now() - testStartTime) / 1000;
        onDataPoint(timePoint, speed);
        onSpeed(speed);
        
        // Store for average calculation
        dataPoints.push(speed);
      }
    })
    .catch(error => {
      if (error.name === 'AbortError') return;
      console.error('Upload test error:', error);
    })
    .finally(() => {
      // Schedule next test iteration
      setTimeout(runTest, 100);
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
