
/**
 * Tests unloaded latency by measuring round-trip time to multiple endpoints
 * @returns Promise with latency in ms
 */
export const simulatePing = async (): Promise<number> => {
  return new Promise((resolve) => {
    // Use a variety of reliable endpoints
    const endpoints = [
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.microsoft.com',
      'https://www.amazon.com',
      'https://www.apple.com',
      'https://www.netflix.com'
    ];
    
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const { signal } = controller;
    
    // Set a timeout for the entire ping test
    const timeout = setTimeout(() => {
      controller.abort();
      resolve(500); // Return a high latency value if all pings timeout
    }, 5000);
    
    const pingPromises = endpoints.map(endpoint => {
      return new Promise<number>((resolveEndpoint) => {
        const startTime = performance.now();
        
        // Set timeout for individual endpoint
        const endpointTimeout = setTimeout(() => {
          resolveEndpoint(1500);
        }, 1500);
        
        fetch(`${endpoint}/favicon.ico?cachebust=${Date.now()}`, { 
          mode: 'no-cors',
          cache: 'no-store',
          credentials: 'omit',
          priority: 'high',
          signal
        })
        .then(() => {
          clearTimeout(endpointTimeout);
          const latency = performance.now() - startTime;
          resolveEndpoint(latency);
        })
        .catch(() => {
          clearTimeout(endpointTimeout);
          // Try with image as fallback (works better in some browsers)
          const img = new Image();
          const imgStartTime = performance.now();
          
          img.onload = img.onerror = function() {
            const imgLatency = performance.now() - imgStartTime;
            resolveEndpoint(imgLatency);
          };
          
          img.src = `${endpoint}/favicon.ico?cachebust=${Date.now()}`;
        });
      });
    });
    
    // Calculate median latency from all endpoints
    Promise.all(pingPromises).then(results => {
      clearTimeout(timeout);
      
      // Filter out timeouts and failures
      const validResults = results.filter(time => time < 1500);
      
      if (validResults.length === 0) {
        // All requests failed, return a high latency value
        resolve(500);
        return;
      }
      
      // Use median value (more accurate than mean for latency)
      validResults.sort((a, b) => a - b);
      
      const medianLatency = validResults.length % 2 === 0
        ? Math.round((validResults[validResults.length / 2 - 1] + validResults[validResults.length / 2]) / 2)
        : Math.round(validResults[Math.floor(validResults.length / 2)]);
      
      resolve(medianLatency);
    });
  });
};
