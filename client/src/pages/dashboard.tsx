import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Challenge, Participation } from "@shared/schema";
import StatCard from "@/components/stat-card";
import ActivityList from "@/components/activity-list";
import ChallengeCard from "@/components/challenge-card";
import ActiveChallengeCard from "@/components/active-challenge-card";
import PerformanceChart from "@/components/performance-chart";
import StrategyRandomizer from "@/components/strategy-randomizer";
import { Trophy, CreditCard, Wallet, Bitcoin } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Get query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch upcoming challenges
  const {
    data: challenges,
    isLoading: isLoadingChallenges,
    error: challengesError,
  } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  // Fetch user's active participations
  const {
    data: participations,
    isLoading: isLoadingParticipations,
    error: participationsError,
  } = useQuery<any[]>({
    queryKey: ["/api/participations/active"],
  });

  // Fetch user's activities
  const {
    data: activities,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useQuery<any[]>({
    queryKey: ["/api/activities", { limit: 4 }],
  });

  if (isLoadingChallenges || isLoadingParticipations || isLoadingActivities) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (challengesError || participationsError || activitiesError) {
    toast({
      title: "Error",
      description: "Failed to load data. Please try again.",
      variant: "destructive",
    });
  }

  // Filter upcoming challenges
  const upcomingChallenges = challenges?.filter(
    (challenge) => challenge.status === "upcoming"
  ) || [];

  return (
    <MainLayout>
      {/* Stats Overview */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Current Balance"
          value={10230.45}
          change={2.3}
          icon="wallet"
        />
        <StatCard
          title="Challenges Joined"
          value={participations?.length || 0}
          secondaryText={`${2} Wins`}
          icon="flag"
        />
        <StatCard
          title="Total PnL"
          value={1890.21}
          changePercentage={18.9}
          icon="chart"
        />
      </div>

      {/* Recent Activity & Performance Chart */}
      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PerformanceChart data={[]} />
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-5 shadow-lg">
            <h3 className="font-semibold mb-5">Recent Activity</h3>
            <ActivityList activities={activities || []} />
          </div>

          <StrategyRandomizer />
        </div>
      </div>

      {/* Challenges Section */}
      <div className="px-6 mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">Trading Challenges</h2>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 10K Challenge */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-blue-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">$10K Challenge</h3>
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <Trophy className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Initial Balance</span>
                    <span className="font-semibold">$10,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">Phase 1: 30 Days</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href="https://buy.stripe.com/eVa9Ca1IFeYLaYgaEN" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#635BFF] to-[#504ACC] hover:from-[#504ACC] hover:to-[#635BFF] transition-all duration-300">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Credit Card
                    </Button>
                  </a>
                  <a href="https://www.paypal.com/ncp/payment/9UBJPT32WV9ZU" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#0070BA] to-[#005EA6] hover:from-[#005EA6] hover:to-[#0070BA]">
                      <Wallet className="w-4 h-4 mr-2" />
                      Pay with PayPal
                    </Button>
                  </a>
                  <a href="https://commerce.coinbase.com/checkout/2c04ee65-65af-4c08-96a2-9e6fba6517e9" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#0052FF] to-[#0040CC] hover:from-[#0040CC] hover:to-[#0052FF]">
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Pay with Crypto
                    </Button>
                  </a>
                </div>
              </div>

              {/* 25K Challenge */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">$25K Challenge</h3>
                  <div className="p-2 bg-emerald-500/10 rounded-full">
                    <Trophy className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Initial Balance</span>
                    <span className="font-semibold">$25,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">Phase 1: 30 Days</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href="https://buy.stripe.com/6oEdSq0EB7wjgiA7sC" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#635BFF] to-[#504ACC] hover:from-[#504ACC] hover:to-[#635BFF] transition-all duration-300">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Credit Card
                    </Button>
                  </a>
                  <a href="https://www.paypal.com/ncp/payment/QF396HX2XEBJL" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#0070BA] to-[#005EA6] hover:from-[#005EA6] hover:to-[#0070BA]">
                      <Wallet className="w-4 h-4 mr-2" />
                      Pay with PayPal
                    </Button>
                  </a>
                  <a href="https://commerce.coinbase.com/checkout/28b36ebf-6d2f-4a24-8705-ed7356098ab0" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#0052FF] to-[#0040CC] hover:from-[#0040CC] hover:to-[#0052FF]">
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Pay with Crypto
                    </Button>
                  </a>
                </div>
              </div>

              {/* 50K Challenge */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">$50K Challenge</h3>
                  <div className="p-2 bg-purple-500/10 rounded-full">
                    <Trophy className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Initial Balance</span>
                    <span className="font-semibold">$50,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">Phase 1: 30 Days</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href="https://buy.stripe.com/4gw5lUbjf03R3vO6oz" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#635BFF] to-[#504ACC] hover:from-[#504ACC] hover:to-[#635BFF] transition-all duration-300">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Credit Card
                    </Button>
                  </a>
                  <a href="https://www.paypal.com/ncp/payment/TC4UTAGGFCKH8" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#0070BA] to-[#005EA6] hover:from-[#005EA6] hover:to-[#0070BA]">
                      <Wallet className="w-4 h-4 mr-2" />
                      Pay with PayPal
                    </Button>
                  </a>
                  <a href="https://commerce.coinbase.com/checkout/50ce0148-0b93-4253-a526-bd0cdbb64d47" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-[#0052FF] to-[#0040CC] hover:from-[#0040CC] hover:to-[#0052FF]">
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Pay with Crypto
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming challenges at the moment.</p>
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any active challenges.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}