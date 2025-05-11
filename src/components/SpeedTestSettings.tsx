
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


interface SpeedTestSettingsProps {
  useMBps: boolean;
  setUseMBps: (value: boolean) => void;
}

const SpeedTestSettings = ({ useMBps, setUseMBps }: SpeedTestSettingsProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mb-4 p-4 rounded-lg glass-dark">
      <div className="flex items-center gap-2">
        <Label htmlFor="unit-toggle" className="text-sm font-medium cursor-pointer flex items-center gap-2">
          Speed Unit:
          <Info className="h-4 w-4 text-muted-foreground" />
        </Label>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${!useMBps ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
            Mbps
          </span>
          <Switch 
            id="unit-toggle" 
            checked={useMBps} 
            onCheckedChange={setUseMBps} 
          />
          <span className={`text-sm ${useMBps ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
            MB/s
          </span>
        </div>
      </div>
      <Button variant="outline" size="lg" className="w-full sm:w-auto">
  <Link to="/learn" className="w-full h-full flex justify-center items-center">
    Learn More
  </Link>
</Button>

    </div>
  );
};

export default SpeedTestSettings;
