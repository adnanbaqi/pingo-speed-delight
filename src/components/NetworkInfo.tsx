
import { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkInfoData {
  networkType: string;
  networkName: string;
  ipAddress: string;
  provider: string;
  connectionType: string;
  deviceName: string;
  browserName: string;
  operatingSystem: string;
}

// Enhanced with memoization for better performance
const NetworkInfo = memo(() => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData>({
    networkType: 'Unknown',
    networkName: 'Unknown',
    ipAddress: '0.0.0.0',
    provider: 'Unknown',
    connectionType: 'Unknown',
    deviceName: 'Unknown',
    browserName: 'Unknown',
    operatingSystem: 'Unknown'
  });

  useEffect(() => {
    // Simulate fetching network information
    const fetchNetworkInfo = () => {
      // In a real app, this would be an API call
      const userAgent = navigator.userAgent;
      
      // Get the browser name
      let browserName = 'Unknown';
      if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
      } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browserName = "Opera";
      } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Edge";
      } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
      } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
      }
      
      // Get the OS name
      let osName = 'Unknown';
      if (userAgent.indexOf("Windows") > -1) {
        osName = "Windows";
      } else if (userAgent.indexOf("Mac") > -1) {
        osName = "MacOS";
      } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
      } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
      } else if (userAgent.indexOf("iOS") > -1) {
        osName = "iOS";
      }
      
      // Get connection type
      const connection = (navigator as any).connection || 
                         (navigator as any).mozConnection || 
                         (navigator as any).webkitConnection;
      
      let connectionType = 'Unknown';
      if (connection) {
        connectionType = connection.effectiveType || 'Unknown';
      }
      
      // Simulate network data
      setNetworkInfo({
        networkType: 'WiFi',
        networkName: 'Home Network',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        provider: 'Local ISP',
        connectionType: connectionType,
        deviceName: osName,
        browserName: browserName,
        operatingSystem: osName
      });
    };
    
    fetchNetworkInfo();
  }, []);
  
  return (
    <Card className="glass-dark">
      <CardHeader>
        <CardTitle className="text-xl">Network Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Network Type</h3>
              <p>{networkInfo.networkType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Network Name</h3>
              <p>{networkInfo.networkName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
              <p>{networkInfo.ipAddress}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Provider</h3>
              <p>{networkInfo.provider}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Connection Type</h3>
              <p>{networkInfo.connectionType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Device</h3>
              <p>{networkInfo.deviceName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Browser</h3>
              <p>{networkInfo.browserName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">OS</h3>
              <p>{networkInfo.operatingSystem}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

NetworkInfo.displayName = 'NetworkInfo';

export default NetworkInfo;
