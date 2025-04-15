import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getRelativeTime } from "@/lib/utils";

interface Trade {
  id: number;
  participationId: number;
  symbol: string;
  type: string;
  openPrice: string;
  closePrice: string;
  volume: string;
  profit: string;
  status: string;
  openTime: string;
  closeTime: string;
}

interface TradeHistoryProps {
  trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <Card className="bg-card rounded-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold">Trade History</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
          {trades.length > 0 ? (
            trades.map((trade) => {
              const profit = parseFloat(trade.profit);
              
              return (
                <div key={trade.id} className="border-b border-border p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant={trade.type === "buy" ? "success" : "danger"}>
                        {trade.type.toUpperCase()}
                      </Badge>
                      <span className="ml-2">{trade.symbol}</span>
                    </div>
                    <span className={profit >= 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                      {profit >= 0 ? "+" : ""}{formatCurrency(profit)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Closed {getRelativeTime(new Date(trade.closeTime))}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No trade history
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
