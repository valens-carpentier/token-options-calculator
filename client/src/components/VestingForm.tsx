import { VestingCalculation } from '../types/index';

interface VestingFormProps {
  calculation: VestingCalculation;
  onCalculationChange: (calc: VestingCalculation) => void;
}

export default function VestingForm({ calculation, onCalculationChange }: VestingFormProps) {
  const handleInputChange = (field: keyof VestingCalculation, value: string) => {
    onCalculationChange({
      ...calculation,
      [field]: field === 'calculationMethod' ? value : Number(value)
    });
  };

  return (
    <div className="inputContainer">
      <h4>Your options</h4>
      <div>
        <label htmlFor="tokenOptions">Token options</label>
        <input
          className="inputData"
          type="number"
          id="tokenOptions"
          value={calculation.tokenOptions || ''}
          onChange={(e) => handleInputChange('tokenOptions', e.target.value)}
          placeholder="61100"
        />
      </div>

      <div>
        <label htmlFor="fullyLapsedMonths">Fully lapsed months</label>
        <input
          className="inputData"
          type="number"
          id="fullyLapsedMonths"
          value={calculation.fullyLapsedMonths || ''}
          onChange={(e) => handleInputChange('fullyLapsedMonths', e.target.value)}
          placeholder="6"
        />
      </div>

      <div>
        <label htmlFor="vestingPeriod">Vesting period</label>
        <input
          className="inputData"
          type="number"
          id="vestingPeriod"
          value={calculation.vestingPeriod || ''}
          onChange={(e) => handleInputChange('vestingPeriod', e.target.value)}
          placeholder="48"
        />
      </div>

      <div>
        <label htmlFor="calculationMethod">Vesting type</label>
        <select
          id="calculationMethod"
          value={calculation.calculationMethod}
          onChange={(e) => handleInputChange('calculationMethod', e.target.value)}
        >
          <option value="exponential">Exponential</option>
          <option value="linear">Linear</option>
          <option value="cliff">Cliff</option>
        </select>
      </div>
    </div>
  );
} 