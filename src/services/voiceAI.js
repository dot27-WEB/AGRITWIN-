/**
 * Audio synthesis helper wrapper for the voice assistant alerts.
 */
export const speakConfirmation = (text, language) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  if (language === 'te') utterance.lang = 'te-IN';
  else if (language === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-US';
  
  window.speechSynthesis.speak(utterance);
};
