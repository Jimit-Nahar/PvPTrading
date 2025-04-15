import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  PieChart,
  DollarSign,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PerformanceChart from "@/components/performance-chart";

export default function TradesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user participations
  const {
    data: participations,
    isLoading: isLoadingParticipations,
    error: participationsError,
  } = useQuery<any[]>({
    queryKey: ["/api/participations"],
  });

  // Fetch all trades across all participations
  const {
    data: allTrades,
    isLoading: isLoadingTrades,
    error: tradesError,
  } = useQuery<any[]>({
    queryKey: ["/api/trades"],
  });

  if (isLoadingParticipations || isLoadingTrades) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  useEffect(() => {
    if (participationsError || tradesError) {
      toast({
        title: "Error",
        description: "Failed to load trades data. Please try again.",
        variant: "destructive",
      });
    }
  }, [participationsError, tradesError, toast]);

  // Mock data for demonstration
  const trades = [
    {
      id: 1,
      symbol: "EUR/USD",
      type: "buy",
      openPrice: "1.0932",
      closePrice: "1.0945",
      volume: "0.10",
      profit: "13.00",
      status: "closed",
      openTime: new Date(new Date().getTime() - 172800000).toISOString(), // 2 days ago
      closeTime: new Date(new Date().getTime() - 171000000).toISOString(),
      challenge: "FX Pro Challenge",
    },
    {
      id: 2,
      symbol: "BTC/USD",
      type: "sell",
      openPrice: "68532.40",
      closePrice: "68412.75",
      volume: "0.01",
      profit: "119.65",
      status: "closed",
      openTime: new Date(new Date().getTime() - 86400000).toISOString(), // 1 day ago
      closeTime: new Date(new Date().getTime() - 82800000).toISOString(),
      challenge: "Crypto Bull Run",
    },
    {
      id: 3,
      symbol: "GBP/USD",
      type: "buy",
      openPrice: "1.2513",
      closePrice: "1.2498",
      volume: "0.15",
      profit: "-22.50",
      status: "closed",
      openTime: new Date(new Date().getTime() - 36000000).toISOString(), // 10 hours ago
      closeTime: new Date(new Date().getTime() - 32400000).toISOString(),
      challenge: "FX Pro Challenge",
    },
    {
      id: 4,
      symbol: "AAPL",
      type: "buy",
      openPrice: "173.25",
      closePrice: "175.45",
      volume: "1.00",
      profit: "220.00",
      status: "closed",
      openTime: new Date(new Date().getTime() - 28800000).toISOString(), // 8 hours ago
      closeTime: new Date(new Date().getTime() - 25200000).toISOString(),
      challenge: "Blue Chip Bonanza",
    },
    {
      id: 5,
      symbol: "USD/JPY",
      type: "sell",
      openPrice: "142.35",
      closePrice: "142.29",
      volume: "0.20",
      profit: "12.00",
      status: "closed",
      openTime: new Date(new Date().getTime() - 14400000).toISOString(), // 4 hours ago
      closeTime: new Date(new Date().getTime() - 10800000).toISOString(),
      challenge: "FX Pro Challenge",
    },
    {
      id: 6,
      symbol: "XRP/USD",
      type: "buy",
      openPrice: "0.4825",
      closePrice: "0.4810",
      volume: "100.00",
      profit: "-15.00",
      status: "closed",
      openTime: new Date(new Date().getTime() - 7200000).toISOString(), // 2 hours ago
      closeTime: new Date(new Date().getTime() - 3600000).toISOString(),
      challenge: "Crypto Bull Run",
    },
    {
      id: 7,
      symbol: "ETH/USD",
      type: "buy",
      openPrice: "3142.50",
      volume: "0.05",
      status: "open",
      openTime: new Date(new Date().getTime() - 1800000).toISOString(), // 30 mins ago
      challenge: "Crypto Bull Run",
    },
    {
      id: 8,
      symbol: "AUD/USD",
      type: "sell",
      openPrice: "0.6782",
      volume: "0.20",
      status: "open",
      openTime: new Date(new Date().getTime() - 900000).toISOString(), // 15 mins ago
      challenge: "FX Pro Challenge",
    },
  ];

  // Filter trades based on tab and search
  const filterTrades = (status: string) => {
    let filtered = [...trades];
    
    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(t => t.status === status);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.symbol.toLowerCase().includes(query) || 
        t.challenge.toLowerCase().includes(query)
      );
    }
    
    // Sort trades
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.openTime).getTime() - new Date(a.openTime).getTime();
      } else if (sortBy === "profit") {
        return parseFloat(b.profit || "0") - parseFloat(a.profit || "0");
      } else if (sortBy === "symbol") {
        return a.symbol.localeCompare(b.symbol);
      }
      return 0;
    });
    
    return filtered;
  };

  const allFilteredTrades = filterTrades("all");
  const openTrades = filterTrades("open");
  const closedTrades = filterTrades("closed");

  // Calculate performance metrics
  const calculateMetrics = () => {
    const closedTradesArray = trades.filter(t => t.status === "closed");
    
    // Calculate total profit
    const totalProfit = closedTradesArray.reduce((sum, trade) => sum + parseFloat(trade.profit), 0);
    
    // Calculate win rate
    const winningTrades = closedTradesArray.filter(t => parseFloat(t.profit) > 0);
    const winRate = closedTradesArray.length > 0 
      ? (winningTrades.length / closedTradesArray.length) * 100 
      : 0;
    
    // Calculate average profit and loss
    const avgProfit = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + parseFloat(trade.profit), 0) / winningTrades.length 
      : 0;
    
    const losingTrades = closedTradesArray.filter(t => parseFloat(t.profit) < 0);
    const avgLoss = losingTrades.length > 0 
      ? losingTrades.reduce((sum, trade) => sum + parseFloat(trade.profit), 0) / losingTrades.length 
      : 0;
    
    // Calculate profit factor
    const grossProfit = winningTrades.reduce((sum, trade) => sum + parseFloat(trade.profit), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + parseFloat(trade.profit), 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    
    return {
      totalProfit,
      winRate,
      avgProfit,
      avgLoss,
      profitFactor,
      totalTrades: closedTradesArray.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
    };
  };

  const metrics = calculateMetrics();
  
  // Generate chart data
  const generateChartData = () => {
    const closedTradesArray = [...trades.filter(t => t.status === "closed")]
      .sort((a, b) => new Date(a.closeTime).getTime() - new Date(b.closeTime).getTime());
    
    let cumulativeProfit = 0;
    return closedTradesArray.map((trade, index) => {
      cumulativeProfit += parseFloat(trade.profit);
      return {
        name: new Date(trade.closeTime).toLocaleDateString(),
        value: cumulativeProfit,
        pnl: parseFloat(trade.profit),
      };
    });
  };

  const chartData = generateChartData();

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Trades</h1>
            <p className="text-muted-foreground">
              View and analyze your trading history and performance
            </p>
          </div>
        </div>
        
        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your trading performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={chartData} />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Summary</CardTitle>
                <CardDescription>Your trading statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Total P/L</span>
                    </div>
                    <span className={`font-bold ${metrics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.totalProfit >= 0 ? '+' : ''}{formatCurrency(metrics.totalProfit)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <PieChart className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Win Rate</span>
                    </div>
                    <span className="font-bold">{metrics.winRate.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm">Avg. Win</span>
                    </div>
                    <span className="font-bold text-green-500">+{formatCurrency(metrics.avgProfit)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-sm">Avg. Loss</span>
                    </div>
                    <span className="font-bold text-red-500">{formatCurrency(metrics.avgLoss)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Total Trades</span>
                    </div>
                    <span className="font-bold">{metrics.totalTrades}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Trading Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Win / Loss Ratio</span>
                      <span className="text-sm">{metrics.winningTrades} / {metrics.losingTrades}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${metrics.winRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Profit Factor</span>
                      <span className="text-sm">{metrics.profitFactor.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(metrics.profitFactor * 25, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Instrument Types</span>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span>Forex</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span>Crypto</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                        <span>Stocks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Trade History */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>View all your past and current trades</CardDescription>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search trades..." 
                    className="pl-9 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="profit">Sort by P/L</SelectItem>
                    <SelectItem value="symbol">Sort by Symbol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Trades</TabsTrigger>
                <TabsTrigger value="open">Open Positions</TabsTrigger>
                <TabsTrigger value="closed">Closed Trades</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Open Price</TableHead>
                        <TableHead>Close Price</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>P/L</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Challenge</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allFilteredTrades.length > 0 ? (
                        allFilteredTrades.map((trade) => (
                          <TableRow key={trade.id}>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge className={trade.type === "buy" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                                {trade.type === "buy" ? (
                                  <ArrowUp className="inline-block mr-1 h-3 w-3" />
                                ) : (
                                  <ArrowDown className="inline-block mr-1 h-3 w-3" />
                                )}
                                {trade.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{trade.openPrice}</TableCell>
                            <TableCell>{trade.closePrice || "-"}</TableCell>
                            <TableCell>{trade.volume}</TableCell>
                            <TableCell className={trade.profit && parseFloat(trade.profit) >= 0 ? "text-green-500 font-semibold" : trade.profit ? "text-red-500 font-semibold" : ""}>
                              {trade.profit ? `${parseFloat(trade.profit) >= 0 ? "+" : ""}${formatCurrency(parseFloat(trade.profit))}` : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${trade.status === "open" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-secondary text-muted-foreground"}`}>
                                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {getRelativeTime(new Date(trade.openTime))}
                            </TableCell>
                            <TableCell>{trade.challenge}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No trades found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="open">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Open Price</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Floating P/L</TableHead>
                        <TableHead>Open Time</TableHead>
                        <TableHead>Challenge</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {openTrades.length > 0 ? (
                        openTrades.map((trade) => (
                          <TableRow key={trade.id}>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge className={trade.type === "buy" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                                {trade.type === "buy" ? (
                                  <ArrowUp className="inline-block mr-1 h-3 w-3" />
                                ) : (
                                  <ArrowDown className="inline-block mr-1 h-3 w-3" />
                                )}
                                {trade.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{trade.openPrice}</TableCell>
                            <TableCell>{parseFloat(trade.openPrice) + (Math.random() * 0.005 * (Math.random() > 0.5 ? 1 : -1)).toFixed(4)}</TableCell>
                            <TableCell>{trade.volume}</TableCell>
                            <TableCell className={Math.random() > 0.5 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                              {Math.random() > 0.5 ? "+" : "-"}{formatCurrency(Math.random() * 50)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {getRelativeTime(new Date(trade.openTime))}
                            </TableCell>
                            <TableCell>{trade.challenge}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="destructive">Close</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No open positions
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="closed">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Open Price</TableHead>
                        <TableHead>Close Price</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>P/L</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Close Time</TableHead>
                        <TableHead>Challenge</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {closedTrades.length > 0 ? (
                        closedTrades.map((trade) => (
                          <TableRow key={trade.id}>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge className={trade.type === "buy" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                                {trade.type === "buy" ? (
                                  <ArrowUp className="inline-block mr-1 h-3 w-3" />
                                ) : (
                                  <ArrowDown className="inline-block mr-1 h-3 w-3" />
                                )}
                                {trade.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{trade.openPrice}</TableCell>
                            <TableCell>{trade.closePrice}</TableCell>
                            <TableCell>{trade.volume}</TableCell>
                            <TableCell className={parseFloat(trade.profit) >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                              {parseFloat(trade.profit) >= 0 ? "+" : ""}{formatCurrency(parseFloat(trade.profit))}
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const openTime = new Date(trade.openTime).getTime();
                                const closeTime = new Date(trade.closeTime).getTime();
                                const durationMs = closeTime - openTime;
                                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                                return `${hours}h ${minutes}m`;
                              })()}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {getRelativeTime(new Date(trade.closeTime))}
                            </TableCell>
                            <TableCell>{trade.challenge}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No closed trades
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}