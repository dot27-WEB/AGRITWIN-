export const getFarmsFromStorage = () => {
  try {
    const farms = localStorage.getItem('agritwin_farms');
    return farms ? JSON.parse(farms) : [];
  } catch (error) {
    console.warn("Failed to get farms from local storage", error);
    return [];
  }
};

export const saveFarmsToStorage = (farms) => {
  try {
    localStorage.setItem('agritwin_farms', JSON.stringify(farms));
  } catch (error) {
    console.warn("Failed to save farms to local storage", error);
  }
};

export const getActiveFarmIdFromStorage = () => {
  return localStorage.getItem('agritwin_active_farm_id') || '';
};

export const saveActiveFarmIdToStorage = (id) => {
  localStorage.setItem('agritwin_active_farm_id', id);
};

export const getFarmerProfileFromStorage = () => {
  try {
    const profile = localStorage.getItem('agritwin_profile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    return null;
  }
};

export const saveFarmerProfileToStorage = (profile) => {
  try {
    localStorage.setItem('agritwin_profile', JSON.stringify(profile));
  } catch (error) {
    console.warn("Failed to save profile", error);
  }
};
