
import { useState } from 'react';
import { simulatePing, simulateDownloadTest, simulateUploadTest } from '@/lib/speedTest';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '@/hooks/useAudio';
import { TestStage, TestResults, DataPoint } from '@/types/speedTest';

export const useSpeedTest = () => {
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
  const [useMBps, setUseMBps] = useState<boolean>(false);
  
  const { playPingSound, playStartSound, playCompleteSound } = useAudio();
  const { toast } = useToast();
  
  // Convert Mbps to MB/s if needed
  const formatSpeed = (speedMbps: number | null): string => {
    if (speedMbps === null) return "0";
    
    if (useMBps) {
      // Convert Mbps to MB/s (1 MB/s = 8 Mbps)
      return (speedMbps / 8).toFixed(1);
    }
    return speedMbps.toFixed(1);
  };

  // Get the current unit suffix
  const getUnitSuffix = (): string => {
    return useMBps ? "MB/s" : "Mbps";
  };

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
        description: `Speed: ${formatSpeed(results.download)} ${getUnitSuffix()}. Starting upload test...`,
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

  return {
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
  };
};
