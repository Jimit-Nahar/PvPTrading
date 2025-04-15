import { useState } from "react";
import { Challenge } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PaymentForm from "./payment/payment-form";
import { useLocation } from "wouter";

interface JoinChallengeModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinChallengeModal({ challenge, isOpen, onClose }: JoinChallengeModalProps) {
  const [tradingPlatform, setTradingPlatform] = useState<string>("mt4");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [paymentState, setPaymentState] = useState<"initial" | "processing" | "success" | "error">("initial");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/create-payment-intent", {
        challengeId: challenge.id,
        amount: parseFloat(challenge.entryFee),
      });
      return await res.json();
    },
    onSuccess: (data) => {
      console.log("Payment intent created:", data);
    },
    onError: (error: Error) => {
      console.error("Error creating payment intent:", error);
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
      setPaymentState("error");
    },
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const res = await apiRequest("POST", `/api/challenges/${challenge.id}/join`, {
        paymentIntentId,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `You've successfully joined the ${challenge.name} challenge!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/participations"] });
      setPaymentState("success");
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 1500);
    },
    onError: (error: Error) => {
      console.error("Error joining challenge:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setPaymentState("error");
    },
  });

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentIntentId(paymentIntentId);
    joinChallengeMutation.mutate(paymentIntentId);
  };

  const startDate = new Date(challenge.startTime);
  const endDate = new Date(challenge.endTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Join {challenge.name}</DialogTitle>
          <DialogDescription>
            Entry fee: {formatCurrency(parseFloat(challenge.entryFee))}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Challenge Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{startDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{endDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Initial Balance</p>
                <p className="font-medium">{formatCurrency(parseFloat(challenge.initialBalance))}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Prize</p>
                <p className="font-medium">{formatCurrency(parseFloat(challenge.prizeAmount))} Funded Account</p>
              </div>
              <div>
                <p className="text-muted-foreground">Participants</p>
                <p className="font-medium">0 / {challenge.maxParticipants}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trading Instruments</p>
                <p className="font-medium">{challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Trading Platform</h3>
            <RadioGroup 
              value={tradingPlatform} 
              onValueChange={setTradingPlatform}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mt4" id="mt4" />
                <Label htmlFor="mt4">MetaTrader 4</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mt5" id="mt5" />
                <Label htmlFor="mt5">MetaTrader 5</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="flex space-x-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="crypto" id="crypto" />
                <Label htmlFor="crypto">Crypto</Label>
              </div>
            </RadioGroup>
            
            {paymentMethod === 'card' && paymentState === 'initial' && (
              <div className="mt-4">
                <PaymentForm 
                  amount={parseFloat(challenge.entryFee)}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentStarted={() => setPaymentState("processing")}
                  onPaymentError={() => setPaymentState("error")}
                  createPaymentIntent={createPaymentIntentMutation.mutateAsync}
                />
              </div>
            )}
            
            {paymentState === 'processing' && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Processing payment...</span>
              </div>
            )}
            
            {paymentState === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 text-center">
                <p className="text-green-500 font-medium">Payment successful! You've joined the challenge.</p>
              </div>
            )}
            
            {paymentState === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-center">
                <p className="text-red-500 font-medium">There was an error processing your payment. Please try again.</p>
              </div>
            )}
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(value) => setTermsAccepted(value === true)}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the <Button variant="link" className="p-0 h-auto text-primary">Challenge Rules</Button> and understand that the entry fee is non-refundable once the challenge starts.
            </Label>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {paymentState === 'initial' && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Please complete payment to join
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
