import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  Wallet, 
  Trophy, 
  Users, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Challenge } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch challenges
  const {
    data: challenges,
    isLoading,
    error,
  } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load challenges. Please try again.",
      variant: "destructive",
    });
  }

  const filterChallenges = (status: string) => {
    if (!challenges) return [];
    
    let filtered = [...challenges];
    
    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(c => c.status === status);
    }
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(c => c.type === filterType);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) || 
        (c.description && c.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const allChallenges = filterChallenges("all");
  const upcomingChallenges = filterChallenges("upcoming");
  const activeChallenges = filterChallenges("active");
  const completedChallenges = filterChallenges("completed");

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "forex":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "crypto":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "stocks":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const handleViewChallenge = (id: number) => {
    navigate(`/challenges/${id}`);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trading Challenges</h1>
            <p className="text-muted-foreground">
              Browse and join trading challenges to compete with other traders
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button>Create Challenge</Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-card rounded-xl p-5 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search challenges..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Challenges</p>
                <p className="text-2xl font-bold">{challenges?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingChallenges.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                <Trophy className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active</p>
                <p className="text-2xl font-bold">{activeChallenges.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-4">
                <Wallet className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Prize Pool</p>
                <p className="text-2xl font-bold">{formatCurrency(1250000)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs and Challenge Cards */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Challenges</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allChallenges.length > 0 ? (
                allChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    <div className={`h-2 ${challenge.type === 'forex' ? 'bg-blue-500' : challenge.type === 'crypto' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <Badge className={getBadgeColor(challenge.type)}>
                          {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {challenge.status === 'upcoming' ? 'Starts in 2 days' : 
                           challenge.status === 'active' ? 'Ends in 1 day' : 
                           'Completed'}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4">{challenge.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {challenge.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Prize</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.prizeAmount))} Account</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Fee</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.entryFee))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Participants</p>
                          <p className="font-semibold">{0} / {challenge.maxParticipants}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold">3 Days</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center"
                        onClick={() => handleViewChallenge(challenge.id)}
                      >
                        View Challenge
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No challenges found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingChallenges.length > 0 ? (
                upcomingChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    <div className={`h-2 ${challenge.type === 'forex' ? 'bg-blue-500' : challenge.type === 'crypto' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <Badge className={getBadgeColor(challenge.type)}>
                          {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                        </Badge>
                        <div className="text-xs text-muted-foreground">Starts in 2 days</div>
                      </div>
                      <h3 className="text-xl font-bold mb-4">{challenge.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {challenge.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Prize</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.prizeAmount))} Account</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Fee</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.entryFee))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Participants</p>
                          <p className="font-semibold">{0} / {challenge.maxParticipants}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold">3 Days</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center"
                        onClick={() => handleViewChallenge(challenge.id)}
                      >
                        View Challenge
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No upcoming challenges found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.length > 0 ? (
                activeChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    <div className={`h-2 ${challenge.type === 'forex' ? 'bg-blue-500' : challenge.type === 'crypto' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <Badge className={getBadgeColor(challenge.type)}>
                          {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Live Now</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-4">{challenge.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {challenge.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Prize</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.prizeAmount))} Account</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Fee</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.entryFee))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Participants</p>
                          <p className="font-semibold">{0} / {challenge.maxParticipants}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Ends In</p>
                          <p className="font-semibold">1 day 12:32:10</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center"
                        onClick={() => handleViewChallenge(challenge.id)}
                      >
                        Join Challenge
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No active challenges found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedChallenges.length > 0 ? (
                completedChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    <div className={`h-2 ${challenge.type === 'forex' ? 'bg-blue-500' : challenge.type === 'crypto' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <Badge className={getBadgeColor(challenge.type)}>
                          {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="bg-secondary text-muted-foreground">Completed</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-4">{challenge.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {challenge.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Prize</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.prizeAmount))} Account</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Fee</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(challenge.entryFee))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Participants</p>
                          <p className="font-semibold">{0} / {challenge.maxParticipants}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Winner</p>
                          <p className="font-semibold">Alex T.</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center"
                        variant="secondary"
                        onClick={() => handleViewChallenge(challenge.id)}
                      >
                        View Results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No completed challenges found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}