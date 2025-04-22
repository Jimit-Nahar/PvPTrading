import { useState } from "react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Trophy, CreditCard, Wallet, Bitcoin } from "lucide-react";

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const challenges = [
    {
      id: "10k",
      name: "$10K Challenge",
      description: "Start with a $10,000 trading account. Phase 1: 30 Days challenge to prove your trading skills.",
      initialBalance: "10,000",
      duration: "Phase 1: 30 Days",
      paymentLinks: {
        creditCard: "https://buy.stripe.com/eVa9Ca1IFeYLaYgaEN",
        paypal: "https://www.paypal.com/ncp/payment/9UBJPT32WV9ZU",
        crypto: "https://commerce.coinbase.com/checkout/2c04ee65-65af-4c08-96a2-9e6fba6517e9"
      }
    },
    {
      id: "25k",
      name: "$25K Challenge",
      description: "Start with a $25,000 trading account. Test your crypto trading skills.",
      initialBalance: "25,000",
      duration: "Phase 1: 30 Days",
      paymentLinks: {
        creditCard: "https://buy.stripe.com/6oEdSq0EB7wjgiA7sC",
        paypal: "https://www.paypal.com/ncp/payment/QF396HX2XEBJL",
        crypto: "https://commerce.coinbase.com/checkout/28b36ebf-6d2f-4a24-8705-ed7356098ab0"
      }
    },
    {
      id: "50k",
      name: "$50K Challenge",
      description: "Start with a $50,000 trading account. Challenge your stock picking prowess.",
      initialBalance: "50,000",
      duration: "Phase 1: 30 Days",
      paymentLinks: {
        creditCard: "https://buy.stripe.com/4gw5lUbjf03R3vO6oz",
        paypal: "https://www.paypal.com/ncp/payment/TC4UTAGGFCKH8",
        crypto: "https://commerce.coinbase.com/checkout/50ce0148-0b93-4253-a526-bd0cdbb64d47"
      }
    }
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trading Challenges</h1>
            <p className="text-muted-foreground">
              Choose from our selection of trading challenges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-gradient-to-br ${
                challenge.id === "10k"
                  ? "from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/5"
                  : challenge.id === "25k"
                  ? "from-emerald-500/10 to-blue-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5"
                  : "from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/5"
              } rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                  challenge.id === "10k"
                    ? "from-blue-500 to-purple-500"
                    : challenge.id === "25k"
                    ? "from-emerald-500 to-blue-500"
                    : "from-purple-500 to-pink-500"
                } bg-clip-text text-transparent`}>{challenge.name}</h3>
                <div className={`p-2 ${
                  challenge.id === "10k"
                    ? "bg-blue-500/10"
                    : challenge.id === "25k"
                    ? "bg-emerald-500/10"
                    : "bg-purple-500/10"
                } rounded-full`}>
                  <Trophy className={`w-5 h-5 ${
                    challenge.id === "10k"
                      ? "text-blue-500"
                      : challenge.id === "25k"
                      ? "text-emerald-500"
                      : "text-purple-500"
                  }`} />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Initial Balance</span>
                  <span className="font-semibold">${challenge.initialBalance}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold">{challenge.duration}</span>
                </div>
              </div>
              <div className="space-y-3">
                <a href={challenge.paymentLinks.creditCard} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-[#635BFF] to-[#504ACC]">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with Credit Card
                  </Button>
                </a>
                <a href={challenge.paymentLinks.paypal} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-[#0070BA] to-[#005EA6]">
                    <Wallet className="w-4 h-4 mr-2" />
                    Pay with PayPal
                  </Button>
                </a>
                <a href={challenge.paymentLinks.crypto} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-[#0052FF] to-[#0040CC]">
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Pay with Crypto
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}