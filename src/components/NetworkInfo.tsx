
import { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detectConnectionType, detectDeviceInfo, fetchIpAndProviderInfo, NetworkInfoData } from '@/lib/networkUtils';
import NetworkInfoColumn from './NetworkInfoColumn';
import { Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NetworkInfo = memo(() => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData>({
    networkType: 'Loading...',
    networkName: 'Loading...',
    ipAddress: 'Loading...',
    provider: 'Loading...',
    connectionType: 'Loading...',
    deviceName: 'Loading...',
    browserName: 'Loading...',
    operatingSystem: 'Loading...'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        // Get connection and device info from utility functions
        const { networkType, connectionType } = detectConnectionType();
        const { deviceName, browserName, operatingSystem } = detectDeviceInfo();
        
        // Fetch IP and provider info
        const { ipAddress, provider, networkName } = await fetchIpAndProviderInfo();
        
        setNetworkInfo({
          networkType,
          networkName,
          ipAddress,
          provider,
          connectionType,
          deviceName,
          browserName,
          operatingSystem
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching network information:', error);
        toast({
          title: "Network Detection Issue",
          description: "We couldn't retrieve all your network information. Some details may be limited.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchNetworkInfo();
  }, [toast]);
  
  // Organize info items for each column
  const leftColumnItems = [
    { label: "Network Type", value: networkInfo.networkType, ariaLabel: "Your network type" },
    { label: "Network Name", value: networkInfo.networkName, ariaLabel: "Your network name" },
    { label: "IP Address", value: networkInfo.ipAddress, ariaLabel: "Your IP address" },
    { label: "Provider", value: networkInfo.provider, ariaLabel: "Your internet service provider" }
  ];
  
  const rightColumnItems = [
    { label: "Connection Type", value: networkInfo.connectionType, ariaLabel: "Your connection type" },
    { label: "Device", value: networkInfo.deviceName, ariaLabel: "Your device type" },
    { label: "Browser", value: networkInfo.browserName, ariaLabel: "Your browser" },
    { label: "OS", value: networkInfo.operatingSystem, ariaLabel: "Your operating system" }
  ];
  
  return (
    <Card className="glass-dark">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5" aria-hidden="true" />
          <CardTitle className="text-xl">Network Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent aria-busy={isLoading} aria-live="polite">
        {isLoading ? (
          <div className="flex justify-center my-4">
            <div className="animate-pulse-ring h-8 w-8 rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NetworkInfoColumn items={leftColumnItems} />
            <NetworkInfoColumn items={rightColumnItems} />
          </div>
        )}
      </CardContent>
    </Card>
  );
});

NetworkInfo.displayName = 'NetworkInfo';

export default NetworkInfo;
