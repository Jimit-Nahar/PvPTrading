import { Wallet, BadgeCheck, ChartBar, ArrowUp } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changePercentage?: number;
  secondaryText?: string;
  icon: "wallet" | "flag" | "chart";
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changePercentage, 
  secondaryText,
  icon 
}: StatCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case "wallet":
        return <Wallet className="text-primary" />;
      case "flag":
        return <BadgeCheck className="text-primary" />;
      case "chart":
        return <ChartBar className="text-primary" />;
      default:
        return null;
    }
  };

  const isPositive = (change || changePercentage || 0) >= 0;

  return (
    <div className="bg-card rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <h3 className="text-2xl font-bold">
            {typeof value === "number" && title.includes("Balance") || title.includes("PnL") 
              ? formatCurrency(value) 
              : value}
          </h3>
          {(change || changePercentage || secondaryText) && (
            <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
              {(change || changePercentage) ? (
                <>
                  <ArrowUp className={`mr-1 h-3 w-3 ${!isPositive ? 'rotate-180' : ''}`} /> 
                  {change ? formatCurrency(Math.abs(change)) : formatPercentage(Math.abs(changePercentage || 0))}
                </>
              ) : (
                <span className="text-primary">{secondaryText}</span>
              )}
            </span>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
