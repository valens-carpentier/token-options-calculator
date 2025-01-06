import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  BarController 
} from 'chart.js';
import { Chart } from 'chart.js';
import { useEffect, useRef } from 'react';
import { TokenData, VestingCalculation } from '../types/index';
import { calculateVestedTokens, generateVestingSchedule } from '../utils/calculations';
import '../app/styles/globals.css';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface ResultsDisplayProps {
  calculation: VestingCalculation;
  tokenData: TokenData | null;
}

export default function ResultsDisplay({ calculation, tokenData }: ResultsDisplayProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const vestedTokens = calculateVestedTokens(
    calculation.tokenOptions,
    calculation.fullyLapsedMonths,
    calculation.vestingPeriod,
    calculation.calculationMethod
  );

  const tokenValue = vestedTokens * (tokenData?.current_price || 0);
  const vestingSchedule = generateVestingSchedule(
    calculation.tokenOptions,
    calculation.vestingPeriod,
    calculation.calculationMethod,
    tokenData?.current_price || 0
  );

  useEffect(() => {
    if (!chartRef.current || !vestingSchedule.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: vestingSchedule.map(item => `Month ${item.month}`),
        datasets: [{
          label: 'Value (EUR)',
          data: vestingSchedule.map(item => item.value),
          backgroundColor: 'rgba(105, 154, 70, 0.5)',
          borderColor: 'rgba(105, 154, 70, 1)',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--foreground')
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(105, 154, 70, 0.1)'
            },
            ticks: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--foreground')
            },
            title: {
              display: true,
              text: 'Value (EUR)',
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--foreground')
            }
          },
          x: {
            grid: {
              color: 'rgba(105, 154, 70, 0.1)'
            },
            ticks: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--foreground')
            },
            title: {
              display: true,
              text: 'Months',
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--foreground')
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [vestingSchedule]);

  return (
    <div className="resultContainer">
      <div>
        <label>Vested token options</label>
        <div className="inputData">
          {vestedTokens.toLocaleString()}
        </div>
      </div>

      <div>
        <label>Value (in euros)</label>
        <div className="inputData">
          {tokenValue.toLocaleString('fr-FR', { 
            style: 'currency', 
            currency: 'EUR' 
          })}
        </div>
      </div>

      <div className="vestingSchedule">
        <h4>Vesting Schedule</h4>
        <div className="tableContainer max-h-[250px] overflow-y-auto">
          <table>
            <thead className="sticky top-0 bg-background z-10">
              <tr>
                <th>Month</th>
                <th>Vested Tokens</th>
                <th>Value (EUR)</th>
              </tr>
            </thead>
            <tbody>
              {vestingSchedule.map(({ month, tokens, value }) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>{tokens.toLocaleString()}</td>
                  <td>
                    {value.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h4>Vesting Graph</h4>
        <div className="graphContainer">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
} 