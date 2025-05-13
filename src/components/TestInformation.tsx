
import { TestStage, DataPoint } from '@/types/speedTest';
import NetworkInfo from '@/components/NetworkInfo';
import NetworkMetricsGraph from '@/components/NetworkMetricsGraph';

interface TestInformationProps {
  stage: TestStage;
  downloadData: DataPoint[];
  uploadData: DataPoint[];
  getUnitSuffix: () => string;
}

const TestInformation = ({ stage, downloadData, uploadData, getUnitSuffix }: TestInformationProps) => {
  if (stage !== 'completed') {
    return null;
  }

  return (
    <>
      <div className="w-full mt-6">
        <NetworkInfo />
      </div>

      <div className="w-full space-y-6">
        <h2 className="text-2xl font-bold mt-4">Detailed Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NetworkMetricsGraph
            title="Download Speed"
            data={downloadData}
            color="#3b82f6"
            unit={getUnitSuffix()}
            maxValue={200}
          />
          
          <NetworkMetricsGraph
            title="Upload Speed"
            data={uploadData}
            color="#10b981"
            unit={getUnitSuffix()}
            maxValue={100}
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 w-full">
        <h3 className="font-medium mb-2">What do these results mean?</h3>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Latency:</strong> Measures the time it takes for data to travel from your device to a server and back. 
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
    </>
  );
};

export default TestInformation;
