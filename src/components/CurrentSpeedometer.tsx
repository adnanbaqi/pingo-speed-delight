
import Speedometer from '@/components/Speedometer';
import { TestStage } from '@/types/speedTest';

interface CurrentSpeedometerProps {
  stage: TestStage;
  currentSpeed: number;
  getMaxValue: () => number;
  getUnitSuffix: () => string;
}

const CurrentSpeedometer = ({ stage, currentSpeed, getMaxValue, getUnitSuffix }: CurrentSpeedometerProps) => {
  if (stage !== 'download' && stage !== 'upload') {
    return null;
  }

  return (
    <div className="w-full">
      <Speedometer 
        value={currentSpeed} 
        maxValue={getMaxValue()}
        label={stage === 'download' ? 'Download Speed' : 'Upload Speed'} 
        unit={getUnitSuffix()}
        color={stage === 'download' ? 
          "bg-gradient-to-r from-pingo-400 to-blue-500" : 
          "bg-gradient-to-r from-green-400 to-teal-500"}
      />
    </div>
  );
};

export default CurrentSpeedometer;
