import { Challenge } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Countdown } from "./ui/countdown";
import { useState } from "react";
import JoinChallengeModal from "./join-challenge-modal";

interface ChallengeCardProps {
  challenge: Challenge;
  participantsCount?: number;
}

export default function ChallengeCard({ challenge, participantsCount = 0 }: ChallengeCardProps) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const getBackgroundImage = () => {
    if (challenge.type === 'forex') {
      return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3';
    } else if (challenge.type === 'crypto') {
      return 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0';
    } else if (challenge.type === 'stocks') {
      return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f';
    }
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3';
  };

  const getGradient = () => {
    if (challenge.type === 'forex') {
      return 'from-blue-900 to-indigo-900';
    } else if (challenge.type === 'crypto') {
      return 'from-yellow-900 to-red-900';
    } else if (challenge.type === 'stocks') {
      return 'from-green-900 to-blue-900';
    }
    return 'from-blue-900 to-indigo-900';
  };

  return (
    <>
      <Card className="overflow-hidden shadow-lg">
        <div className={`h-32 bg-gradient-to-r ${getGradient()} relative`}>
          <img 
            src={getBackgroundImage()} 
            alt={challenge.name} 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <Badge variant={challenge.type as "forex" | "crypto" | "stocks"}>{challenge.type}</Badge>
              <Badge variant="black">{participantsCount} Participants</Badge>
            </div>
            <h3 className="text-white font-bold text-lg">{challenge.name}</h3>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="font-semibold">{formatCurrency(parseFloat(challenge.entryFee))}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold">3 Days</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prize</p>
              <p className="font-semibold">{formatCurrency(parseFloat(challenge.prizeAmount))} Account</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Starts In</p>
            <Countdown 
              endDate={new Date(challenge.startTime)} 
              onComplete={() => console.log('Challenge started!')} 
            />
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => setShowJoinModal(true)}
          >
            Join Challenge
          </Button>
        </CardFooter>
      </Card>

      <JoinChallengeModal 
        challenge={challenge}
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
}
