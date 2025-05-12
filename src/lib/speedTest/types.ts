
import { DataPoint } from '@/types/speedTest';

export type SpeedCallback = (speed: number) => void;
export type CompleteCallback = (finalSpeed: number) => void;
export type ProgressCallback = (percent: number) => void;
export type DataPointCallback = (time: number, value: number) => void;

export interface TestController {
  cancel: () => void;
}
