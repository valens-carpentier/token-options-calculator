import Image from 'next/image';
import { TokenData } from '../types/index';

interface TokenSelectorProps {
  onTokenSelect: (tokenId: string) => void;
  tokenData: TokenData | null;
}

export default function TokenSelector({ onTokenSelect, tokenData }: TokenSelectorProps) {
  const tokenIds = ['aave', 'safe', 'arbitrum', 'optimism'];

  return (
    <div className="priceContainer">
      <div>
        <label>
          Current token price
          <select 
            className="inputData"
            onChange={(e) => onTokenSelect(e.target.value)}
          >
            {tokenIds.map((id) => (
              <option key={id} value={id}>
                {id.toUpperCase()}
              </option>
            ))}
          </select>
          {tokenData?.image?.small && (
            <span className="logoContainer">
              <Image
                src={tokenData.image.small}
                alt={`${tokenData.name} Logo`}
                width={32}
                height={32}
              />
            </span>
          )}
        </label>
        <div id="tokenPrice">
          {tokenData?.current_price?.toFixed(2) ?? '0.00'}
        </div>
      </div>
    </div>
  );
} 