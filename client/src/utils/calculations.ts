export function calculateVestedTokens(
    tokenOptions: number,
    fullyLapsedMonths: number,
    vestingPeriod: number,
    calculationMethod: 'linear' | 'exponential'
  ): number {
    switch (calculationMethod) {
      case 'exponential':
        return (tokenOptions * Math.pow(fullyLapsedMonths, 2)) / Math.pow(vestingPeriod, 2);
      
      case 'linear':
        return (tokenOptions * fullyLapsedMonths) / vestingPeriod;
      
      default:
        return 0;
    }
  }
  
  export function generateVestingSchedule(
    tokenOptions: number,
    vestingPeriod: number,
    calculationMethod: 'linear' | 'exponential',
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