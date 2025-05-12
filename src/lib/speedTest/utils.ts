
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
