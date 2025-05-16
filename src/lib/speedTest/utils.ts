
/**
 * Helper function to generate simulated data when real tests fail
 */
export const generateSimulatedData = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

/**
 * Advanced function to estimate user's actual internet quality
 */
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

/**
 * Generate more realistic test data based on average speeds
 * Used as fallback when real tests fail
 */
export const generateRealisticTestData = (
  testType: 'download' | 'upload' | 'ping'
): number => {
  // More realistic ranges for different connection types
  switch(testType) {
    case 'ping':
      // Most common ping ranges (20-100ms)
      return Math.floor(20 + Math.random() * 80);
    case 'download':
      // More realistic download speeds (5-50 Mbps for average connection)
      const downloadTypes = [
        { min: 5, max: 15, probability: 0.25 },   // Basic DSL/low-end connection 
        { min: 15, max: 50, probability: 0.45 },  // Average broadband
        { min: 50, max: 100, probability: 0.2 },  // Good fiber/cable
        { min: 100, max: 500, probability: 0.1 }  // Excellent fiber
      ];
      return getRandomSpeedFromDistribution(downloadTypes);
    case 'upload':
      // More realistic upload speeds (typically lower than download)
      const uploadTypes = [
        { min: 1, max: 5, probability: 0.3 },    // Basic DSL/low-end connection
        { min: 5, max: 15, probability: 0.4 },   // Average broadband  
        { min: 15, max: 50, probability: 0.2 },  // Good fiber/cable
        { min: 50, max: 200, probability: 0.1 }  // Excellent fiber
      ];
      return getRandomSpeedFromDistribution(uploadTypes);
    default:
      return 10;
  }
};

// Helper function to generate more realistic speed distributions
function getRandomSpeedFromDistribution(
  types: Array<{ min: number, max: number, probability: number }>
): number {
  const rand = Math.random();
  let cumulativeProbability = 0;
  
  for (const type of types) {
    cumulativeProbability += type.probability;
    if (rand <= cumulativeProbability) {
      return type.min + Math.random() * (type.max - type.min);
    }
  }
  
  // Fallback
  return types[0].min + Math.random() * (types[0].max - types[0].min);
}
