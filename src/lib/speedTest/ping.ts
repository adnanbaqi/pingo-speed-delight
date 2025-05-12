
/**
 * Tests ping by measuring round-trip time to multiple endpoints
 * @returns Promise with ping in ms
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
        
        // Use fetch for more accurate timing than image loading
        fetch(`${endpoint}/favicon.ico?cachebust=${Date.now()}`, { 
          mode: 'no-cors',  // Allow cross-origin requests
          cache: 'no-store' // Don't use cached results
        })
        .then(() => {
          // Calculate round-trip time
          resolveEndpoint(performance.now() - startTime);
        })
        .catch(() => {
          // Use XMLHttpRequest as fallback
          const xhr = new XMLHttpRequest();
          const xhrStartTime = performance.now();
          
          xhr.onload = xhr.onerror = function() {
            resolveEndpoint(performance.now() - xhrStartTime);
          };
          
          xhr.open('GET', `${endpoint}/favicon.ico?cachebust=${Date.now()}`);
          xhr.send();
          
          // Set timeout for this endpoint
          setTimeout(() => resolveEndpoint(2000), 2000);
        });
      });
    });
    
    // Calculate average ping from all endpoints
    Promise.all(pingPromises).then(results => {
      // Filter out timeouts and failures
      const validResults = results.filter(time => time < 2000);
      
      if (validResults.length === 0) {
        // All requests failed, return a high ping value
        resolve(500);
        return;
      }
      
      // Remove outliers (sort and take middle values)
      validResults.sort((a, b) => a - b);
      
      const trimmedResults = validResults.length > 3 
        ? validResults.slice(1, -1) 
        : validResults;
      
      const avgPing = Math.round(
        trimmedResults.reduce((sum, val) => sum + val, 0) / trimmedResults.length
      );
      
      resolve(avgPing);
    });
  });
};
