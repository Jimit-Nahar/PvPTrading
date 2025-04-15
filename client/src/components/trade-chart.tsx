import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface TradeChartProps {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md shadow-md p-2">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-primary text-sm">{payload[0].value?.toFixed(4)}</p>
      </div>
    );
  }

  return null;
};

export default function TradeChart({ 
  symbol,
  currentPrice,
  priceChange,
  isLoading = false
}: TradeChartProps) {
  const [timeframe, setTimeframe] = useState('1H');

  // Sample data for demonstration
  const generateSampleData = () => {
    const data = [];
    const basePrice = currentPrice - (priceChange / 2);
    const volatility = 0.0005;

    for (let i = 0; i < 100; i++) {
      const time = new Date();
      time.setMinutes(time.getMinutes() - (100 - i) * 15);
      
      const random = Math.random() * 2 - 1;
      const price = basePrice + (i * (priceChange / 100)) + (random * volatility * basePrice);
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        price: parseFloat(price.toFixed(5))
      });
    }
    
    return data;
  };

  const chartData = generateSampleData();

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-4 py-4 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <CardTitle className="font-bold">{symbol}</CardTitle>
          <div className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
            {currentPrice.toFixed(4)} 
            <span className="text-xs ml-1">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {['1H', '4H', '1D', '1W'].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "secondary"}
              className="px-3 py-1 h-auto text-xs"
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-secondary/30 rounded-md" />
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
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
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  stroke="#A0AEC0"
                  fontSize={12}
                />
                <YAxis 
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  axisLine={false}
                  tickLine={false}
                  stroke="#A0AEC0"
                  fontSize={12}
                  tickFormatter={(value) => value.toFixed(4)} 
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={priceChange >= 0 ? "#10B981" : "#EF4444"}
                  fill={priceChange >= 0 ? "url(#positiveGradient)" : "url(#negativeGradient)"}
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
