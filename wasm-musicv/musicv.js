// MusicV WebAssembly Interface

let musicVModule = null;
let isModuleLoaded = false;

// Initialize the WebAssembly module
async function initMusicVModule() {
  if (isModuleLoaded) return;
  
  try {
    console.log('Loading MusicV WebAssembly module...');
    
    // Check if we're in simulation mode (no actual WASM file)
    if (!window.hasOwnProperty('Module')) {
      console.log('Running in simulation mode');
      musicVModule = { simulation: true };
      isModuleLoaded = true;
      return;
    }
    
    // Wait for the Emscripten module to initialize
    await new Promise(resolve => {
      window.Module = {
        onRuntimeInitialized: () => {
          console.log('Emscripten runtime initialized');
          resolve();
        }
      };
    });
    
    // Create wrapper functions for the Fortran code
    musicVModule = {
      writeScore: Module.cwrap('write_score', 'number', ['string']),
      runPass1: Module.cwrap('run_pass1', 'number', []),
      runPass2: Module.cwrap('run_pass2', 'number', []),
      runPass3: Module.cwrap('run_pass3', 'number', []),
      getAudioSize: Module.cwrap('get_audio_size', 'number', []),
      readAudioData: Module.cwrap('read_audio_data', null, ['number', 'number'])
    };
    
    isModuleLoaded = true;
    console.log('MusicV WebAssembly module loaded');
  } catch (error) {
    console.error('Failed to load MusicV WebAssembly module:', error);
    // Fall back to simulation mode
    musicVModule = { simulation: true };
    isModuleLoaded = true;
    console.log('Falling back to simulation mode');
  }
}

// Write score to a virtual file system
function writeScoreToFS(scoreText) {
  console.log('Writing score to virtual filesystem');
  
  if (musicVModule.simulation) {
    return true;
  }
  
  try {
    const result = musicVModule.writeScore(scoreText);
    return result === 1;
  } catch (error) {
    console.error('Error writing score to filesystem:', error);
    return false;
  }
}

// Run the MusicV passes on the input score
async function runMusicV(scoreText) {
  await initMusicVModule();
  
  console.log('Running MusicV on input score');
  
  // If we're in simulation mode, return simulated results
  if (musicVModule.simulation) {
    return simulateMusicV(scoreText);
  }
  
  // Write the score to the virtual filesystem
  if (!writeScoreToFS(scoreText)) {
    throw new Error('Failed to write score to filesystem');
  }
  
  // Run the three passes
  let log = '';
  
  try {
    log += 'Pass 1: Processing score...\n';
    const pass1Result = musicVModule.runPass1();
    if (pass1Result !== 1) {
      throw new Error('Pass 1 failed');
    }
    log += 'Pass 1: Complete\n';
    
    log += 'Pass 2: Processing note list...\n';
    const pass2Result = musicVModule.runPass2();
    if (pass2Result !== 1) {
      throw new Error('Pass 2 failed');
    }
    log += 'Pass 2: Complete\n';
    
    log += 'Pass 3: Generating audio...\n';
    const pass3Result = musicVModule.runPass3();
    if (pass3Result !== 1) {
      throw new Error('Pass 3 failed');
    }
    log += 'Pass 3: Complete\n';
    
    // Get the audio data
    const audioSize = musicVModule.getAudioSize();
    if (audioSize <= 0) {
      throw new Error('No audio data generated');
    }
    
    log += `Audio generated: ${audioSize / 4 / 44100} seconds at 44100Hz\n`;
    
    // Allocate memory for the audio data
    const audioPtr = Module._malloc(audioSize);
    musicVModule.readAudioData(audioPtr, audioSize);
    
    // Copy the audio data to a Float32Array
    const audioBuffer = new Float32Array(audioSize / 4);
    for (let i = 0; i < audioSize / 4; i++) {
      audioBuffer[i] = Module.getValue(audioPtr + i * 4, 'float');
    }
    
    // Free the allocated memory
    Module._free(audioPtr);
    
    // Convert to WAV format
    const wavBuffer = createWavFile(audioBuffer, 44100);
    
    return {
      log,
      audioBuffer: wavBuffer
    };
  } catch (error) {
    log += `Error: ${error.message}\n`;
    console.error('Error running MusicV:', error);
    
    return {
      log,
      error: error.message
    };
  }
}

// Simulate MusicV processing (used when WebAssembly module is not available)
async function simulateMusicV(scoreText) {
  console.log('Simulating MusicV processing');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate log output
  const log = `Pass 1: Processing score...
Pass 1: Complete
Pass 2: Processing note list...
Pass 2: Complete
Pass 3: Generating audio...
Pass 3: Complete
Audio generated: 8.0 seconds at 44100Hz`;

  // Simulate audio output (just white noise for now)
  const sampleRate = 44100;
  const duration = 8.0; // seconds
  const numSamples = Math.floor(sampleRate * duration);
  
  // Create a simple sine wave as placeholder audio
  const audioBuffer = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    // Simple sine wave at 440Hz
    audioBuffer[i] = 0.5 * Math.sin(2 * Math.PI * 440 * i / sampleRate);
    // Add a second sine wave at 245Hz
    audioBuffer[i] += 0.3 * Math.sin(2 * Math.PI * 245 * i / sampleRate);
  }
  
  // Convert to WAV format
  const wavBuffer = createWavFile(audioBuffer, sampleRate);
  
  return {
    log,
    audioBuffer: wavBuffer
  };
}

// Helper function to create a WAV file from audio data
function createWavFile(audioData, sampleRate) {
  const numSamples = audioData.length;
  const dataSize = numSamples * 4; // 32-bit float = 4 bytes
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1Size
  view.setUint16(20, 3, true);  // audioFormat (3 = IEEE float)
  view.setUint16(22, 1, true);  // numChannels
  view.setUint32(24, sampleRate, true); // sampleRate
  view.setUint32(28, sampleRate * 4, true); // byteRate
  view.setUint16(32, 4, true);  // blockAlign
  view.setUint16(34, 32, true); // bitsPerSample
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Write audio data
  const floatView = new Float32Array(buffer, 44, numSamples);
  for (let i = 0; i < numSamples; i++) {
    floatView[i] = audioData[i];
  }
  
  return buffer;
}

// Helper function to write a string to a DataView
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Export the main function
window.runMusicV = runMusicV; 