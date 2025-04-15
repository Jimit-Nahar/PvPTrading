import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import Confetti from 'react-confetti';
import { Sparkles, TrendingUp, Target, Award, Zap, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface MilestoneProps {
  title: string;
  current: number;
  target: number;
  icon: React.ReactNode;
  unit?: string;
  color?: string;
}

const Milestone: React.FC<MilestoneProps> = ({ 
  title, 
  current, 
  target, 
  icon, 
  unit = '$',
  color = "primary"
}) => {
  const progress = Math.min(100, Math.round((current / target) * 100));
  const isComplete = current >= target;
  const colorClass = isComplete ? 'text-green-500' : '';

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full bg-${color}/10 text-${color}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          <div className="flex items-baseline">
            <span className={`text-lg font-bold ${colorClass}`}>
              {unit === '$' ? formatCurrency(current) : current}
              {unit !== '$' && unit}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              / {unit === '$' ? formatCurrency(target) : target}
              {unit !== '$' && unit}
            </span>
          </div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
      {isComplete && (
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};

interface MilestoneAchievement {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  isNew?: boolean;
}

interface MilestoneDashboardProps {
  achievements: MilestoneAchievement[];
}

export default function MilestoneDashboard({ achievements }: MilestoneDashboardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedMilestone, setCompletedMilestone] = useState<MilestoneAchievement | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Find newly completed milestones
    const newlyCompleted = achievements.find(a => a.current >= a.target && a.isNew);
    
    if (newlyCompleted) {
      setCompletedMilestone(newlyCompleted);
      setShowConfetti(true);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievements]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group milestones by completion status
  const completedMilestones = achievements.filter(a => a.current >= a.target);
  const inProgressMilestones = achievements.filter(a => a.current < a.target);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" /> 
          Trading Milestones
        </CardTitle>
        <CardDescription>
          Track your progress toward important trading goals
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            tweenDuration={5000}
          />
        )}
        
        {completedMilestone && showConfetti && (
          <div className="mb-6 p-4 border border-green-500/20 bg-green-500/10 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 text-green-500 font-bold">
              <Award className="h-5 w-5" />
              <span>Milestone Achieved!</span>
            </div>
            <p className="text-green-500">{completedMilestone.title} - {completedMilestone.description}</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">In Progress</h3>
            {inProgressMilestones.length > 0 ? (
              <div className="grid gap-4">
                {inProgressMilestones.map(milestone => (
                  <Milestone
                    key={milestone.id}
                    title={milestone.title}
                    current={milestone.current}
                    target={milestone.target}
                    icon={milestone.icon}
                    unit={milestone.unit}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All milestones completed!</p>
            )}
          </div>
          
          {completedMilestones.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-4">Completed</h3>
              <div className="grid gap-4">
                {completedMilestones.map(milestone => (
                  <Milestone
                    key={milestone.id}
                    title={milestone.title}
                    current={milestone.current}
                    target={milestone.target}
                    icon={milestone.icon}
                    unit={milestone.unit}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}