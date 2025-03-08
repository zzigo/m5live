// Add webkitAudioContext to Window interface for older browsers
interface Window {
  webkitAudioContext: typeof AudioContext;
} 