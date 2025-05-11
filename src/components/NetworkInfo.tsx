
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NetworkDetails {
  ip: string;
  provider: string;
  networkName: string;
  networkType: string;
}

const NetworkInfo = () => {
  const [networkDetails, setNetworkDetails] = useState<NetworkDetails>({
    ip: '192.168.1.1',
    provider: 'Detecting...',
    networkName: 'Detecting...',
    networkType: 'Detecting...'
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching network information
    const detectNetworkDetails = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an actual API call
        // For now we'll simulate with a timeout and mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get connection type
        const connection = (navigator as any).connection || 
                          (navigator as any).mozConnection || 
                          (navigator as any).webkitConnection;
                          
        let networkType = 'Unknown';
        if (connection) {
          networkType = connection.effectiveType || connection.type || 'Unknown';
        }
        
        // Mock data - in a real app, you would fetch this from an API
        setNetworkDetails({
          ip: '203.0.113.' + Math.floor(Math.random() * 255),
          provider: ['Spectrum', 'Comcast', 'AT&T', 'Verizon', 'T-Mobile'][Math.floor(Math.random() * 5)],
          networkName: 'WiFi ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
          networkType: networkType !== 'Unknown' ? networkType : 
                      ['WiFi', '4G', 'Cable', 'Fiber', 'DSL'][Math.floor(Math.random() * 5)]
        });
      } catch (error) {
        console.error('Error fetching network details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectNetworkDetails();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Network Information</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="font-medium text-muted-foreground">IP Address:</dt>
            <dd className="font-mono">{networkDetails.ip}</dd>
            
            <dt className="font-medium text-muted-foreground">Provider:</dt>
            <dd>{networkDetails.provider}</dd>
            
            <dt className="font-medium text-muted-foreground">Network Name:</dt>
            <dd>{networkDetails.networkName}</dd>
            
            <dt className="font-medium text-muted-foreground">Connection Type:</dt>
            <dd>{networkDetails.networkType}</dd>
          </dl>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkInfo;
