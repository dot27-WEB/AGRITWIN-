/**
 * Intent Classifier for AgriTwin AI Copilot.
 * Classifies user text inputs into predefined semantic intents.
 */

export const classifyIntent = (query) => {
  if (!query) return 'Unknown';

  const cleaned = query.trim().toLowerCase();

  // 1. Greetings
  const greetingKeywords = [
    'hello', 'hi', 'hey', 'namaste', 'greetings', 'hola', 'good morning', 
    'good afternoon', 'good evening', 'namaskar', 'pranam', 'vanakkam'
  ];
  if (greetingKeywords.some(keyword => cleaned === keyword || cleaned.startsWith(keyword + ' ') || cleaned.endsWith(' ' + keyword))) {
    return 'Greeting';
  }

  // 2. Navigation Commands (Specific actions like "open", "go to", "navigate to")
  const navigationTriggers = ['open', 'go to', 'navigate to', 'show page', 'take me to', 'switch to'];
  const hasNavTrigger = navigationTriggers.some(trigger => cleaned.includes(trigger));

  // 3. Page specific checks
  const isDashboard = cleaned === 'dashboard' || cleaned === 'home' || cleaned === 'go home' || cleaned === 'return to dashboard';
  
  const isWeatherNav = cleaned.includes('weather') && (hasNavTrigger || cleaned.startsWith('weather') || cleaned === 'weather');
  const isIrrigationNav = (cleaned.includes('irrigation') || cleaned.includes('watering')) && (hasNavTrigger || cleaned === 'smart irrigation' || cleaned === 'irrigation');
  const isAnalysisNav = (cleaned.includes('analysis') || cleaned.includes('intelligence')) && (hasNavTrigger || cleaned === 'farm analysis' || cleaned === 'farm intelligence' || cleaned === 'analysis dashboard');

  if (isDashboard) return 'Dashboard';
  if (isWeatherNav || isIrrigationNav || isAnalysisNav) return 'Navigation';

  // 4. Weather Queries
  if (
    cleaned.includes('weather') || 
    cleaned.includes('forecast') || 
    cleaned.includes('rain') || 
    cleaned.includes('temperature') || 
    cleaned.includes('humidity') || 
    cleaned.includes('wind') || 
    cleaned.includes('temp') ||
    cleaned.includes('irrigate today') ||
    cleaned.includes('should i irrigate') ||
    cleaned.includes('water today') ||
    cleaned.includes('rain today') ||
    cleaned.includes('precipitation')
  ) {
    return 'Weather';
  }

  // 5. Smart Irrigation Questions
  if (
    cleaned.includes('how much water') || 
    cleaned.includes('water amount') || 
    cleaned.includes('water requirement') || 
    cleaned.includes('water should i use') ||
    cleaned.includes('liters needed') ||
    cleaned.includes('irrigation requirement')
  ) {
    return 'Smart Irrigation';
  }

  // 6. Crop Recommendations
  if (
    cleaned.includes('next crop') || 
    cleaned.includes('crop suggestion') || 
    cleaned.includes('recommend next crop') || 
    cleaned.includes('suggest crop') ||
    cleaned.includes('recommend crop') ||
    cleaned.includes('grow next') ||
    cleaned.includes('crop recommendation')
  ) {
    return 'Crop Recommendation';
  }

  // 7. Farm Questions / Analysis
  if (
    cleaned.includes('farm health') || 
    cleaned.includes('previous crop') || 
    cleaned.includes('prev crop') ||
    cleaned.includes('health score') || 
    cleaned.includes('farm analysis') ||
    cleaned.includes('farm intelligence') ||
    cleaned.includes('soil fertility') ||
    cleaned.includes('soil score')
  ) {
    return 'Farm Analysis';
  }

  // If a generic page name is typed directly without triggers
  if (cleaned.includes('weather')) return 'Weather';
  if (cleaned.includes('irrigation')) return 'Smart Irrigation';
  if (cleaned.includes('crops') || cleaned.includes('crop')) return 'Crop Recommendation';
  if (cleaned.includes('analysis') || cleaned.includes('intelligence')) return 'Farm Analysis';

  return 'Unknown';
};

export default classifyIntent;
