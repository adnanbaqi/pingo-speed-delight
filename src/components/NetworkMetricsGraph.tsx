
import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  time: number;
  value: number;
}

interface NetworkMetricsGraphProps {
  title: string;
  data: DataPoint[];
  color: string;
  unit: string;
  maxValue?: number;
}

// Memoized component for better performance
const NetworkMetricsGraph = memo(({
  title,
  data,
  color,
  unit,
  maxValue = 100,
}: NetworkMetricsGraphProps) => {
  // Format data for the chart
  const formattedData = data.map((point) => ({
    time: `${point.time.toFixed(1)}s`,
    value: point.value,
  }));

  // Calculate a reasonable maxDomain based on actual data
  const dataMax = Math.max(...data.map(p => p.value), 1);
  const yMaxDomain = Math.max(dataMax * 1.2, maxValue);

  return (
    <Card className="w-full glass-dark">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="time"
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis
                domain={[0, yMaxDomain]}
                tickFormatter={(value) => `${Math.round(value)}`}
                tick={{ fill: '#94a3b8' }}
                width={40}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value;
                    return (
                      <div className="rounded-lg border bg-black/80 backdrop-blur-lg p-3 shadow-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Time
                            </span>
                            <span className="font-bold text-sm">
                              {payload[0].payload.time}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {title}
                            </span>
                            <span className="font-bold text-sm">
                              {typeof value === 'number' ? value.toFixed(1) : value} {unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={`${title} (${unit})`}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: color }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

NetworkMetricsGraph.displayName = 'NetworkMetricsGraph';

export default NetworkMetricsGraph;
