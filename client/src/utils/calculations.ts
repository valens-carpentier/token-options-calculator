export function calculateVestedTokens(
  tokenOptions: number,
  fullyLapsedMonths: number,
  vestingPeriod: number,
  calculationMethod: 'linear' | 'exponential' | 'cliff'
): number {
  switch (calculationMethod) {
    case 'exponential':
      return (tokenOptions * Math.pow(fullyLapsedMonths, 2)) / Math.pow(vestingPeriod, 2);
    
    case 'linear':
      return (tokenOptions * fullyLapsedMonths) / vestingPeriod;
    
    case 'cliff':
      const cliffPeriod = 6;
      if (fullyLapsedMonths < cliffPeriod) return 0;
      return tokenOptions / (vestingPeriod - cliffPeriod);
    
    default:
      return 0;
  }
}

export function generateVestingSchedule(
  tokenOptions: number,
  vestingPeriod: number,
  calculationMethod: 'linear' | 'exponential' | 'cliff',
  tokenPrice: number
) {
  const schedule = [];

  for (let month = 1; month <= vestingPeriod; month++) {
    const vestedTokens = calculateVestedTokens(
      tokenOptions,
      month,
      vestingPeriod,
      calculationMethod
    );
    
    schedule.push({
      month,
      tokens: vestedTokens,
      value: vestedTokens * tokenPrice
    });
  }

  return schedule;
} 