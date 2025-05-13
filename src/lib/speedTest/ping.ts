
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
      'https://www.amazon.com'
    ];
    
    const pingPromises = endpoints.map(endpoint => {
      return new Promise<number>((resolveEndpoint) => {
        const startTime = performance.now();
        
        fetch(`${endpoint}/favicon.ico?cachebust=${Date.now()}`, { 
          mode: 'no-cors',
          cache: 'no-store',
          credentials: 'omit', // Avoid sending cookies for faster requests
          priority: 'high',    // Signal high priority to browser
        })
        .then(() => {
          const latency = performance.now() - startTime;
          resolveEndpoint(latency);
        })
        .catch(() => {
          // Try with image as fallback (works better in some browsers)
          const img = new Image();
          const imgStartTime = performance.now();
          
          img.onload = img.onerror = function() {
            const imgLatency = performance.now() - imgStartTime;
            resolveEndpoint(imgLatency);
          };
          
          img.src = `${endpoint}/favicon.ico?cachebust=${Date.now()}`;
          
          // Set timeout for this endpoint
          setTimeout(() => resolveEndpoint(1500), 1500);
        });
      });
    });
    
    // Calculate median latency from all endpoints
    Promise.all(pingPromises).then(results => {
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
