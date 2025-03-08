export const settings = {
  // Number of sessions to keep in history
  maxSessions: 10,
  
  // Output directory for generated audio files
  outputDir: '.output',
  
  // Session history directory
  historyDir: '.history',
  
  // File naming pattern for sessions
  sessionPattern: 'session-{timestamp}',
  
  // Audio file format
  audioFormat: 'wav',
  
  // Score file format
  scoreFormat: 'txt',
  
  // Default sample rate for audio
  sampleRate: 44100,
  
  // Default audio channels
  channels: 1,
  
  // Default audio bit depth
  bitDepth: 32,
  
  // Default audio encoding
  encoding: 'floating-point'
}; 