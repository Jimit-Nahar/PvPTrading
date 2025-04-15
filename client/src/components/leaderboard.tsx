import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LeaderboardItem {
  position: number;
  participationId: number;
  userId: number;
  username: string;
  displayName: string;
  currentBalance: string;
  pnl: string;
  pnlPercentage: string;
}

interface LeaderboardProps {
  leaderboard: LeaderboardItem[];
  currentUserId?: number;
}

export default function Leaderboard({ leaderboard, currentUserId }: LeaderboardProps) {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No participants yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-muted-foreground text-xs border-b border-border">
            <th className="pb-3 pl-3 font-medium">Rank</th>
            <th className="pb-3 font-medium">Trader</th>
            <th className="pb-3 font-medium">Current Balance</th>
            <th className="pb-3 font-medium">PnL</th>
            <th className="pb-3 font-medium">Change (24h)</th>
            <th className="pb-3 pr-3 font-medium">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((trader) => {
            const isCurrentUser = trader.userId === currentUserId;
            const pnlValue = parseFloat(trader.pnl);
            const pnlPercentage = parseFloat(trader.pnlPercentage);
            
            return (
              <tr 
                key={trader.participationId} 
                className={`border-b border-border ${isCurrentUser ? 'bg-secondary bg-opacity-50' : 'hover:bg-secondary hover:bg-opacity-50'} transition duration-150`}
              >
                <td className="py-4 pl-3">
                  {trader.position <= 3 ? (
                    <span 
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold
                        ${trader.position === 1 ? 'bg-yellow-500' : trader.position === 2 ? 'bg-gray-400' : 'bg-primary'}`}
                    >
                      {trader.position}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-muted-foreground text-xs font-bold">
                      {trader.position}
                    </span>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className={`${
                        trader.position === 1 ? 'bg-blue-500' : 
                        trader.position === 2 ? 'bg-red-500' : 
                        trader.position === 3 ? 'bg-primary' : 
                        'bg-purple-500'
                      } text-white font-bold`}>
                        {getInitials(trader.displayName || trader.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{trader.displayName || trader.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {trader.position === 1 ? 'Veteran Trader' : 
                         trader.position === 2 ? 'Day Trader' : 
                         trader.position === 3 ? 'Swing Trader' : 'Trader'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-semibold">{formatCurrency(parseFloat(trader.currentBalance))}</td>
                <td className="py-4">
                  <span className={pnlValue >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                    {formatPercentage(pnlPercentage)}
                  </span>
                </td>
                <td className="py-4">
                  {/* This would come from real data, but for now we'll generate a random change */}
                  <span className={Math.random() > 0.3 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
                    {Math.random() > 0.3 ? (
                      <>
                        <TrendingUp className="mr-1 h-4 w-4" /> {(Math.random() * 3).toFixed(1)}%
                      </>
                    ) : (
                      <>
                        <TrendingDown className="mr-1 h-4 w-4" /> {(Math.random() * 2).toFixed(1)}%
                      </>
                    )}
                  </span>
                </td>
                <td className="py-4 pr-3 font-semibold">{Math.floor(40 + Math.random() * 50)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
