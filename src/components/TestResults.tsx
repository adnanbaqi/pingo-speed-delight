
import { TestStage, TestResults as TestResultsType } from '@/types/speedTest';
import PerformanceGrade from '@/components/PerformanceGrade';

interface TestResultsProps {
  stage: TestStage;
  results: TestResultsType;
  formatSpeed: (speed: number | null) => string;
  getUnitSuffix: () => string;
}

const TestResults = ({ stage, results, formatSpeed, getUnitSuffix }: TestResultsProps) => {
  if (stage !== 'completed') {
    return null;
  }

  // Helper function to get better descriptions based on actual values
  const getSpeedDescription = (type: 'ping' | 'download' | 'upload', value: number | null) => {
    if (value === null) return "Could not measure";
    
    if (type === 'ping') {
      if (value < 20) return 'Excellent for gaming & video calls';
      if (value < 40) return 'Very good for most applications';
      if (value < 60) return 'Good for most online activities';
      if (value < 100) return 'Acceptable for general browsing';
      return 'May cause lag in real-time applications';
    } else if (type === 'download') {
      if (value > 100) return 'Excellent for 4K/8K streaming & large downloads';
      if (value > 50) return 'Great for streaming HD content & gaming';
      if (value > 25) return 'Good for HD streaming & most activities';
      if (value > 10) return 'Suitable for standard streaming & browsing';
      return 'May struggle with HD content & downloads';
    } else { // upload
      if (value > 50) return 'Excellent for content creation & live streaming';
      if (value > 25) return 'Great for video calls & file sharing';
      if (value > 10) return 'Good for most upload activities';
      if (value > 5) return 'Suitable for basic video calls & uploads';
      return 'May struggle with large uploads & video calls';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center">
        <div className="flex justify-between w-full">
          <h3 className="text-lg font-medium mb-2">Latency (Unloaded)</h3>
          {results.ping && <PerformanceGrade value={results.ping} type="ping" />}
        </div>
        <div className="text-3xl font-bold">{results.ping}<span className="text-xl ml-1 text-muted-foreground">ms</span></div>
        <p className="mt-2 text-sm text-muted-foreground">
          {results.ping && getSpeedDescription('ping', results.ping)}
        </p>
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center">
        <div className="flex justify-between w-full">
          <h3 className="text-lg font-medium mb-2">Download</h3>
          {results.download && <PerformanceGrade value={results.download} type="download" />}
        </div>
        <div className="text-3xl font-bold">
          {formatSpeed(results.download)}
          <span className="text-xl ml-1 text-muted-foreground">{getUnitSuffix()}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {results.download && getSpeedDescription('download', results.download)}
        </p>
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center">
        <div className="flex justify-between w-full">
          <h3 className="text-lg font-medium mb-2">Upload</h3>
          {results.upload && <PerformanceGrade value={results.upload} type="upload" />}
        </div>
        <div className="text-3xl font-bold">
          {formatSpeed(results.upload)}
          <span className="text-xl ml-1 text-muted-foreground">{getUnitSuffix()}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {results.upload && getSpeedDescription('upload', results.upload)}
        </p>
      </div>
    </div>
  );
};

export default TestResults;
