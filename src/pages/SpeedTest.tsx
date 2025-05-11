
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Speedometer from '@/components/Speedometer';
import PingoLogo from '@/components/PingoLogo';
import NetworkMetricsGraph from '@/components/NetworkMetricsGraph';
import PerformanceGrade from '@/components/PerformanceGrade';
import { simulatePing, simulateDownloadTest, simulateUploadTest } from '@/lib/speedTest';
import { useAudio } from '@/hooks/useAudio';
import { useToast } from '@/hooks/use-toast';

type TestStage = 'idle' | 'ping' | 'download' | 'upload' | 'completed';

interface TestResults {
  ping: number | null;
  download: number | null;
  upload: number | null;
}

interface DataPoint {
  time: number;
  value: number;
}

const SpeedTest = () => {
  const [stage, setStage] = useState<TestStage>('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResults>({
    ping: null,
    download: null,
    upload: null
  });
  const [downloadData, setDownloadData] = useState<DataPoint[]>([]);
  const [uploadData, setUploadData] = useState<DataPoint[]>([]);
  
  const { playPingSound, playStartSound, playCompleteSound } = useAudio();
  const { toast } = useToast();

  const startTest = async () => {
    setStage('ping');
    playStartSound();
    toast({
      title: "Speed test started",
      description: "Measuring your connection latency...",
      duration: 3000,
    });
    setResults({ ping: null, download: null, upload: null });
    setDownloadData([]);
    setUploadData([]);
    
    // Ping test
    const pingResult = await simulatePing();
    playPingSound();
    setResults(prev => ({ ...prev, ping: pingResult }));
    
    // Download test
    setStage('download');
    toast({
      title: "Ping test completed",
      description: `Latency: ${pingResult}ms. Starting download test...`,
      duration: 3000,
    });
    
    const downloadTest = simulateDownloadTest(
      (speed) => setCurrentSpeed(speed),
      (percent) => setProgress(percent),
      (time, value) => {
        setDownloadData(prev => [...prev, { time, value }]);
      },
      (finalSpeed) => {
        setResults(prev => ({ ...prev, download: finalSpeed }));
        startUploadTest();
      }
    );
    
    const startUploadTest = () => {
      setStage('upload');
      setProgress(0);
      setCurrentSpeed(0);
      
      toast({
        title: "Download test completed",
        description: `Speed: ${results.download?.toFixed(2)} Mbps. Starting upload test...`,
        duration: 3000,
      });
      
      simulateUploadTest(
        (speed) => setCurrentSpeed(speed),
        (percent) => setProgress(percent),
        (time, value) => {
          setUploadData(prev => [...prev, { time, value }]);
        },
        (finalSpeed) => {
          setResults(prev => ({ ...prev, upload: finalSpeed }));
          completeTest();
        }
      );
    };
    
    const completeTest = () => {
      setStage('completed');
      playCompleteSound();
      toast({
        title: "Speed test completed!",
        description: "All measurements finished successfully.",
        duration: 4000,
      });
    };
  };
  
  const resetTest = () => {
    setStage('idle');
    setProgress(0);
    setCurrentSpeed(0);
  };
  
  // Helper to get the right max value for the current test
  const getMaxValue = () => {
    switch(stage) {
      case 'download':
        return 200;
      case 'upload':
        return 100;
      default:
        return 100;
    }
  };

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
        
        <div className="relative w-40 h-40 mb-4">
          <PingoLogo className="w-full h-full" animated={stage !== 'idle'} />
          {stage !== 'idle' && stage !== 'completed' && (
            <div className="absolute inset-0 rounded-full animate-pulse-ring border-4 border-primary/30"></div>
          )}
        </div>
        
        {stage === 'idle' ? (
          <Button 
            onClick={startTest} 
            className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
          >
            Start Speed Test
          </Button>
        ) : stage === 'completed' ? (
          <Button 
            onClick={resetTest}
            className="px-8 py-6 text-lg"
            variant="outline"
          >
            Test Again
          </Button>
        ) : (
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
        )}
        
        {/* Current test display */}
        {(stage === 'download' || stage === 'upload') && (
          <div className="w-full">
            <Speedometer 
              value={currentSpeed} 
              maxValue={getMaxValue()}
              label={stage === 'download' ? 'Download Speed' : 'Upload Speed'} 
              unit="Mbps"
              color={stage === 'download' ? 
                "bg-gradient-to-r from-pingo-400 to-blue-500" : 
                "bg-gradient-to-r from-green-400 to-teal-500"}
            />
          </div>
        )}
        
        {/* Results display */}
        {stage === 'completed' && (
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
                {results.download?.toFixed(1)}
                <span className="text-xl ml-1 text-muted-foreground">Mbps</span>
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
                {results.upload?.toFixed(1)}
                <span className="text-xl ml-1 text-muted-foreground">Mbps</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {results.upload && results.upload > 50 ? 'Excellent' : 
                 results.upload && results.upload > 20 ? 'Good' : 'Could be better'}
              </p>
            </div>
          </div>
        )}

        {/* Network Metrics Graphs */}
        {stage === 'completed' && (
          <div className="w-full space-y-6">
            <h2 className="text-2xl font-bold mt-4">Detailed Performance Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NetworkMetricsGraph
                title="Download Speed"
                data={downloadData}
                color="#3b82f6"
                unit="Mbps"
                maxValue={200}
              />
              
              <NetworkMetricsGraph
                title="Upload Speed"
                data={uploadData}
                color="#10b981"
                unit="Mbps"
                maxValue={100}
              />
            </div>
          </div>
        )}
        
        {stage === 'completed' && (
          <div className="bg-muted/50 rounded-lg p-4 w-full">
            <h3 className="font-medium mb-2">What do these results mean?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Ping:</strong> Measures the time it takes for data to travel from your device to a server and back. 
              Lower is better. Under 50ms is excellent for most activities including gaming.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Download:</strong> Measures how quickly your connection can retrieve data from the internet. 
              Higher is better. 100+ Mbps is excellent for streaming 4K content and downloading large files.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Upload:</strong> Measures how quickly your connection can send data to the internet. 
              Higher is better. 20+ Mbps is good for video calls and uploading files to cloud storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedTest;
