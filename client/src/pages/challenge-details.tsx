import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Loader2, ArrowLeft, History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/main-layout";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Challenge, Participation } from "@shared/schema";
import Leaderboard from "@/components/leaderboard";
import PerformanceChart from "@/components/performance-chart";

export default function ChallengeDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const challengeId = parseInt(id);

  // Fetch challenge details
  const {
    data: challenge,
    isLoading: isLoadingChallenge,
    error: challengeError,
  } = useQuery<any>({
    queryKey: [`/api/challenges/${challengeId}`],
  });

  // Fetch leaderboard
  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = useQuery<any[]>({
    queryKey: [`/api/challenges/${challengeId}/leaderboard`],
    refetchInterval: 10000, // Refresh every 10 seconds
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

  const isLoading =
    isLoadingChallenge ||
    isLoadingLeaderboard ||
    isLoadingParticipation ||
    (userParticipation && isLoadingTrades);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (challengeError || leaderboardError || participationError || tradesError) {
    toast({
      title: "Error",
      description: "Failed to load challenge data. Please try again.",
      variant: "destructive",
    });
    return (
      <MainLayout>
        <div className="p-6">
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          <div className="mt-4 text-center">
            <p className="text-destructive">Failed to load challenge data.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!challenge) {
    return (
      <MainLayout>
        <div className="p-6">
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          <div className="mt-4 text-center">
            <p>Challenge not found.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Calculate time remaining
  const endTime = new Date(challenge.endTime);
  const now = new Date();
  const timeRemaining = Math.max(0, endTime.getTime() - now.getTime());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  const timeRemainingString = `${String(Math.floor(hoursRemaining / 24)).padStart(2, '0')}:${String(hoursRemaining % 24).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}`;

  return (
    <MainLayout>
      {/* Challenge Header */}
      <div className="bg-card border-b border-border">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                  className="mr-3 text-muted-foreground"
                >
                  <ArrowLeft size={18} />
                </Button>
                <h1 className="text-2xl font-bold">{challenge.name}</h1>
              </div>
              <p className="text-muted-foreground mt-1">{challenge.description}</p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Time Left</p>
                <p className="font-semibold">{timeRemainingString}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="font-semibold">{challenge.participantsCount || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Prize</p>
                <p className="font-semibold">
                  {formatCurrency(parseFloat(challenge.prizeAmount))} Account
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
            <Button
              onClick={() => navigate(`/trade/${challengeId}`)}
              className="flex items-center justify-center"
            >
              <LineChart className="mr-2 h-4 w-4" />
              Start Trading
            </Button>
            <Button
              variant="secondary"
              className="flex items-center justify-center"
            >
              <History className="mr-2 h-4 w-4" />
              My Trade History
            </Button>
            <Button
              variant="secondary"
              className="flex items-center justify-center"
            >
              <Info className="mr-2 h-4 w-4" />
              Challenge Rules
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Stats */}
        <div className="col-span-1">
          {userParticipation ? (
            <>
              <div className="bg-card rounded-xl shadow-lg p-5 mb-6">
                <h3 className="font-semibold mb-4">Your Account</h3>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {formatCurrency(parseFloat(userParticipation.currentBalance))}
                    </span>
                    <span className="ml-2 text-xs text-green-500">
                      +{formatCurrency(parseFloat(userParticipation.pnl))}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">PnL</p>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-green-500">
                      +{parseFloat(userParticipation.pnlPercentage).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, parseFloat(userParticipation.pnlPercentage) * 10))}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="font-bold text-lg">
                      {userParticipation.position || "-"}{" "}
                      {userParticipation.position && (
                        <span className="text-muted-foreground text-sm font-normal">
                          of {challenge.participantsCount}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trades Made</p>
                    <p className="font-bold text-lg">{trades?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="font-bold text-lg">
                      {trades && trades.length > 0
                        ? `${Math.round(
                            (trades.filter((t) => parseFloat(t.profit) > 0).length /
                              trades.length) *
                              100
                          )}%`
                        : "0%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Profit</p>
                    <p className="font-bold text-lg text-green-500">
                      {trades && trades.length > 0
                        ? formatCurrency(
                            trades
                              .filter((t) => t.profit)
                              .reduce((acc, t) => acc + parseFloat(t.profit), 0) /
                              trades.filter((t) => t.profit).length
                          )
                        : "$0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-lg p-5">
                <h3 className="font-semibold mb-4">Recent Trades</h3>

                <div className="space-y-4 custom-scrollbar" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {trades && trades.length > 0 ? (
                    trades
                      .filter((trade) => trade.status === "closed")
                      .slice(0, 4)
                      .map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between py-2 border-b border-border">
                          <div>
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full ${trade.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"} flex items-center justify-center mr-3`}>
                                {trade.type === "buy" ? (
                                  <ArrowUp className="text-green-500 h-4 w-4" />
                                ) : (
                                  <ArrowDown className="text-red-500 h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{trade.symbol}</p>
                                <p className="text-xs text-muted-foreground">
                                  {trade.type === "buy" ? "Buy" : "Sell"} @ {parseFloat(trade.openPrice).toFixed(4)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${parseFloat(trade.profit) >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {parseFloat(trade.profit) >= 0 ? "+" : ""}
                              {formatCurrency(parseFloat(trade.profit))}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(trade.closeTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No trades yet</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl shadow-lg p-5 mb-6">
              <h3 className="font-semibold mb-4">Join This Challenge</h3>
              <p className="text-muted-foreground mb-4">
                You haven't joined this challenge yet. Join now to start trading and compete for the prize!
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  // Simulate click on "Join Challenge" button
                  const challengeCard = document.querySelector(`[data-challenge-id="${challengeId}"]`);
                  const joinButton = challengeCard?.querySelector("button");
                  if (joinButton) {
                    joinButton.click();
                  } else {
                    // Fallback if we can't find the button
                    toast({
                      title: "Join Challenge",
                      description: "Please join this challenge from the dashboard",
                    });
                    navigate("/dashboard");
                  }
                }}
              >
                Join Challenge
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-card rounded-xl shadow-lg p-5 mb-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold">Live Leaderboard</h3>
              <div className="text-xs text-muted-foreground">
                <RefreshCw className="inline-block mr-1 h-3 w-3" /> Updates every 10 seconds
              </div>
            </div>

            <Leaderboard
              leaderboard={leaderboard || []}
              currentUserId={userParticipation?.userId}
            />
          </div>

          {/* Performance Overview */}
          <PerformanceChart data={[]} />
        </div>
      </div>
    </MainLayout>
  );
}

import { LineChart, RefreshCw } from "lucide-react";
