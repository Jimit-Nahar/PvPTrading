import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentStarted: () => void;
  onPaymentError: () => void;
  createPaymentIntent: () => Promise<{ clientSecret: string }>;
}

export default function PaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentStarted,
  onPaymentError,
  createPaymentIntent
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentFormReady, setIsPaymentFormReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This is just to simulate loading the payment form
    setTimeout(() => {
      setIsPaymentFormReady(true);
    }, 500);
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    // Add spaces for readability
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(' ') || '';
    }
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    setCvc(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPaymentFormReady) return;
    
    if (!cardNumber || !expiry || !cvc) {
      toast({
        title: "Invalid payment details",
        description: "Please fill in all card information",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      onPaymentStarted();
      
      // In a real implementation, we would use Stripe.js to handle the payment
      // But for this demo, we'll simulate a successful payment after creating a payment intent
      const { clientSecret } = await createPaymentIntent();
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract payment intent ID from client secret
      const paymentIntentId = clientSecret.split('_secret')[0];
      
      onPaymentSuccess(paymentIntentId);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
      onPaymentError();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPaymentFormReady) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-number">Card Number</Label>
        <Input
          id="card-number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            placeholder="123"
            value={cvc}
            onChange={handleCvcChange}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Test card: 4242 4242 4242 4242</span>
        </div>
        <div className="font-semibold">
          {formatCurrency(amount)}
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !cardNumber || !expiry || !cvc}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </Button>
    </form>
  );
}
