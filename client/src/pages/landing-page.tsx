import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, ChartLine, ShieldX, CheckCircle, Wallet, Globe, BarChart, Clock, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to dashboard if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-background to-primary/5 py-20">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]"></div>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-left lg:pr-10">
            <Badge variant="outline" className="mb-6 py-1 px-4 bg-primary/10 border-primary/20 text-primary">
              Trading Competitions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
              PvP.trading
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              Compete in real-time trading challenges to win funded accounts worth up to <span className="text-primary font-semibold">$250,000</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={() => setIsLoginModalOpen(true)} 
                className="bg-primary hover:bg-opacity-90 text-white px-8 py-6 rounded-lg font-semibold transition duration-200 shadow-lg"
                size="lg"
              >
                Start Trading Now
              </Button>
              <Button 
                onClick={() => setIsSignupModalOpen(true)} 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:bg-opacity-10 px-8 py-6 rounded-lg font-semibold transition duration-200"
                size="lg"
              >
                View Challenges
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="text-primary mr-2 h-5 w-5" />
                <span>3-Day Challenges</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-primary mr-2 h-5 w-5" />
                <span>$10,000 Demo Account</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-primary mr-2 h-5 w-5" />
                <span>Real-time Trading</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
            <div className="relative bg-card rounded-xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Live Challenge</h3>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Live Now</Badge>
                </div>
                
                <div className="mb-4">
                  <p className="text-muted-foreground text-sm mb-1">Prize Pool</p>
                  <p className="text-3xl font-bold text-primary">$100,000</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="font-semibold">128</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time Left</p>
                    <p className="font-semibold">32:14:56</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Entry</p>
                    <p className="font-semibold">$25</p>
                  </div>
                </div>
                
                <Button className="w-full">Join Challenge</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 py-1 px-4 bg-primary/10 border-primary/20 text-primary">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trade. Compete. Win Funded Accounts.</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            PvP.trading offers a competitive environment where traders can showcase their skills and win real funded trading accounts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:border-primary/50 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-6">
              <Trophy className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Compete Live</h3>
            <p className="text-muted-foreground mb-4">Challenge other traders in real-time 3-day competitions with $10,000 demo accounts</p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Real market conditions</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Live leaderboard rankings</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Multiple challenge categories</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:border-primary/50 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-6">
              <ChartLine className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Win Funded Accounts</h3>
            <p className="text-muted-foreground mb-4">Top performers receive funded trading accounts to trade with real capital</p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Up to $250,000 funded accounts</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Keep up to 90% of profits</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>No personal capital at risk</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:border-primary/50 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-6">
              <ShieldX className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Risk-Free Trading</h3>
            <p className="text-muted-foreground mb-4">Develop your skills without risking your capital in our competitive environment</p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Demo accounts with real data</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Practice trading strategies</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>Low entry fees, high rewards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-gradient-to-b from-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 py-1 px-4 bg-primary/10 border-primary/20 text-primary">
              Platform Stats
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Growing Community of Traders</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands of traders who are already competing and winning on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
              <Wallet className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">$3.2M+</p>
              <p className="text-muted-foreground">Funded Accounts Awarded</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">15,000+</p>
              <p className="text-muted-foreground">Active Traders</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
              <BarChart className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">5,200+</p>
              <p className="text-muted-foreground">Completed Challenges</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
              <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold mb-2">75+</p>
              <p className="text-muted-foreground">Countries Represented</p>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">MJ</div>
                <div>
                  <h4 className="font-semibold">Michael J.</h4>
                  <p className="text-xs text-muted-foreground">Forex Trader, New York</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I won a $50,000 funded account after just my second challenge! The platform is easy to use and the competition is addictive."
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4">SL</div>
                <div>
                  <h4 className="font-semibold">Sarah L.</h4>
                  <p className="text-xs text-muted-foreground">Crypto Trader, London</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The best way to prove your trading skills without risking your own capital. I've been trading with a funded account for 6 months now."
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-4">RK</div>
                <div>
                  <h4 className="font-semibold">Robert K.</h4>
                  <p className="text-xs text-muted-foreground">Stock Trader, Singapore</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The competition aspect makes trading more exciting. I love seeing my name climb up the leaderboard as my strategy plays out."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Challenges Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 py-1 px-4 bg-primary/10 border-primary/20 text-primary">
            Upcoming Challenges
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from a variety of trading challenges and show off your skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
            <div className="h-2 bg-primary"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Forex</Badge>
                <div className="text-xs text-muted-foreground">Starts in 2 days</div>
              </div>
              <h3 className="text-xl font-bold mb-4">Weekend Warrior Challenge</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Trade major forex pairs over the weekend and compete for a $50,000 funded account
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Prize</p>
                  <p className="font-semibold">$50,000 Account</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                  <p className="font-semibold">$25</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="font-semibold">87 / 100</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">3 Days</p>
                </div>
              </div>
              
              <Button className="w-full" onClick={() => setIsSignupModalOpen(true)}>
                Join Challenge
              </Button>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
            <div className="h-2 bg-green-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Crypto</Badge>
                <div className="text-xs text-muted-foreground">Starts in 1 day</div>
              </div>
              <h3 className="text-xl font-bold mb-4">Crypto Bull Run</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Trade top cryptocurrencies during volatile market conditions and win big
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Prize</p>
                  <p className="font-semibold">$100,000 Account</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                  <p className="font-semibold">$50</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="font-semibold">142 / 200</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">3 Days</p>
                </div>
              </div>
              
              <Button className="w-full" onClick={() => setIsSignupModalOpen(true)}>
                Join Challenge
              </Button>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
            <div className="h-2 bg-purple-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Stocks</Badge>
                <div className="text-xs text-muted-foreground">Starts in 5 days</div>
              </div>
              <h3 className="text-xl font-bold mb-4">Blue Chip Bonanza</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Focus on blue chip stocks and aim for consistent returns to win this challenge
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Prize</p>
                  <p className="font-semibold">$250,000 Account</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                  <p className="font-semibold">$100</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="font-semibold">32 / 100</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">3 Days</p>
                </div>
              </div>
              
              <Button className="w-full" onClick={() => setIsSignupModalOpen(true)}>
                Join Challenge
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setIsSignupModalOpen(true)}
            className="border-2 border-primary text-primary hover:bg-primary hover:bg-opacity-10"
          >
            View All Challenges
          </Button>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Trading Career?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
            Join PvP.trading today and compete against traders from around the world. Win funded accounts and take your trading to the next level!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => setIsLoginModalOpen(true)} 
              className="bg-primary hover:bg-opacity-90 text-white px-8 py-6 rounded-lg font-semibold transition duration-200 shadow-lg"
              size="lg"
            >
              Create Free Account
            </Button>
            <Button 
              onClick={() => setIsSignupModalOpen(true)} 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:bg-opacity-10 px-8 py-6 rounded-lg font-semibold transition duration-200"
              size="lg"
            >
              Browse Challenges
            </Button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">Login to PvP.trading</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={() => setIsLoginModalOpen(false)} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => {
                setIsLoginModalOpen(false);
                setIsSignupModalOpen(true);
              }}
            >
              Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">Create your account</DialogTitle>
            <DialogDescription>
              Join PvP.trading to start competing in trading challenges
            </DialogDescription>
          </DialogHeader>
          <RegisterForm onSuccess={() => setIsSignupModalOpen(false)} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => {
                setIsSignupModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            >
              Log in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
