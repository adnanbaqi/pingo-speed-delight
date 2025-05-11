
import { useState } from 'react';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
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

const NetworkMetricsGraph = ({
  title,
  data,
  color,
  unit,
  maxValue = 100,
}: NetworkMetricsGraphProps) => {
  const formattedData = data.map((point) => ({
    time: `${point.time}s`,
    value: point.value,
  }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ChartContainer
            config={{
              line: {
                label: "Speed",
                theme: {
                  light: color,
                  dark: color,
                }
              }
            }}
          >
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
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `${value}`}
                  width={40}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
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
                                {payload[0].value} {unit}
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
                  activeDot={{ r: 4 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMetricsGraph;
