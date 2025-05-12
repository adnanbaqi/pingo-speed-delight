
import { Progress } from '@/components/ui/progress';
import { TestStage } from '@/types/speedTest';

interface TestProgressBarProps {
  stage: TestStage;
  progress: number;
}

const TestProgressBar = ({ stage, progress }: TestProgressBarProps) => {
  if (stage === 'idle' || stage === 'completed') {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          {stage === 'ping' ? 'Measuring ping...' : 
           stage === 'download' ? 'Testing download speed...' : 
           'Testing upload speed...'}
        </span>
        <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default TestProgressBar;
