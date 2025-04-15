import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, ChartLine, ShieldX } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">PvP.trading</h1>
        <p className="text-xl md:text-2xl mb-12 text-muted-foreground">Win funded account competing with other traders</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setIsLoginModalOpen(true)} 
            className="bg-primary hover:bg-opacity-90 text-white px-8 py-6 rounded-lg font-semibold transition duration-200 shadow-lg"
            size="lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => setIsSignupModalOpen(true)} 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:bg-opacity-10 px-8 py-6 rounded-lg font-semibold transition duration-200"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mb-4">
              <Trophy className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compete Live</h3>
            <p className="text-muted-foreground">Trade against others in real-time 3-day challenges with $10,000 demo accounts</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mb-4">
              <ChartLine className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Win Funded Accounts</h3>
            <p className="text-muted-foreground">Top performers receive funded trading accounts to trade with real capital</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mb-4">
              <ShieldX className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Risk-Free Trading</h3>
            <p className="text-muted-foreground">Develop your skills without risking your capital in our competitive environment</p>
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
