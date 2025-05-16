/**
 * Tests unloaded latency by measuring round-trip time to multiple endpoints
 * @param options Optional configuration parameters
 * @returns Promise with latency in ms, or -1 if all endpoints fail
 */
export const simulatePing = async (options?: {
  endpoints?: string[];
  timeout?: number;
  endpointTimeout?: number;
  minAcceptableLatency?: number;
  maxAcceptableLatency?: number;
  correctionFactor?: number;
}): Promise<number> => {
  // Default parameters with destructuring
  const {
    endpoints = [
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.microsoft.com',
      'https://www.amazon.com',
      'https://www.apple.com',
      'https://www.netflix.com',
      'https://cdn.jsdelivr.net',
      'https://www.wikipedia.org'
    ],
    timeout = 5000,
    endpointTimeout = 1500,
    minAcceptableLatency = 5,
    maxAcceptableLatency = 1500,
    correctionFactor = 0.85
  } = options || {};

  return new Promise((resolve) => {
    const controller = new AbortController();
    const { signal } = controller;
    
    // Master timeout – abort all after the specified timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
      resolve(-1); // Indicate failure
    }, timeout);

    // Function to create cache-busting URL
    const createCacheBustUrl = (url: string) => 
      `${url}/favicon.ico?cachebust=${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    // Function to attempt fallback image measurement
    const attemptImageFallback = (endpoint: string): Promise<number> => {
      return new Promise<number>((resolveImg) => {
        const img = new Image();
        const imgStartTime = performance.now();
        const imgTimeout = setTimeout(() => resolveImg(endpointTimeout), endpointTimeout);
        
        img.onload = img.onerror = () => {
          clearTimeout(imgTimeout);
          const imgLatency = performance.now() - imgStartTime;
          resolveImg(imgLatency);
        };
        
        img.src = createCacheBustUrl(endpoint);
      });
    };

    // Map over endpoints to create array of ping promises
    const pingPromises = endpoints.map(endpoint => {
      return new Promise<number>((resolveEndpoint) => {
        const startTime = performance.now();
        const endpointTimeoutId = setTimeout(() => {
          resolveEndpoint(endpointTimeout); // Treat as timeout
        }, endpointTimeout);

        fetch(createCacheBustUrl(endpoint), {
          mode: 'no-cors',
          cache: 'no-store',
          credentials: 'omit',
          priority: 'high',
          signal
        })
        .then(() => {
          clearTimeout(endpointTimeoutId);
          const latency = performance.now() - startTime;
          resolveEndpoint(latency);
        })
        .catch(() => {
          clearTimeout(endpointTimeoutId);
          // Fallback to image-based measurement
          attemptImageFallback(endpoint).then(resolveEndpoint);
        });
      });
    });

    // Process results
    Promise.all(pingPromises).then(results => {
      clearTimeout(timeoutId);
      
      // Filter valid results
      const validResults = results.filter(
        time => time < maxAcceptableLatency && time > minAcceptableLatency
      );
      
      if (validResults.length === 0) {
        resolve(-1); // All failed
        return;
      }
      
      // Sort results for median calculation
      validResults.sort((a, b) => a - b);
      
      // Calculate median latency
      const medianLatency = validResults.length % 2 === 0
        ? (validResults[validResults.length / 2 - 1] + validResults[validResults.length / 2]) / 2
        : validResults[Math.floor(validResults.length / 2)];
      
      // Apply correction factor
      const correctedLatency = Math.max(minAcceptableLatency, medianLatency * correctionFactor);
      
      // Return rounded result
      resolve(Math.round(correctedLatency));
    }).catch(() => {
      // Handle any unexpected errors in Promise.all
      clearTimeout(timeoutId);
      resolve(-1);
    });
  });
};