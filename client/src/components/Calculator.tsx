'use client';

import { useState } from 'react';
import { TokenData, VestingCalculation } from '../types/index';
import TokenSelector from './TokenSelector';
import VestingForm from './VestingForm';
import ResultsDisplay from './ResultsDisplay';

export default function Calculator() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [calculation, setCalculation] = useState<VestingCalculation>({
    tokenOptions: 0,
    fullyLapsedMonths: 0,
    vestingPeriod: 0,
    calculationMethod: 'linear'
  });

  const fetchTokenPrice = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/tokens/${tokenId}`);
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  return (
    <div className="calculatorDiv">
      <TokenSelector onTokenSelect={fetchTokenPrice} tokenData={tokenData} />
      <VestingForm 
        calculation={calculation} 
        onCalculationChange={setCalculation} 
      />
      <ResultsDisplay 
        calculation={calculation}
        tokenData={tokenData}
      />
    </div>
  );
}