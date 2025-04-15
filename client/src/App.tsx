import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import ChallengeDetails from "@/pages/challenge-details";
import TradeInterface from "@/pages/trade-interface";
import ProfilePage from "@/pages/profile-page";
import ChallengesPage from "@/pages/challenges-page";
import TradesPage from "@/pages/trades-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ReactNode } from "react";

// Create a settings page component
const SettingsPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Notifications</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input type="checkbox" id="trade-notifications" className="mr-2" defaultChecked />
                  <label htmlFor="trade-notifications">Trade updates</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="challenge-notifications" className="mr-2" defaultChecked />
                  <label htmlFor="challenge-notifications">Challenge updates</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="marketing-notifications" className="mr-2" />
                  <label htmlFor="marketing-notifications">Marketing</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Time Zone</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>CST (Central Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Interface Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chart Default Timeframe</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                <option>1 minute</option>
                <option>5 minutes</option>
                <option selected>15 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>1 day</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Default Order Size</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-background border border-border rounded-md" 
                defaultValue="0.01" 
                min="0.01" 
                step="0.01" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/challenges" component={ChallengesPage} />
      <ProtectedRoute path="/challenges/:id" component={ChallengeDetails} />
      <ProtectedRoute path="/trades" component={TradesPage} />
      <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/trade/:id" component={TradeInterface} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
