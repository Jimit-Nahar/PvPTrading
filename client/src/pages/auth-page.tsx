import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Trophy, ChartLine, ShieldX } from "lucide-react";

export default function AuthPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      {/* Left side - Forms */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">PvP.trading</h1>
            <p className="text-muted-foreground">Win funded account competing with other traders</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex lg:flex-col bg-primary/5 p-12 justify-center">
        <h2 className="text-4xl font-bold mb-6">Start your trading competition journey</h2>
        <p className="text-xl mb-12 text-muted-foreground">
          Compete with other traders and win funded accounts to take your trading to the next level
        </p>

        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Compete in real-time</h3>
              <p className="text-muted-foreground">Join 3-day trading challenges with $10,000 demo accounts and compete against other traders to win big</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ChartLine className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Win funded trading accounts</h3>
              <p className="text-muted-foreground">The top performers in each challenge receive funded trading accounts worth up to $75,000</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ShieldX className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Risk-free environment</h3>
              <p className="text-muted-foreground">Improve your trading skills in a competitive environment without risking your own capital</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
