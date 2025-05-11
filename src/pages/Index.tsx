
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PingoLogo from '@/components/PingoLogo';
import { ArrowRight, Download, Upload, Gauge } from 'lucide-react';

const features = [
  {
    title: "Download Speed",
    description: "Measure how quickly your device can retrieve data from the internet. Great for streaming, gaming, and browsing.",
    icon: Download
  },
  {
    title: "Upload Speed",
    description: "Test how fast your connection can send data to the internet. Important for video calls, file sharing, and cloud backups.",
    icon: Upload
  },
  {
    title: "Ping/Latency",
    description: "Measure the responsiveness of your connection. Lower ping means less lag for gaming and video calls.",
    icon: Gauge
  }
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-gradient">Fast. Simple.</span><br />
                Internet Speed Testing
              </h1>
              <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Pingo makes it easy to measure your internet connection's performance. 
                Get accurate download, upload, and ping measurements in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/test">
                    Start Speed Test <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                <PingoLogo animated className="w-full h-full z-10 relative" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How Pingo Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Pingo uses a series of tests to accurately measure your connection's performance
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-medium mb-2">Ping Test</h3>
              <p className="text-muted-foreground">
                We start by measuring your connection's latency (ping) by sending small packets of data to our servers.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-medium mb-2">Download Test</h3>
              <p className="text-muted-foreground">
                Next, we measure how quickly your device can download data from our servers using multiple connections.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-medium mb-2">Upload Test</h3>
              <p className="text-muted-foreground">
                Finally, we measure how quickly your device can send data to our servers to determine your upload speed.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-10">
            <Button asChild size="lg">
              <Link to="/test">Test My Speed Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="bg-gradient-to-r from-pingo-500 to-purple-500 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Test Your Speed?</h2>
              <p className="text-lg opacity-90 mb-8">
                Get accurate measurements of your internet connection's performance in just a few clicks.
              </p>
              <Button asChild size="lg" variant="secondary" className="font-medium">
                <Link to="/test">Start Free Speed Test</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <PingoLogo className="h-8 w-8" />
              <span className="font-bold text-xl">Pingo</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pingo Speed Test. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
