import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { X, Loader2 } from "lucide-react";

interface Position {
  id: number;
  participationId: number;
  symbol: string;
  type: string;
  openPrice: string;
  volume: string;
  status: string;
  openTime: string;
}

interface OpenPositionsProps {
  positions: Position[];
  currentPrice: number;
  onClosePosition: (id: number, openPrice: number, volume: number, type: string) => void;
  isClosing: boolean;
}

export default function OpenPositions({ 
  positions, 
  currentPrice, 
  onClosePosition,
  isClosing
}: OpenPositionsProps) {
  // Calculate profit for each position
  const calculateProfit = (position: Position) => {
    const openPrice = parseFloat(position.openPrice);
    const volume = parseFloat(position.volume);
    
    // Buy positions profit when price goes up, sell positions profit when price goes down
    const priceDifference = position.type === "buy" 
      ? currentPrice - openPrice 
      : openPrice - currentPrice;
      
    // Simple calculation (in a real app, this would be more complex)
    const profit = priceDifference * volume * 10000;
    
    return profit;
  };

  return (
    <Card className="bg-card rounded-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold">Open Positions</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
          {positions.length > 0 ? (
            positions.map((position) => {
              const profit = calculateProfit(position);
              
              return (
                <div key={position.id} className="border-b border-border p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant={position.type === "buy" ? "success" : "danger"}>
                        {position.type.toUpperCase()}
                      </Badge>
                      <span className="ml-2">{position.symbol}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 h-auto py-1"
                      onClick={() => onClosePosition(
                        position.id, 
                        parseFloat(position.openPrice), 
                        parseFloat(position.volume),
                        position.type
                      )}
                      disabled={isClosing}
                    >
                      {isClosing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" /> Close
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 mt-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Open</p>
                      <p>{parseFloat(position.openPrice).toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p>{parseFloat(position.volume).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">P/L</p>
                      <p className={profit >= 0 ? "text-green-500" : "text-red-500"}>
                        {profit >= 0 ? "+" : ""}{formatCurrency(profit)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No open positions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
