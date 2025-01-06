'use client';

import { useState } from 'react';
import { TokenData, VestingCalculation } from '../types/index';
import TokenSelector from './TokenSelector';
import VestingForm from './VestingForm';
import ResultsDisplay from './ResultsDisplay';
import '../app/styles/globals.css';

export default function Calculator() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [calculation, setCalculation] = useState<VestingCalculation>({
    tokenOptions: 0,
    fullyLapsedMonths: 0,
    vestingPeriod: 0,
    calculationMethod: 'exponential'
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
    <main className="container mx-auto p-6">
      <h1 className="title">Token Options Calculator</h1>
      
      <div className="calculator-grid">
        <aside className="calculator-inputs">
          <TokenSelector onTokenSelect={fetchTokenPrice} tokenData={tokenData} />
          <VestingForm 
            calculation={calculation} 
            onCalculationChange={setCalculation} 
          />
        </aside>
        
        <section className="calculator-results">
          <ResultsDisplay 
            calculation={calculation}
            tokenData={tokenData}
          />
        </section>
      </div>
    </main>
  );
}