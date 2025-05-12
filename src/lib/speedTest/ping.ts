
/**
 * Tests ping by measuring round-trip time to multiple endpoints
 * @returns Promise with ping in ms
 */
export const simulatePing = async (): Promise<number> => {
  return new Promise((resolve) => {
    // Start time measurement
    const startTime = performance.now();
    
    // Use more reliable endpoints
    const endpoints = [
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.microsoft.com',
      'https://www.apple.com'
    ];
    
    // Create image objects to ping servers (more reliable than fetch in some environments)
    const pingPromises = endpoints.map(endpoint => {
      return new Promise<number>((resolveEndpoint) => {
        const img = new Image();
        const pingStart = performance.now();
        
        const timeoutId = setTimeout(() => {
          // Consider failed after 2 seconds
          resolveEndpoint(2000);
        }, 2000);
        
        img.onload = () => {
          clearTimeout(timeoutId);
          resolveEndpoint(performance.now() - pingStart);
        };
        
        img.onerror = () => {
          // Even errors can be used to measure ping
          clearTimeout(timeoutId);
          resolveEndpoint(performance.now() - pingStart);
        };
        
        // Add cache buster
        img.src = `${endpoint}/favicon.ico?rand=${Math.random()}`;
      });
    });
    
    // Collect all successful pings and calculate average
    Promise.all(pingPromises).then(results => {
      // Remove outliers
      results.sort((a, b) => a - b);
      // Use middle values if we have enough results
      const validPings = results.length > 3 
        ? results.slice(1, -1) 
        : results;
      
      const avgPing = Math.round(
        validPings.reduce((sum, val) => sum + val, 0) / validPings.length
      );
      
      resolve(avgPing);
    });
  });
};
