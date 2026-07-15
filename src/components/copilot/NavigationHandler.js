/**
 * Navigation Handler for AgriTwin AI Copilot.
 * Resolves user query intents and routes them to the appropriate application page.
 */

export const handleNavigation = (intent, query, navigate) => {
  if (!query || !navigate) return null;

  const cleaned = query.trim().toLowerCase();

  // Route mapping matching the examples from instructions
  if (
    cleaned.includes('dashboard') ||
    cleaned.includes('go home') ||
    cleaned === 'home' ||
    intent === 'Dashboard'
  ) {
    navigate('/dashboard');
    return 'Navigating to Dashboard...';
  }

  if (
    cleaned.includes('weather') ||
    cleaned === 'show weather'
  ) {
    navigate('/irrigation?tab=weather');
    return 'Navigating to Weather Intelligence...';
  }

  if (
    cleaned.includes('irrigation') ||
    cleaned.includes('watering') ||
    cleaned.includes('water')
  ) {
    navigate('/irrigation');
    return 'Navigating to Smart Irrigation...';
  }

  if (
    cleaned.includes('analysis') ||
    cleaned.includes('intelligence') ||
    cleaned.includes('crop') ||
    cleaned.includes('suggest') ||
    cleaned.includes('recommend') ||
    cleaned.includes('health')
  ) {
    navigate('/crops');
    return 'Navigating to Farm Intelligence...';
  }

  // Fallback check based on intent
  if (intent === 'Weather') {
    navigate('/irrigation?tab=weather');
    return 'Navigating to Weather Intelligence...';
  }
  if (intent === 'Smart Irrigation') {
    navigate('/irrigation');
    return 'Navigating to Smart Irrigation...';
  }
  if (intent === 'Crop Recommendation' || intent === 'Farm Analysis') {
    navigate('/crops');
    return 'Navigating to Farm Intelligence...';
  }

  return null;
};

export default handleNavigation;
