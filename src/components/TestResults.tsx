
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center">
        <div className="flex justify-between w-full">
          <h3 className="text-lg font-medium mb-2">Ping</h3>
          {results.ping && <PerformanceGrade value={results.ping} type="ping" />}
        </div>
        <div className="text-3xl font-bold">{results.ping}<span className="text-xl ml-1 text-muted-foreground">ms</span></div>
        <p className="mt-2 text-sm text-muted-foreground">
          {results.ping && results.ping < 50 ? 'Excellent' : 
           results.ping && results.ping < 100 ? 'Good' : 'Could be better'}
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
          {results.download && results.download > 100 ? 'Excellent' : 
           results.download && results.download > 50 ? 'Good' : 'Could be better'}
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
          {results.upload && results.upload > 50 ? 'Excellent' : 
           results.upload && results.upload > 20 ? 'Good' : 'Could be better'}
        </p>
      </div>
    </div>
  );
};

export default TestResults;
