import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils";
import { Home, Trophy, LineChart, Users, UserCircle, Settings, HelpCircle, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { path: "/trades", label: "My Trades", icon: <LineChart className="h-4 w-4" /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Users className="h-4 w-4" /> },
    { path: "/profile", label: "Profile", icon: <UserCircle className="h-4 w-4" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="lg:w-64 bg-card border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">PvP.trading</h2>
        <Button 
          variant="ghost" 
          className="lg:hidden" 
          onClick={toggleMobileMenu}
          size="icon"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4">
          {user && (
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {getInitials(user.displayName || user.username)}
              </div>
              <div>
                <h3 className="font-medium">{user.displayName || user.username}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.path}>
                <Link 
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      (location === item.path || location.startsWith(item.path + '?')) 
                        ? 'bg-primary bg-opacity-10 text-primary' 
                        : 'text-muted-foreground hover:bg-secondary'
                    } cursor-pointer`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border mt-4">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
