import marketData from '../data/marketData.json';

/**
 * Exposes mandi rates and price trends.
 */
export const getMarketPrices = () => {
  return marketData;
};

export const getMarketTrendsForCrop = (cropId) => {
  return marketData.find(m => m.cropId === cropId) || null;
};
