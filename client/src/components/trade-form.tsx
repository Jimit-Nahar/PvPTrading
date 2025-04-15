import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface TradeFormProps {
  symbol: string;
  currentPrice: number;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function TradeForm({ 
  symbol, 
  currentPrice, 
  onSubmit,
  isLoading 
}: TradeFormProps) {
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [volume, setVolume] = useState<number>(0.10);
  const [stopLoss, setStopLoss] = useState<number>(
    type === "buy" 
      ? parseFloat((currentPrice - 0.0030).toFixed(4)) 
      : parseFloat((currentPrice + 0.0030).toFixed(4))
  );
  const [takeProfit, setTakeProfit] = useState<number>(
    type === "buy" 
      ? parseFloat((currentPrice + 0.0030).toFixed(4)) 
      : parseFloat((currentPrice - 0.0030).toFixed(4))
  );

  // Update stop loss and take profit when type changes
  const handleTypeChange = (newType: "buy" | "sell") => {
    setType(newType);
    
    if (newType === "buy") {
      setStopLoss(parseFloat((currentPrice - 0.0030).toFixed(4)));
      setTakeProfit(parseFloat((currentPrice + 0.0030).toFixed(4)));
    } else {
      setStopLoss(parseFloat((currentPrice + 0.0030).toFixed(4)));
      setTakeProfit(parseFloat((currentPrice - 0.0030).toFixed(4)));
    }
  };

  // Calculate potential profit/loss
  const calculatePotential = () => {
    const pips = type === "buy" 
      ? Math.abs(takeProfit - currentPrice) * 10000
      : Math.abs(currentPrice - takeProfit) * 10000;
    
    const risk = type === "buy"
      ? Math.abs(currentPrice - stopLoss) * 10000
      : Math.abs(stopLoss - currentPrice) * 10000;
    
    // Simple calculation (would be more complex in real trading)
    const potentialReward = pips * volume * 10;
    const potentialRisk = risk * volume * 10;
    
    return {
      reward: potentialReward,
      risk: potentialRisk
    };
  };

  const potential = calculatePotential();

  const handleSubmit = () => {
    onSubmit({
      symbol,
      type,
      volume,
      stopLoss,
      takeProfit,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-secondary">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-semibold">Open Position</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button
              variant={type === "buy" ? "default" : "outline"}
              onClick={() => handleTypeChange("buy")}
              className={type === "buy" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              BUY
            </Button>
            <Button
              variant={type === "sell" ? "default" : "outline"}
              onClick={() => handleTypeChange("sell")}
              className={type === "sell" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              SELL
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1">Volume</Label>
              <Input
                type="number"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                min={0.01}
                max={10}
                step={0.01}
                className="w-full bg-background text-right"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Stop Loss</Label>
                <Input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                  step={0.0001}
                  className="w-full bg-background text-right"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Take Profit</Label>
                <Input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
                  step={0.0001}
                  className="w-full bg-background text-right"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-semibold">Order Summary</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Symbol</span>
              <span>{symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>Market Execution</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume</span>
              <span>{volume.toFixed(2)} lots</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Price</span>
              <span className={type === "buy" ? "text-green-500" : "text-red-500"}>{currentPrice.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stop Loss</span>
              <span>
                {stopLoss.toFixed(4)} ({Math.abs(Math.round((currentPrice - stopLoss) * 10000))} pips)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Take Profit</span>
              <span>
                {takeProfit.toFixed(4)} ({Math.abs(Math.round((takeProfit - currentPrice) * 10000))} pips)
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-muted-foreground">Potential Risk</span>
              <span className="text-red-500">-{formatCurrency(potential.risk)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Potential Reward</span>
              <span className="text-green-500">+{formatCurrency(potential.reward)}</span>
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `${type === "buy" ? "Buy" : "Sell"} ${symbol} at Market`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
