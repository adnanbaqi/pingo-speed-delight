
import { Button } from '@/components/ui/button';
import { TestStage } from '@/types/speedTest';

interface TestStartButtonProps {
  stage: TestStage;
  onStartTest: () => void;
  onResetTest: () => void;
}

const TestStartButton = ({ stage, onStartTest, onResetTest }: TestStartButtonProps) => {
  if (stage === 'idle') {
    return (
      <Button 
        onClick={onStartTest} 
        className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
      >
        Start Speed Test
      </Button>
    );
  }
  
  if (stage === 'completed') {
    return (
      <Button 
        onClick={onResetTest}
        className="px-8 py-6 text-lg"
        variant="outline"
      >
        Test Again
      </Button>
    );
  }
  
  return null;
};

export default TestStartButton;
