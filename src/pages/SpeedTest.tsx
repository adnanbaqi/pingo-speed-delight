
import PingoLogo from '@/components/PingoLogo';
import SpeedTestSettings from '@/components/SpeedTestSettings';
import TestStartButton from '@/components/TestStartButton';
import TestProgressBar from '@/components/TestProgressBar';
import CurrentSpeedometer from '@/components/CurrentSpeedometer';
import TestResults from '@/components/TestResults';
import TestInformation from '@/components/TestInformation';
import { useSpeedTest } from '@/hooks/useSpeedTest';
import { Helmet } from 'react-helmet';

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
    getMaxValue,
    error
  } = useSpeedTest();

  return (
    <>
      <Helmet>
        <title>Pingo Speed Test - Check Your Internet Performance</title>
        <meta name="description" content="Test your internet connection speed with our cute penguin friend." />
      </Helmet>
      
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2" aria-label="Pingo Speed Test">
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
          
          <div className="relative w-40 h-40 mb-4" aria-hidden="true">
            <PingoLogo className="w-full h-full" animated={stage !== 'idle'} />
            {stage !== 'idle' && stage !== 'completed' && (
              <div className="absolute inset-0 rounded-full animate-pulse-ring border-4 border-primary/30"></div>
            )}
          </div>
          
          {error && (
            <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-md" 
                 role="alert" 
                 aria-live="assertive">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <TestStartButton 
            stage={stage} 
            onStartTest={startTest} 
            onResetTest={resetTest} 
          />
          
          <TestProgressBar stage={stage} progress={progress} />
          
          <div aria-live="polite" className="sr-only">
            {stage !== 'idle' && stage !== 'completed' && (
              <span>Testing {stage} speed, {progress}% complete</span>
            )}
            {stage === 'completed' && (
              <span>Speed test completed</span>
            )}
          </div>
          
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
    </>
  );
};

export default SpeedTest;
