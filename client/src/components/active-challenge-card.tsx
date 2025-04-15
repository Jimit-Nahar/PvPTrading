import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartBar, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Countdown } from "@/components/ui/countdown";
import { useLocation } from "wouter";

interface ActiveChallengeCardProps {
  participation: any;
}

export default function ActiveChallengeCard({ participation }: ActiveChallengeCardProps) {
  const [, navigate] = useLocation();
  const challenge = participation.challenge;

  if (!challenge) return null;

  const endDate = new Date(challenge.endTime);
  const pnlPercentage = parseFloat(participation.pnlPercentage || "0");
  
  const handleViewDetails = () => {
    navigate(`/challenges/${challenge.id}`);
  };

  const handleStartTrading = () => {
    navigate(`/trade/${challenge.id}`);
  };

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
            <ChartBar className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">{challenge.name}</h3>
            <p className="text-xs text-muted-foreground">{challenge.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Time Left</p>
            <Countdown endDate={endDate} compact className="font-semibold" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Position</p>
            <p className="font-semibold">
              {participation.position ? 
                `${participation.position}${participation.position ? ' / ' + challenge.participantsCount : ''}` : 
                '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Current PnL</p>
            <p className={`font-semibold ${pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pnlPercentage >= 0 ? '+' : ''}{formatCurrency(parseFloat(participation.pnl))}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h4 className="text-sm font-semibold mb-2">Account Balance</h4>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{formatCurrency(parseFloat(participation.currentBalance))}</span>
            <span className="ml-2 text-xs text-green-500">
              {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
            <div 
              className={`${pnlPercentage >= 0 ? 'bg-primary' : 'bg-red-500'} h-1.5 rounded-full`} 
              style={{ width: `${Math.min(100, Math.max(0, Math.abs(pnlPercentage) * 4))}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            variant="secondary" 
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button 
            onClick={handleStartTrading}
            className="flex items-center"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Start Trading
          </Button>
        </div>
      </div>
    </Card>
  );
}
