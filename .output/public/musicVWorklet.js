console.log('[MusicVWorklet] Script loaded');

class MusicVProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    console.log('[MusicVProcessor] Constructor called');
    this.sampleRate = 44100;
    this.currentTime = 0;
    this.events = [];
    this.activeNotes = new Map();
    this.instruments = new Map();
    this.functions = new Map();
    this.isPlaying = false;
    this.terminationTime = 8.0; // Default termination time
    
    this.port.onmessage = (event) => {
      console.log('[Worklet] Received message:', event.data.type);
      
      if (event.data.type === 'init') {
        console.log('[Worklet] Received init message');
        this.events = event.data.events || [];
        
        // Convert instruments from object to Map
        if (event.data.instruments) {
          Object.entries(event.data.instruments).forEach(([key, value]) => {
            this.instruments.set(parseInt(key), value);
          });
        }
        
        // Convert functions from object to Map with Float32Array
        if (event.data.functions) {
          Object.entries(event.data.functions).forEach(([key, value]) => {
            this.functions.set(parseInt(key), new Float32Array(value));
          });
        }
        
        this.sampleRate = event.data.sampleRate || 44100;
        
        // Find termination time from events
        if (event.data.terminationTime) {
          this.terminationTime = event.data.terminationTime;
        } else {
          // Look for TER event
          const terEvent = this.events.find(e => e.type === 'termination');
          if (terEvent) {
            this.terminationTime = terEvent.time;
          }
        }
        
        console.log(`[Worklet] Initialization complete. Termination time: ${this.terminationTime}s`);
      }
      else if (event.data.type === 'play') {
        console.log('[Worklet] Received play command');
        this.events = event.data.events || this.events;
        this.currentTime = event.data.currentTime || 0;
        
        if (event.data.terminationTime) {
          this.terminationTime = event.data.terminationTime;
        }
        
        this.isPlaying = true;
        console.log(`[Worklet] Playback started. Events: ${this.events.length}, Current time: ${this.currentTime}s, Termination: ${this.terminationTime}s`);
      }
      else if (event.data.type === 'stop') {
        console.log('[Worklet] Received stop command');
        this.isPlaying = false;
        this.activeNotes.clear();
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0][0];
    if (!output) return true;
    
    // If not playing, output silence
    if (!this.isPlaying) {
      output.fill(0);
      return true;
    }
    
    // Stop if we've reached the termination time
    if (this.currentTime >= this.terminationTime) {
      console.log(`[Worklet] Reached termination time (${this.terminationTime}s), stopping playback`);
      this.isPlaying = false;
      output.fill(0);
      return true;
    }

    // Process events that should occur at this time
    while (this.events.length > 0 && this.events[0].time <= this.currentTime) {
      const event = this.events.shift();
      this.processEvent(event);
    }

    // Generate audio for this block
    for (let i = 0; i < output.length; i++) {
      // Generate sample using the simpler approach from the previous version
      output[i] = this.generateSample(this.currentTime);
      
      // Log occasional samples for debugging
      if (Math.random() < 0.0001) {
        console.log(`[Worklet] Output sample at ${this.currentTime.toFixed(2)}s: ${output[i].toFixed(4)}`);
      }
      
      // Increment time
      this.currentTime += 1 / this.sampleRate;
      
      // Stop if we've reached the termination time
      if (this.currentTime >= this.terminationTime) {
        console.log(`[Worklet] Reached termination time (${this.terminationTime}s) during block processing`);
        // Fill the rest of the buffer with zeros
        for (let j = i + 1; j < output.length; j++) {
          output[j] = 0;
        }
        this.isPlaying = false;
        break;
      }
    }

    return true;
  }

  processEvent(event) {
    if (!event) return;
    
    if (event.type === 'termination') {
      console.log(`[Worklet] Processing termination event at ${event.time}s`);
      this.terminationTime = event.time;
      return;
    }
    
    if (event.type === 'note') {
      const { insNum, time, frequency, amplitude, duration } = event;
      const instrument = this.instruments.get(insNum);
      
      // Log the note parameters for debugging
      console.log(`[Worklet] Processing note: time=${time}, insNum=${insNum}, freq=${frequency}, amp=${amplitude}, dur=${duration}`);
      
      // Add to active notes with all necessary properties
      const noteId = Date.now() + Math.random(); // Unique ID for this note
      this.activeNotes.set(noteId, {
        startTime: time,
        duration: duration,
        frequency: frequency,
        amplitude: amplitude,
        instrument: instrument,
        oscState: { sum: 0 } // Initialize oscillator state
      });
      
      console.log(`[Worklet] Note started: ID=${noteId}, Instrument=${insNum}, Freq=${frequency}, Amp=${amplitude}`);
    }
  }

  generateSample(currentTime) {
    let sample = 0;
    
    // Process all active notes
    for (const [noteId, note] of this.activeNotes.entries()) {
      const noteEndTime = note.startTime + note.duration;
      
      if (currentTime >= note.startTime && currentTime <= noteEndTime) {
        // Calculate envelope
        let envelope = 1.0;
        const noteProgress = (currentTime - note.startTime) / note.duration;
        
        // Simple ADSR envelope
        if (noteProgress < 0.1) {
          // Attack (0-10%)
          envelope = noteProgress / 0.1;
        } else if (noteProgress > 0.8) {
          // Release (80-100%)
          envelope = (1.0 - noteProgress) / 0.2;
        }
        
        // Generate sound using simple sine wave synthesis
        const phase = 2 * Math.PI * note.frequency * (currentTime - note.startTime);
        const value = Math.sin(phase);
        
        // Apply amplitude and envelope
        sample += value * note.amplitude * envelope;
        
        // Occasionally log for debugging
        if (Math.random() < 0.00001) {
          console.log(`[Worklet] Note ${noteId} at ${currentTime.toFixed(2)}s: freq=${note.frequency}, amp=${note.amplitude}, env=${envelope.toFixed(2)}, val=${value.toFixed(2)}`);
        }
      } else if (currentTime > noteEndTime) {
        // Remove note if it's finished
        this.activeNotes.delete(noteId);
        console.log(`[Worklet] Note ended: ${noteId}`);
      }
    }
    
    // Apply master gain to prevent clipping
    return Math.max(-0.8, Math.min(0.8, sample));
  }
}

// Make sure to register the processor
try {
  console.log('[MusicVWorklet] Registering processor: music-v-processor');
  registerProcessor('music-v-processor', MusicVProcessor);
  console.log('[MusicVWorklet] Processor registered successfully');
} catch (error) {
  console.error('[MusicVWorklet] Failed to register processor:', error);
} 