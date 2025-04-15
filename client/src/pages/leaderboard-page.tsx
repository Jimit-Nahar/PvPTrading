import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, formatCurrency, formatPercentage } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Search,
  Trophy,
  Medal,
  Users,
  Filter,
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Calendar,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardItem {
  position: number;
  participationId: number;
  userId: number;
  username: string;
  displayName: string;
  currentBalance: string;
  pnl: string;
  pnlPercentage: string;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("global");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("position");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [timeFilter, setTimeFilter] = useState("all-time");
  const [typeFilter, setTypeFilter] = useState("all");
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch global leaderboard
  const {
    data: globalLeaderboard,
    isLoading: isLoadingGlobal,
    error: globalError,
  } = useQuery<LeaderboardItem[]>({
    queryKey: ["/api/leaderboard/global"],
  });
  
  // Handle error notifications if needed
  useEffect(() => {
    if (globalError) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [globalError, toast]);

  // Mock data for global leaderboard
  const mockGlobalLeaderboard: LeaderboardItem[] = [
    {
      position: 1,
      participationId: 101,
      userId: 201,
      username: "alexmaster",
      displayName: "Alex Thompson",
      currentBalance: "15284.35",
      pnl: "5284.35",
      pnlPercentage: "52.84",
    },
    {
      position: 2,
      participationId: 102,
      userId: 202,
      username: "sarahfx",
      displayName: "Sarah Johnson",
      currentBalance: "14327.80",
      pnl: "4327.80",
      pnlPercentage: "43.28",
    },
    {
      position: 3,
      participationId: 103,
      userId: 203,
      username: "miketrader",
      displayName: "Mike Wilson",
      currentBalance: "13940.15",
      pnl: "3940.15",
      pnlPercentage: "39.40",
    },
    {
      position: 4,
      participationId: 104,
      userId: 204,
      username: "traderjane",
      displayName: "Jane Miller",
      currentBalance: "13587.64",
      pnl: "3587.64",
      pnlPercentage: "35.88",
    },
    {
      position: 5,
      participationId: 105,
      userId: 205,
      username: "cryptoking",
      displayName: "Robert Chen",
      currentBalance: "13294.50",
      pnl: "3294.50",
      pnlPercentage: "32.95",
    },
    {
      position: 6,
      participationId: 106,
      userId: 206,
      username: "forexqueen",
      displayName: "Lisa Wang",
      currentBalance: "12974.22",
      pnl: "2974.22",
      pnlPercentage: "29.74",
    },
    {
      position: 7,
      participationId: 107,
      userId: 207,
      username: "tradermax",
      displayName: "Max Johnson",
      currentBalance: "12827.65",
      pnl: "2827.65",
      pnlPercentage: "28.28",
    },
    {
      position: 8,
      participationId: 108,
      userId: 208,
      username: "investqueen",
      displayName: "Emma Davis",
      currentBalance: "12628.40",
      pnl: "2628.40",
      pnlPercentage: "26.28",
    },
    {
      position: 9,
      participationId: 109,
      userId: 209,
      username: "daytraderpro",
      displayName: "David Smith",
      currentBalance: "12415.75",
      pnl: "2415.75",
      pnlPercentage: "24.16",
    },
    {
      position: 10,
      participationId: 110,
      userId: 210,
      username: "swingtrader",
      displayName: "Sofia Rodriguez",
      currentBalance: "12284.10",
      pnl: "2284.10",
      pnlPercentage: "22.84",
    },
    {
      position: 11,
      participationId: 111,
      userId: 211,
      username: "fxmaster",
      displayName: "Jack Williams",
      currentBalance: "12153.25",
      pnl: "2153.25",
      pnlPercentage: "21.53",
    },
    {
      position: 12,
      participationId: 112,
      userId: 212,
      username: "tradingpro",
      displayName: "Olivia Brown",
      currentBalance: "11975.60",
      pnl: "1975.60",
      pnlPercentage: "19.76",
    },
  ];

  // Mock data for challenge leaderboards
  const mockChallengeLeaderboards = {
    "fx-pro": mockGlobalLeaderboard.slice(0, 8).map((item, idx) => ({
      ...item,
      position: idx + 1,
      currentBalance: (15000 - idx * 500).toFixed(2),
      pnl: (5000 - idx * 500).toFixed(2),
      pnlPercentage: (50 - idx * 5).toFixed(2),
    })),
    "crypto-bull": mockGlobalLeaderboard.slice(3, 10).map((item, idx) => ({
      ...item,
      position: idx + 1,
      currentBalance: (14000 - idx * 400).toFixed(2),
      pnl: (4000 - idx * 400).toFixed(2),
      pnlPercentage: (40 - idx * 4).toFixed(2),
    })),
    "blue-chip": mockGlobalLeaderboard.slice(5, 12).map((item, idx) => ({
      ...item,
      position: idx + 1,
      currentBalance: (13000 - idx * 300).toFixed(2),
      pnl: (3000 - idx * 300).toFixed(2),
      pnlPercentage: (30 - idx * 3).toFixed(2),
    })),
  };

  if (isLoadingGlobal) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  useEffect(() => {
    if (globalError) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [globalError, toast]);

  // Filter and sort leaderboard data
  const filterAndSortLeaderboard = (leaderboard: LeaderboardItem[]) => {
    if (!leaderboard) return [];
    
    let filtered = [...leaderboard];
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.username.toLowerCase().includes(query) || 
        item.displayName.toLowerCase().includes(query)
      );
    }
    
    // Sort by selected field
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "position") {
        comparison = a.position - b.position;
      } else if (sortBy === "name") {
        comparison = a.displayName.localeCompare(b.displayName);
      } else if (sortBy === "balance") {
        comparison = parseFloat(b.currentBalance) - parseFloat(a.currentBalance);
      } else if (sortBy === "pnl") {
        comparison = parseFloat(b.pnlPercentage) - parseFloat(a.pnlPercentage);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const filteredGlobalLeaderboard = filterAndSortLeaderboard(mockGlobalLeaderboard);
  const filteredFxProLeaderboard = filterAndSortLeaderboard(mockChallengeLeaderboards["fx-pro"]);
  const filteredCryptoBullLeaderboard = filterAndSortLeaderboard(mockChallengeLeaderboards["crypto-bull"]);
  const filteredBlueChipLeaderboard = filterAndSortLeaderboard(mockChallengeLeaderboards["blue-chip"]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  // Format the trader type
  const getTraderType = (position: number) => {
    if (position === 1) return "Veteran Trader";
    if (position === 2) return "Pro Trader";
    if (position === 3) return "Day Trader";
    if (position <= 10) return "Swing Trader";
    return "Trader";
  };

  // Get user's position
  const getUserPosition = (leaderboard: LeaderboardItem[]) => {
    if (!user) return null;
    
    const userEntry = leaderboard.find(item => item.userId === user.id);
    if (!userEntry) return null;
    
    return {
      ...userEntry,
      position: userEntry.position
    };
  };

  const renderLeaderboardTable = (leaderboard: LeaderboardItem[], showRank = true) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-muted-foreground text-xs border-b border-border">
              {showRank && (
                <th 
                  className="pb-3 pl-3 font-medium cursor-pointer" 
                  onClick={() => { setSortBy("position"); toggleSortDirection(); }}
                >
                  <div className="flex items-center">
                    Rank
                    {sortBy === "position" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
              )}
              <th 
                className="pb-3 font-medium cursor-pointer"
                onClick={() => { setSortBy("name"); toggleSortDirection(); }}
              >
                <div className="flex items-center">
                  Trader
                  {sortBy === "name" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer"
                onClick={() => { setSortBy("balance"); toggleSortDirection(); }}
              >
                <div className="flex items-center">
                  Current Balance
                  {sortBy === "balance" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer"
                onClick={() => { setSortBy("pnl"); toggleSortDirection(); }}
              >
                <div className="flex items-center">
                  PnL
                  {sortBy === "pnl" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="pb-3 font-medium">Change (24h)</th>
              <th className="pb-3 pr-3 font-medium">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((trader) => {
                const isCurrentUser = user && trader.userId === user.id;
                const pnlValue = parseFloat(trader.pnl);
                const pnlPercentage = parseFloat(trader.pnlPercentage);
                
                return (
                  <tr 
                    key={trader.participationId} 
                    className={`border-b border-border transition duration-150 hover:bg-secondary/40 ${isCurrentUser ? "bg-primary/10" : ""}`}
                  >
                    {showRank && (
                      <td className="py-4 pl-3">
                        {trader.position <= 3 ? (
                          <div className="flex items-center">
                            <div 
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold
                                ${trader.position === 1 ? 'bg-yellow-500' : trader.position === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}
                            >
                              {trader.position === 1 ? <Trophy className="h-3 w-3" /> : 
                               trader.position === 2 ? <Medal className="h-3 w-3" /> : 
                               trader.position === 3 ? <Medal className="h-3 w-3" /> : trader.position}
                            </div>
                            {isCurrentUser && (
                              <Badge className="ml-2 bg-primary/20 text-primary border-primary/40">You</Badge>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-muted-foreground text-xs font-bold">
                              {trader.position}
                            </div>
                            {isCurrentUser && (
                              <Badge className="ml-2 bg-primary/20 text-primary border-primary/40">You</Badge>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                    <td className="py-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className={`${
                            trader.position === 1 ? 'bg-yellow-500' : 
                            trader.position === 2 ? 'bg-gray-400' : 
                            trader.position === 3 ? 'bg-amber-700' : 
                            'bg-primary/70'
                          } text-white text-xs font-bold`}>
                            {getInitials(trader.displayName || trader.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{trader.displayName || trader.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {getTraderType(trader.position)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold">{formatCurrency(parseFloat(trader.currentBalance))}</td>
                    <td className="py-4">
                      <span className={pnlValue >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                        {formatPercentage(pnlPercentage)}
                      </span>
                    </td>
                    <td className="py-4">
                      {/* This would come from real data, but for now we'll generate a random change */}
                      <span className={Math.random() > 0.3 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
                        {Math.random() > 0.3 ? (
                          <>
                            <TrendingUp className="mr-1 h-4 w-4" /> {(Math.random() * 3).toFixed(2)}%
                          </>
                        ) : (
                          <>
                            <TrendingDown className="mr-1 h-4 w-4" /> {(Math.random() * 2).toFixed(2)}%
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 pr-3 font-semibold">{Math.floor(40 + Math.random() * 50)}%</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={showRank ? 6 : 5} className="py-8 text-center text-muted-foreground">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // User position highlight
  const userPosition = getUserPosition(mockGlobalLeaderboard);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">
              See how you rank against other traders in real-time
            </p>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Top Trader PnL</p>
                  <p className="text-2xl font-bold text-yellow-500">+52.84%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Active Traders</p>
                  <p className="text-2xl font-bold">5,241</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Active Challenges</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Next Update</p>
                  <p className="text-2xl font-bold">4 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* User's Position */}
        {userPosition && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader className="pb-0">
              <CardTitle>Your Position</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-primary text-white font-bold">
                      {user ? getInitials(user.displayName || user.username) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-xl font-bold mr-2">{user?.displayName || user?.username}</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/40">
                        Rank #{userPosition.position}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{getTraderType(userPosition.position)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-bold text-lg">{formatCurrency(parseFloat(userPosition.currentBalance))}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">PnL</p>
                    <p className={`font-bold text-lg ${parseFloat(userPosition.pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(parseFloat(userPosition.pnlPercentage))}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Trades</p>
                    <p className="font-bold text-lg">32</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search traders..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Time Period" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Filter Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="forex">Forex Only</SelectItem>
                    <SelectItem value="crypto">Crypto Only</SelectItem>
                    <SelectItem value="stocks">Stocks Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Leaderboards */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="fx-pro">FX Pro Challenge</TabsTrigger>
            <TabsTrigger value="crypto-bull">Crypto Bull Run</TabsTrigger>
            <TabsTrigger value="blue-chip">Blue Chip Bonanza</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                {renderLeaderboardTable(filteredGlobalLeaderboard)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fx-pro">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>FX Pro Challenge</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">Ends in 1 day 12 hours</p>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Forex</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderLeaderboardTable(filteredFxProLeaderboard)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="crypto-bull">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Crypto Bull Run</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">Ends in 2 days 5 hours</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Crypto</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderLeaderboardTable(filteredCryptoBullLeaderboard)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blue-chip">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Blue Chip Bonanza</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">Ends in 3 days 8 hours</p>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Stocks</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderLeaderboardTable(filteredBlueChipLeaderboard)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}