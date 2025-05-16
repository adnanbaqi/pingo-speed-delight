
/**
 * Utility functions for network information detection
 */

export interface NetworkInfoData {
  networkType: string;
  networkName: string;
  ipAddress: string;
  provider: string;
  connectionType: string;
  deviceName: string;
  browserName: string;
  operatingSystem: string;
}

/**
 * Detects the connection and network type based on browser APIs
 */
export const detectConnectionType = (): { networkType: string; connectionType: string } => {
  // Get connection information
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  let connectionType = 'Unknown';
  let networkType = 'Unknown';
  
  try {
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
  } catch (error) {
    console.error('Error detecting connection type:', error);
    // Fallback values
    networkType = navigator.onLine ? 'Online (detection failed)' : 'Offline';
  }
  
  return { networkType, connectionType };
};

/**
 * Detects device information based on user agent
 */
export const detectDeviceInfo = (): { 
  deviceName: string; 
  browserName: string; 
  operatingSystem: string 
} => {
  // Get browser information
  const userAgent = navigator.userAgent.toLowerCase();
  
  let browserName = 'Unknown';
  let osName = 'Unknown';
  let deviceName = 'Unknown';
  
  try {
    // Determine browser more accurately
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
    
    // Determine OS more accurately
    if (/iphone|ipad|ipod/.test(userAgent)) {
      osName = "iOS";
    } else if (/android/.test(userAgent)) {
      osName = "Android";
    } else if (/windows/.test(userAgent)) {
      osName = "Windows";
    } else if (/macintosh|mac os x/.test(userAgent) && !(/iphone|ipad|ipod/.test(userAgent))) {
      osName = "macOS";
    } else if (/linux/.test(userAgent)) {
      osName = "Linux";
    }
    
    // Get device type/name
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
  } catch (error) {
    console.error('Error detecting device info:', error);
    deviceName = 'Unknown Device';
    browserName = 'Unknown Browser';
    osName = 'Unknown OS';
  }
  
  return {
    deviceName,
    browserName,
    operatingSystem: osName
  };
};

/**
 * Gets IP address and provider information 
 */
export const fetchIpAndProviderInfo = async (): Promise<{ 
  ipAddress: string; 
  provider: string;
  networkName: string;
}> => {
  try {
    // Get IP address information from a reliable public API
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      throw new Error('Failed to fetch IP address');
    }
    
    const ipData = await ipResponse.json();
    const ipv4Address = ipData.ip;

    // Get more detailed IP information
    const detailsResponse = await fetch(`https://ipapi.co/${ipv4Address}/json/`);
    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch IP details');
    }
    
    const detailsData = await detailsResponse.json();
    
    return {
      ipAddress: ipv4Address,
      provider: detailsData.org || detailsData.isp || 'Unknown',
      networkName: detailsData.org || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return {
      ipAddress: '127.0.0.1',
      provider: 'Could not determine',
      networkName: 'Could not determine'
    };
  }
};
