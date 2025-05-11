
import { Book, Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Learn = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Learn About Internet Speed Tests</span>
          </h1>
          <p className="text-muted-foreground">
            Understanding how internet speed tests work and what the numbers mean
          </p>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Book className="text-primary" />
            <h2 className="text-2xl font-bold">What Do the Results Mean?</h2>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Download Speed</CardTitle>
              <CardDescription>How quickly you can retrieve data from the internet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Download speed measures how fast data travels from the internet to your device. It's measured in:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Mbps (Megabits per second)</strong> - The standard unit for internet speeds</li>
                <li><strong>MB/s (Megabytes per second)</strong> - 1 MB/s equals 8 Mbps</li>
              </ul>
              <p className="text-sm text-muted-foreground italic">Tip: For HD video streaming, 5-8 Mbps is recommended. For 4K content, at least 25 Mbps is ideal.</p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Speed</CardTitle>
              <CardDescription>How quickly you can send data to the internet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Upload speed determines how fast you can send data from your device to the internet, important for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Video calls and conferencing</li>
                <li>Uploading files to cloud storage</li>
                <li>Live streaming</li>
                <li>Online gaming</li>
              </ul>
              <p className="text-sm text-muted-foreground italic">Tip: For video conferencing, at least 3 Mbps upload is recommended.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ping/Latency</CardTitle>
              <CardDescription>The response time of your connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Ping measures the time it takes for data to travel from your device to a server and back, measured in milliseconds (ms).</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Excellent: &lt; 20ms</p>
                  <p className="text-sm text-muted-foreground">Perfect for competitive gaming</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Good: 20-50ms</p>
                  <p className="text-sm text-muted-foreground">Great for most online activities</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Average: 50-100ms</p>
                  <p className="text-sm text-muted-foreground">Acceptable for general use</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Poor: &gt; 100ms</p>
                  <p className="text-sm text-muted-foreground">May cause lag in real-time applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Network className="text-primary" />
            <h2 className="text-2xl font-bold">How Speed Tests Work</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">The Testing Process</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <p className="font-medium">Server Selection</p>
                  <p className="text-muted-foreground">The test begins by selecting a server, preferably one close to your location to minimize latency.</p>
                </li>
                <li>
                  <p className="font-medium">Ping Test</p>
                  <p className="text-muted-foreground">Small packets of data are sent to measure response time (latency) between your device and the server.</p>
                </li>
                <li>
                  <p className="font-medium">Download Test</p>
                  <p className="text-muted-foreground">Multiple connections are opened to download sample files, measuring how quickly your connection can retrieve data.</p>
                </li>
                <li>
                  <p className="font-medium">Upload Test</p>
                  <p className="text-muted-foreground">Sample data is sent from your device to the server to determine how quickly you can upload information.</p>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Factors Affecting Results</h3>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Device Limitations</p>
                        <p className="text-sm text-muted-foreground">Older devices, especially with outdated WiFi hardware, may not achieve the full speeds your connection is capable of.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Network Congestion</p>
                        <p className="text-sm text-muted-foreground">If many users are on your network or your ISP's network is congested, speeds may decrease.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Distance to Server</p>
                        <p className="text-sm text-muted-foreground">Testing against distant servers will result in higher latency and potentially lower speed results.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">WiFi vs. Wired</p>
                        <p className="text-sm text-muted-foreground">Wired connections typically provide more stable and faster results than WiFi connections.</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Learn;
