import { checkSchemeEligibility } from '../utils/schemeEligibility';

/**
 * Exposes scheme eligibility evaluator.
 */
export const evaluateSchemes = (farm) => {
  return checkSchemeEligibility(farm);
};
