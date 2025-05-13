
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

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        // Get IP address information from a reliable public API
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipv4Address = ipData.ip;

        // Get more detailed IP information
        const detailsResponse = await fetch(`https://ipapi.co/${ipv4Address}/json/`);
        const detailsData = await detailsResponse.json();
        
        // Get connection information
        const connection = (navigator as any).connection || 
                          (navigator as any).mozConnection || 
                          (navigator as any).webkitConnection;
        
        let connectionType = 'Unknown';
        let networkType = 'Unknown';
        
        // Better network type detection
        if (connection) {
          // For connection type (speed)
          connectionType = connection.effectiveType || 'Unknown';
          
          // For network type
          if (connection.type) {
            networkType = connection.type;
          } else if (typeof navigator.onLine !== 'undefined') {
            // Fallback to basic online/offline detection
            networkType = navigator.onLine ? 'Online' : 'Offline';
            
            // Try to determine WiFi vs Cellular using the effectiveType
            if (navigator.onLine) {
              if (connection.effectiveType === '4g') {
                networkType = 'WiFi/High-speed';
              } else if (['3g', '2g', 'slow-2g'].includes(connection.effectiveType)) {
                networkType = 'Cellular/Mobile';
              }
            }
          }
          
          // Clean up terminology
          if (networkType === 'wifi') networkType = 'WiFi';
          if (networkType === 'cellular') networkType = 'Cellular';
          if (connectionType === '4g') connectionType = '4G';
          if (connectionType === '3g') connectionType = '3G';
          if (connectionType === '2g') connectionType = '2G';
          if (connectionType === 'slow-2g') connectionType = 'EDGE/GPRS';
        } else {
          // Further fallback for browsers without connection API
          networkType = navigator.onLine ? 'Online (type unknown)' : 'Offline';
        }
        
        // Get browser information
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Determine browser more accurately
        let browserName = 'Unknown';
        if (userAgent.indexOf("firefox") > -1) {
          browserName = "Firefox";
        } else if (userAgent.indexOf("edg") > -1 || userAgent.indexOf("edge") > -1) {
          browserName = "Edge";
        } else if (userAgent.indexOf("chrome") > -1) {
          browserName = "Chrome";
        } else if (userAgent.indexOf("safari") > -1) {
          browserName = "Safari";
        } else if (userAgent.indexOf("opera") > -1 || userAgent.indexOf("opr") > -1) {
          browserName = "Opera";
        }
        
        // Determine OS more accurately, specifically differentiating iOS and macOS
        let osName = 'Unknown';
        
        // Mobile OS detection first
        if (/iphone|ipad|ipod/.test(userAgent)) {
          osName = "iOS";
        } else if (/android/.test(userAgent)) {
          osName = "Android";
        } 
        // Then desktop OS detection
        else if (/windows/.test(userAgent)) {
          osName = "Windows";
        } else if (/macintosh|mac os x/.test(userAgent) && !(/iphone|ipad|ipod/.test(userAgent))) {
          osName = "macOS"; // Only mark as macOS if not also detected as iOS device
        } else if (/linux/.test(userAgent)) {
          osName = "Linux";
        }
        
        // Get device type/name
        let deviceName = 'Unknown';
        if (/iphone/.test(userAgent)) {
          deviceName = "iPhone";
        } else if (/ipad/.test(userAgent)) {
          deviceName = "iPad";
        } else if (/android/.test(userAgent)) {
          if (/mobile/.test(userAgent)) {
            deviceName = "Android Phone";
          } else {
            deviceName = "Android Tablet";
          }
        } else {
          deviceName = osName + " Device"; // Desktop/laptop
        }
        
        setNetworkInfo({
          networkType: networkType,
          networkName: detailsData.org || 'Unknown',
          ipAddress: ipv4Address,
          provider: detailsData.org || detailsData.isp || 'Unknown',
          connectionType: connectionType,
          deviceName: deviceName,
          browserName: browserName,
          operatingSystem: osName
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching network information:', error);
        // Provide fallback values if API calls fail
        setNetworkInfo(prev => ({
          ...prev,
          ipAddress: '127.0.0.1', // Fallback
          provider: 'Could not determine',
        }));
        setIsLoading(false);
      }
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
