import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MarketSymbol {
  symbol: string;
  price: number;
  change: number;
}

interface MarketWatchProps {
  symbols: MarketSymbol[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export default function MarketWatch({ 
  symbols, 
  selectedSymbol, 
  onSelectSymbol 
}: MarketWatchProps) {
  return (
    <Card className="bg-card rounded-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold">Market Watch</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-0.5 max-h-[200px] overflow-y-auto custom-scrollbar">
          {symbols.map((symbol) => (
            <div 
              key={symbol.symbol}
              className={`flex justify-between items-center p-2 rounded cursor-pointer
                ${selectedSymbol === symbol.symbol ? 'bg-secondary' : 'hover:bg-secondary'}`}
              onClick={() => onSelectSymbol(symbol.symbol)}
            >
              <span>{symbol.symbol}</span>
              <span className={symbol.change >= 0 ? "text-green-500" : "text-red-500"}>
                {symbol.price.toFixed(4)} 
                {symbol.change >= 0 ? (
                  <ArrowUp className="inline-block ml-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="inline-block ml-1 h-3 w-3" />
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
