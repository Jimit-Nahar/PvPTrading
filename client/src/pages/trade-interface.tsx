import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import TradeChart from "@/components/trade-chart";
import MarketWatch from "@/components/market-watch";
import OpenPositions from "@/components/open-positions";
import TradeHistory from "@/components/trade-history";
import TradeForm from "@/components/trade-form";
import { formatCurrency } from "@/lib/utils";

export default function TradeInterface() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const challengeId = parseInt(id);
  const [selectedSymbol, setSelectedSymbol] = useState("EUR/USD");
  const [currentPrice, setCurrentPrice] = useState(1.0932);
  const [priceChange, setPriceChange] = useState(0.0008);

  // Fetch challenge details
  const {
    data: challenge,
    isLoading: isLoadingChallenge,
    error: challengeError,
  } = useQuery<any>({
    queryKey: [`/api/challenges/${challengeId}`],
  });

  // Fetch user's participation
  const {
    data: participations,
    isLoading: isLoadingParticipation,
    error: participationError,
  } = useQuery<any[]>({
    queryKey: ["/api/participations"],
  });

  // Get user's participation in this challenge
  const userParticipation = participations?.find(
    (p) => p.challengeId === challengeId
  );

  // Fetch user's trades for this challenge
  const {
    data: trades,
    isLoading: isLoadingTrades,
    error: tradesError,
  } = useQuery<any[]>({
    queryKey: userParticipation ? [`/api/participations/${userParticipation.id}/trades`] : null,
    enabled: !!userParticipation,
  });

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!challenge) return "00:00:00";
    
    const endTime = new Date(challenge.endTime);
    const now = new Date();
    const timeRemaining = Math.max(0, endTime.getTime() - now.getTime());
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    return `${String(Math.floor(hoursRemaining / 24)).padStart(2, '0')}:${String(hoursRemaining % 24).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}`;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  // Update time remaining every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge]);

  // Simulate price updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Random price change between -0.0005 and 0.0005
      const change = (Math.random() - 0.5) * 0.001;
      setCurrentPrice((prev) => parseFloat((prev + change).toFixed(4)));
      setPriceChange((prev) => parseFloat((prev + change).toFixed(4)));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Create trade mutation
  const createTradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      const res = await fetch(`/api/participations/${userParticipation?.id}/trades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeData),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create trade");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/participations/${userParticipation?.id}/trades`] });
      toast({
        title: "Trade opened",
        description: "Your trade has been successfully opened",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Trade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Close trade mutation
  const closeTradeMutation = useMutation({
    mutationFn: async ({ tradeId, closePrice, profit }: { tradeId: number, closePrice: number, profit: number }) => {
      const res = await fetch(`/api/trades/${tradeId}/close`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ closePrice, profit }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to close trade");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/participations/${userParticipation?.id}/trades`] });
      queryClient.invalidateQueries({ queryKey: [`/api/challenges/${challengeId}/leaderboard`] });
      toast({
        title: "Trade closed",
        description: "Your trade has been successfully closed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to close trade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle opening new trade
  const handleOpenTrade = (tradeData: any) => {
    createTradeMutation.mutate({
      ...tradeData,
      symbol: selectedSymbol,
      openPrice: currentPrice,
    });
  };

  // Handle closing a trade
  const handleCloseTrade = (tradeId: number, openPrice: number, volume: number, type: string) => {
    // Calculate profit/loss
    const priceDifference = type === "buy" 
      ? currentPrice - openPrice 
      : openPrice - currentPrice;
    
    // Simple profit calculation (in real-world this would be more complex)
    const profit = priceDifference * volume * 10000;
    
    closeTradeMutation.mutate({
      tradeId,
      closePrice: currentPrice,
      profit,
    });
  };

  const isLoading = 
    isLoadingChallenge || 
    isLoadingParticipation || 
    (userParticipation && isLoadingTrades);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!challenge || !userParticipation) {
    // Redirect to challenge details page if not participating
    navigate(`/challenges/${challengeId}`);
    return null;
  }

  // Filter open and closed trades
  const openTrades = trades?.filter(trade => trade.status === "open") || [];
  const closedTrades = trades?.filter(trade => trade.status === "closed") || [];

  // For the market watch, we'll use some dummy symbols with simulated prices
  const marketSymbols = [
    { symbol: "EUR/USD", price: 1.0932, change: 0.0008 },
    { symbol: "GBP/USD", price: 1.2487, change: -0.0012 },
    { symbol: "USD/JPY", price: 142.35, change: 0.25 },
    { symbol: "AUD/USD", price: 0.6785, change: 0.0015 },
    { symbol: "USD/CAD", price: 1.3245, change: -0.0008 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/challenges/${challengeId}`)}
            className="mr-4 text-muted-foreground"
          >
            <ArrowLeft size={18} />
          </Button>
          <h2 className="text-lg font-bold">Trading Terminal - {challenge.name}</h2>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="font-semibold">
              {formatCurrency(parseFloat(userParticipation.currentBalance))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Position</p>
            <p className="font-semibold">
              {userParticipation.position || "-"}{" "}
              {userParticipation.position && `/ ${challenge.participantsCount}`}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Time Left</p>
            <p className="font-semibold">{timeRemaining}</p>
          </div>
        </div>
      </div>
      
      {/* Trading Layout */}
      <div className="flex-1 grid grid-cols-12 gap-1 p-1">
        {/* Chart Area */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-lg">
          <TradeChart 
            symbol={selectedSymbol}
            currentPrice={currentPrice}
            priceChange={priceChange}
          />
          
          {/* Trading Controls */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TradeForm 
              symbol={selectedSymbol}
              currentPrice={currentPrice}
              onSubmit={handleOpenTrade}
              isLoading={createTradeMutation.isPending}
            />
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-1">
          {/* Market Watch */}
          <MarketWatch 
            symbols={marketSymbols}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
          />
          
          {/* Open Positions */}
          <OpenPositions 
            positions={openTrades}
            currentPrice={currentPrice}
            onClosePosition={handleCloseTrade}
            isClosing={closeTradeMutation.isPending}
          />
          
          {/* Trade History */}
          <TradeHistory trades={closedTrades} />
        </div>
      </div>
    </div>
  );
}
