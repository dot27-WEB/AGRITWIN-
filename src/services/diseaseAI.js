import diseasesData from '../data/diseases.json';

/**
 * Simulates plant disease diagnosis based on input/upload IDs.
 */
export const diagnoseDisease = (diseaseId) => {
  return diseasesData.find(d => d.id === diseaseId) || null;
};

export const getAllDiseases = () => {
  return diseasesData;
};
