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
import MilestoneDashboard from "@/components/milestone-dashboard";
import { TrendingUp, Target, Award, Zap, Trophy } from "lucide-react";

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

  // Sample milestone data
  const milestones = [
    {
      id: "1",
      title: "First Profit",
      description: "Make your first profitable trade",
      current: 150,
      target: 100,
      unit: "$",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: "2",
      title: "Winning Streak",
      description: "Achieve 5 profitable trades in a row",
      current: 3,
      target: 5,
      unit: "trades",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: "3",
      title: "Capital Growth",
      description: "Grow your account to $15,000",
      current: 10230.45,
      target: 15000,
      unit: "$",
      icon: <Target className="h-4 w-4" />,
      isNew: true, // This will trigger confetti
    },
    {
      id: "4",
      title: "Complete Challenge",
      description: "Successfully pass a funded challenge",
      current: 0,
      target: 1,
      unit: "challenges",
      icon: <Trophy className="h-4 w-4" />,
    },
  ];

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

      {/* Milestones Dashboard */}
      <div className="px-6 mb-6">
        <MilestoneDashboard achievements={milestones} />
      </div>

      
    </MainLayout>
  );
}