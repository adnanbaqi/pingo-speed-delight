
export type TestStage = 'idle' | 'ping' | 'download' | 'upload' | 'completed';

export interface TestResults {
  ping: number | null;
  download: number | null;
  upload: number | null;
}

export interface DataPoint {
  time: number;
  value: number;
}

export interface NetworkInfo {
  ipAddress: string;
  isp: string;
  location: string;
  device: string;
  browser: string;
  connection: string;
}
