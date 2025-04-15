import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getInitials, formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's participations
  const {
    data: participations,
    isLoading: isLoadingParticipations,
    error: participationsError,
  } = useQuery<any[]>({
    queryKey: ["/api/participations"],
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: { displayName: string }) => {
      const res = await apiRequest("PATCH", `/api/user`, userData);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = () => {
    if (displayName.trim().length === 0) {
      toast({
        title: "Invalid name",
        description: "Display name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    updateUserMutation.mutate({ displayName });
  };

  if (!user) {
    return null;
  }

  // Calculate stats
  const calculateStats = () => {
    if (!participations || participations.length === 0) {
      return {
        totalChallenges: 0,
        activeChallenges: 0,
        completedChallenges: 0,
        wins: 0,
        totalPnl: 0,
      };
    }

    const activeChallenges = participations.filter(p => p.status === "active").length;
    const completedChallenges = participations.filter(p => p.status === "completed").length;
    const wins = participations.filter(p => p.position === 1).length;
    const totalPnl = participations.reduce((acc, p) => acc + parseFloat(p.pnl || "0"), 0);

    return {
      totalChallenges: participations.length,
      activeChallenges,
      completedChallenges,
      wins,
      totalPnl,
    };
  };

  const stats = calculateStats();

  return (
    <MainLayout>
      <div className="container py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {getInitials(user.displayName || user.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold">{user.displayName || user.username}</h2>
                      <p className="text-muted-foreground">Trader</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                {isEditing ? (
                  <div className="space-x-2">
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={updateUserMutation.isPending}
                    >
                      {updateUserMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Username:</span>
                  <span className="ml-2 font-medium">{user.username}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2 font-medium">{user.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Challenges Won:</span>
                  <span className="ml-2 font-medium">{stats.wins}</span>
                </div>
                <div className="flex items-center">
                  <LineChart className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Total PnL:</span>
                  <span className="ml-2 font-medium">{formatCurrency(stats.totalPnl)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Challenges</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{stats.totalChallenges}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Challenges</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{stats.activeChallenges}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Challenges</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{stats.completedChallenges}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {stats.completedChallenges > 0 
                      ? `${Math.round((stats.wins / stats.completedChallenges) * 100)}%` 
                      : "0%"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Challenge History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge History</CardTitle>
                <CardDescription>Your record of participated trading challenges</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingParticipations ? (
                  <div className="flex justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : participations && participations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-muted-foreground text-xs border-b border-border">
                          <th className="pb-3 pl-3 font-medium">Challenge</th>
                          <th className="pb-3 font-medium">Type</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Position</th>
                          <th className="pb-3 font-medium">Final Balance</th>
                          <th className="pb-3 font-medium">PnL</th>
                          <th className="pb-3 pr-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participations.map((participation) => (
                          <tr key={participation.id} className="border-b border-border">
                            <td className="py-4 pl-3 font-medium">{participation.challenge?.name || 'Unknown'}</td>
                            <td className="py-4">
                              <Badge variant={participation.challenge?.type as "forex" | "crypto" | "stocks"}>
                                {participation.challenge?.type?.charAt(0).toUpperCase() + participation.challenge?.type?.slice(1) || 'Unknown'}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <Badge variant={participation.status === "active" ? "success" : "secondary"}>
                                {participation.status.charAt(0).toUpperCase() + participation.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-4">{participation.position || '-'}</td>
                            <td className="py-4 font-semibold">{formatCurrency(parseFloat(participation.currentBalance))}</td>
                            <td className="py-4">
                              <span className={parseFloat(participation.pnl) >= 0 ? "text-green-500" : "text-red-500"}>
                                {parseFloat(participation.pnl) >= 0 ? '+' : ''}
                                {formatCurrency(parseFloat(participation.pnl))} ({parseFloat(participation.pnlPercentage).toFixed(2)}%)
                              </span>
                            </td>
                            <td className="py-4 pr-3 text-muted-foreground">
                              {new Date(participation.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You haven't participated in any challenges yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your trading milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.totalChallenges > 0 ? (
                    <>
                      <div className="p-4 border border-border rounded-lg flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Challenge Participant</h3>
                          <p className="text-sm text-muted-foreground">Participated in trading challenges</p>
                        </div>
                      </div>
                      
                      {stats.wins > 0 && (
                        <div className="p-4 border border-border rounded-lg flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Award className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Challenge Winner</h3>
                            <p className="text-sm text-muted-foreground">Won a trading challenge</p>
                          </div>
                        </div>
                      )}
                      
                      {stats.totalPnl > 1000 && (
                        <div className="p-4 border border-border rounded-lg flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Profitable Trader</h3>
                            <p className="text-sm text-muted-foreground">Achieved over $1,000 in trading profits</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-muted-foreground">Start participating in challenges to earn achievements!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="email_notifications" defaultChecked />
                    <Label htmlFor="email_notifications">Receive emails about challenge updates</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="current_password">Change Password</Label>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input id="current_password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input id="new_password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input id="confirm_password" type="password" />
                    </div>
                    <Button className="w-full md:w-auto">Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

import { Trophy, LineChart, Award, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
