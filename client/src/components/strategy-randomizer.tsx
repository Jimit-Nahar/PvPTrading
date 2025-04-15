import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowDown, ArrowUp, Dices, TrendingDown, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the strategy types
type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
type TradingStyle = 'Trend Following' | 'Mean Reversion' | 'Breakout' | 'Scalping' | 'Position Trading';
type RiskReward = 'Conservative (1:2)' | 'Balanced (1:1.5)' | 'Aggressive (1:1)' | 'Swing (1:3)';
type PositionSize = '1%' | '2%' | '3%' | '5%' | '10%';
type Direction = 'Long Only' | 'Short Only' | 'Both';

interface Strategy {
  name: string;
  timeframe: TimeFrame;
  style: TradingStyle;
  riskReward: RiskReward;
  positionSize: PositionSize;
  direction: Direction;
  description: string;
}

// Base strategies for randomization
const strategyTemplates: Strategy[] = [
  {
    name: 'Momentum Chaser',
    timeframe: '1h',
    style: 'Trend Following',
    riskReward: 'Balanced (1:1.5)',
    positionSize: '2%',
    direction: 'Both',
    description: 'Follow strong momentum moves with clear trend direction. Entry on pullbacks.'
  },
  {
    name: 'Reversal Hunter',
    timeframe: '4h',
    style: 'Mean Reversion',
    riskReward: 'Swing (1:3)',
    positionSize: '1%',
    direction: 'Both',
    description: 'Look for oversold/overbought conditions and trade the reversal back to the mean.'
  },
  {
    name: 'Scalp Master',
    timeframe: '5m',
    style: 'Scalping',
    riskReward: 'Conservative (1:2)',
    positionSize: '3%',
    direction: 'Long Only',
    description: 'Quick in-and-out trades taking advantage of small price movements.'
  },
  {
    name: 'Breakout Rider',
    timeframe: '1d',
    style: 'Breakout',
    riskReward: 'Aggressive (1:1)',
    positionSize: '5%',
    direction: 'Both',
    description: 'Enter when price breaks through significant support/resistance levels.'
  },
  {
    name: 'Trend Surfer',
    timeframe: '1d',
    style: 'Position Trading',
    riskReward: 'Swing (1:3)',
    positionSize: '10%',
    direction: 'Long Only',
    description: 'Hold positions for extended periods, riding major market trends.'
  }
];

// Randomization parameters
const timeframes: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d'];
const tradingStyles: TradingStyle[] = ['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping', 'Position Trading'];
const riskRewards: RiskReward[] = ['Conservative (1:2)', 'Balanced (1:1.5)', 'Aggressive (1:1)', 'Swing (1:3)'];
const positionSizes: PositionSize[] = ['1%', '2%', '3%', '5%', '10%'];
const directions: Direction[] = ['Long Only', 'Short Only', 'Both'];

export default function StrategyRandomizer() {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disclaimer, setShowDisclaimer] = useState(true);

  // Helper function for randomization
  const getRandomItem = <T extends unknown>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate a completely random strategy
  const generateRandomStrategy = () => {
    setIsLoading(true);
    
    // Simulate API call for strategy generation
    setTimeout(() => {
      const baseName = getRandomItem([
        'Alpha', 'Sigma', 'Delta', 'Omega', 'Neo', 'Quantum', 'Fusion', 'Velocity',
        'Stealth', 'Ninja', 'Dragon', 'Phoenix', 'Eagle', 'Tiger', 'Wolf'
      ]);
      
      const suffixName = getRandomItem([
        'Master', 'Hunter', 'Trader', 'Warrior', 'Edge', 'System', 'Method',
        'Technique', 'Protocol', 'Algorithm', 'Formula', 'Strategy'
      ]);
      
      const randomStrategy: Strategy = {
        name: `${baseName} ${suffixName}`,
        timeframe: getRandomItem(timeframes),
        style: getRandomItem(tradingStyles),
        riskReward: getRandomItem(riskRewards),
        positionSize: getRandomItem(positionSizes),
        direction: getRandomItem(directions),
        description: getRandomItem(strategyTemplates).description
      };
      
      setStrategy(randomStrategy);
      setIsLoading(false);
    }, 800);
  };

  // Generate a randomized version of a template strategy
  const generateFromTemplate = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const template = getRandomItem(strategyTemplates);
      
      // Create a slightly modified version of the template
      const randomizedStrategy: Strategy = {
        ...template,
        timeframe: Math.random() > 0.5 ? template.timeframe : getRandomItem(timeframes),
        positionSize: Math.random() > 0.5 ? template.positionSize : getRandomItem(positionSizes),
        direction: Math.random() > 0.5 ? template.direction : getRandomItem(directions),
      };
      
      setStrategy(randomizedStrategy);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-5 w-5" /> 
          Trading Strategy Randomizer
        </CardTitle>
        <CardDescription>
          Generate random trading strategies to experiment with new approaches
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {disclaimer && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Risk Warning</AlertTitle>
            <AlertDescription>
              These randomly generated strategies are for experimental purposes only.
              Always backtest strategies before trading real capital.
            </AlertDescription>
          </Alert>
        )}
        
        {strategy ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{strategy.name}</h3>
              <Badge variant="outline" className="px-2 py-1">
                {strategy.direction === 'Long Only' ? (
                  <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                ) : strategy.direction === 'Short Only' ? (
                  <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                ) : (
                  <>
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  </>
                )}
                {strategy.direction}
              </Badge>
            </div>
            
            <p className="text-muted-foreground">{strategy.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Timeframe</span>
                <p className="font-medium">{strategy.timeframe}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Trading Style</span>
                <p className="font-medium">{strategy.style}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Risk:Reward</span>
                <p className="font-medium">{strategy.riskReward}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Position Size</span>
                <p className="font-medium">{strategy.positionSize}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Dices className="h-12 w-12 mb-4 opacity-40" />
            <p>Click a button below to generate a random trading strategy</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={generateFromTemplate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Use Template'} 
        </Button>
        <Button onClick={generateRandomStrategy} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Completely Random'}
        </Button>
      </CardFooter>
    </Card>
  );
}