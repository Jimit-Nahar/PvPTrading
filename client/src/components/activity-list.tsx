import { getRelativeTime } from "@/lib/utils";
import { Trophy, ArrowRight, DollarSign, X } from "lucide-react";

interface Activity {
  id: number;
  userId: number;
  type: string;
  description: string;
  metadata: string;
  createdAt: string;
}

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No recent activities
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "challenge_win":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <Trophy className="text-green-500 h-4 w-4" />
          </div>
        );
      case "challenge_join":
        return (
          <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="text-primary h-4 w-4" />
          </div>
        );
      case "payment":
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="text-yellow-500 h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <X className="text-red-500 h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 custom-scrollbar" style={{ maxHeight: "240px", overflowY: "auto" }}>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border">
          {getActivityIcon(activity.type)}
          <div>
            <p className="text-sm">{activity.description}</p>
            <span className="text-xs text-muted-foreground">
              {getRelativeTime(new Date(activity.createdAt))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
