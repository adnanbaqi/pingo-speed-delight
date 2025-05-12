
// Export all functionality from the refactored modules
export { simulatePing } from './ping';
export { simulateDownloadTest } from './download';
export { simulateUploadTest } from './upload';
export { estimateConnectionQuality } from './utils';
export type { SpeedCallback, CompleteCallback, ProgressCallback, DataPointCallback, TestController } from './types';
