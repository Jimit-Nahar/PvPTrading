import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface ChartData {
  name: string;
  value: number;
  pnl: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md shadow-md p-2">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-primary text-sm">{formatCurrency(payload[0].value as number)}</p>
        <p className={`text-sm ${(payload[0].payload.pnl >= 0 ? 'text-green-500' : 'text-red-500')}`}>
          {formatPercentage(payload[0].payload.pnl)}
        </p>
      </div>
    );
  }

  return null;
};

export default function PerformanceChart({ data, isLoading = false }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState('1D');

  // Sample data for demonstration
  const demoData = [
    { name: '04:00', value: 10000, pnl: 0 },
    { name: '08:00', value: 10120, pnl: 1.2 },
    { name: '12:00', value: 10050, pnl: 0.5 },
    { name: '16:00', value: 10320, pnl: 3.2 },
    { name: '20:00', value: 10450, pnl: 4.5 },
    { name: '00:00', value: 10380, pnl: 3.8 },
  ];

  const chartData = data?.length > 0 ? data : demoData;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Performance Overview</CardTitle>
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
            <TabsList className="h-8">
              <TabsTrigger value="1D" className="text-xs px-3">1D</TabsTrigger>
              <TabsTrigger value="ALL" className="text-xs px-3">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-secondary/30 rounded-md" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  stroke="#A0AEC0"
                  fontSize={12}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  stroke="#A0AEC0"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toLocaleString()}`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#171923", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
