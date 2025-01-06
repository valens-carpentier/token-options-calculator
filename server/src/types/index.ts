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