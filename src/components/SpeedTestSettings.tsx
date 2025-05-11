
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SpeedTestSettingsProps {
  useMBps: boolean;
  setUseMBps: (value: boolean) => void;
}

const SpeedTestSettings = ({ useMBps, setUseMBps }: SpeedTestSettingsProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mb-4 p-3 rounded-lg bg-card border">
      <div className="flex items-center gap-2">
        <Label htmlFor="unit-toggle" className="text-sm font-medium cursor-pointer">
          Speed Unit:
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
      <a href="/learn" className="text-sm text-primary hover:underline">
        Learn more
      </a>
    </div>
  );
};

export default SpeedTestSettings;
