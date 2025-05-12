
import PingoLogo from '@/components/PingoLogo';
import SpeedTestSettings from '@/components/SpeedTestSettings';
import TestStartButton from '@/components/TestStartButton';
import TestProgressBar from '@/components/TestProgressBar';
import CurrentSpeedometer from '@/components/CurrentSpeedometer';
import TestResults from '@/components/TestResults';
import TestInformation from '@/components/TestInformation';
import { useSpeedTest } from '@/hooks/useSpeedTest';

const SpeedTest = () => {
  const {
    stage,
    currentSpeed,
    progress,
    results,
    downloadData,
    uploadData,
    useMBps,
    setUseMBps,
    formatSpeed,
    getUnitSuffix,
    startTest,
    resetTest,
    getMaxValue
  } = useSpeedTest();

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Pingo Speed Test</span>
          </h1>
          <p className="text-muted-foreground">
            Test your internet connection speed with our cute penguin friend
          </p>
        </div>
        
        {/* Settings */}
        {stage === 'idle' && (
          <SpeedTestSettings useMBps={useMBps} setUseMBps={setUseMBps} />
        )}
        
        <div className="relative w-40 h-40 mb-4">
          <PingoLogo className="w-full h-full" animated={stage !== 'idle'} />
          {stage !== 'idle' && stage !== 'completed' && (
            <div className="absolute inset-0 rounded-full animate-pulse-ring border-4 border-primary/30"></div>
          )}
        </div>
        
        <TestStartButton 
          stage={stage} 
          onStartTest={startTest} 
          onResetTest={resetTest} 
        />
        
        <TestProgressBar stage={stage} progress={progress} />
        
        <CurrentSpeedometer 
          stage={stage} 
          currentSpeed={currentSpeed} 
          getMaxValue={getMaxValue} 
          getUnitSuffix={getUnitSuffix} 
        />
        
        <TestResults 
          stage={stage} 
          results={results} 
          formatSpeed={formatSpeed} 
          getUnitSuffix={getUnitSuffix} 
        />
        
        <TestInformation 
          stage={stage} 
          downloadData={downloadData} 
          uploadData={uploadData} 
          getUnitSuffix={getUnitSuffix} 
        />
      </div>
    </div>
  );
};

export default SpeedTest;
