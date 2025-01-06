export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: {
    small: string;
    large: string;
  };
}

export interface VestingCalculation {
  tokenOptions: number;
  fullyLapsedMonths: number;
  vestingPeriod: number;
  calculationMethod: 'exponential' | 'linear';
}

export interface CalculationResult {
  vestedTokens: number;
  tokenValue: number;
  monthlyBreakdown: Array<{
    month: number;
    tokens: number;
    value: number;
  }>;
}