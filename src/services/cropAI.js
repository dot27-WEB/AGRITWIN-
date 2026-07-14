import { calculateCropRotation } from '../utils/cropRotation';
import cropsData from '../data/crops.json';

/**
 * Exposes AI crop recommendation logics.
 */
export const getCropRecommendations = (current, previous, secondPrevious) => {
  return calculateCropRotation(current, previous, secondPrevious);
};

export const getAllCrops = () => {
  return cropsData;
};
