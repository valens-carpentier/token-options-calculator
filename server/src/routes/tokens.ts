import express from 'express';
import { TokenData } from '../types/index';

const router = express.Router();

router.get('/:tokenId', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${req.params.tokenId}`
    );
    const data = await response.json();
    
    const tokenData: TokenData = {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      current_price: data.market_data.current_price.eur,
      image: {
        small: data.image.small,
        large: data.image.large
      }
    };
    
    res.json(tokenData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token data' });
  }
});

export default router; 