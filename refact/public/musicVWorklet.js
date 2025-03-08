class MusicVProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sampleRate = 44100;
    this.currentTime = 0;
    this.events = [];
    this.activeNotes = new Map();
    this.instruments = new Map();
    this.functions = new Map();
    this.blocks = new Map();
    
    // Initialize blocks (B1 is output, B2-B10 for processing)
    for (let i = 1; i <= 10; i++) {
      this.blocks.set(i, new Float32Array(128).fill(0));
    }
    
    // Initialize default waveform functions
    this.initDefaultFunctions();
    
    this.port.onmessage = (event) => {
      if (event.data.type === 'init') {
        this.events = event.data.events || [];
        this.instruments = new Map(Object.entries(event.data.instruments || {}));
      }
    };
  }
  
  initDefaultFunctions() {
    // Sine wave function
    this.functions.set(1, (x) => Math.sin(2 * Math.PI * x));
    
    // Square wave function
    this.functions.set(2, (x) => {
      const t = x % 1;
      return t < 0.5 ? 1 : -1;
    });
    
    // Sawtooth wave function
    this.functions.set(3, (x) => {
      const t = x % 1;
      return 2 * t - 1;
    });
    
    // Triangle wave function
    this.functions.set(4, (x) => {
      const t = x % 1;
      return t < 0.5 ? 4 * t - 1 : 3 - 4 * t;
    });
  }
  
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channel = output[0];
    
    if (!channel) return true;
    
    // Clear all blocks for this processing cycle
    for (let i = 1; i <= 10; i++) {
      const block = this.blocks.get(i);
      if (block) {
        block.fill(0);
      }
    }
    
    // Process events that occur at the current time
    const currentEvents = this.events.filter(event => 
      event.time <= this.currentTime && event.time > this.currentTime - 128 / this.sampleRate
    );
    
    for (const event of currentEvents) {
      this.processEvent(event);
    }
    
    // Process active notes
    this.processActiveNotes(channel.length);
    
    // Copy output block (B1) to output channel
    const outputBlock = this.blocks.get(1);
    if (outputBlock) {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = outputBlock[i];
      }
    }
    
    // Increment time
    this.currentTime += channel.length / this.sampleRate;
    
    return true;
  }
  
  processEvent(event) {
    if (event.type === 'NOT') {
      const { instrumentId, frequency, amplitude, duration } = event;
      const instrument = this.instruments.get(instrumentId.toString());
      
      if (!instrument) {
        console.error(`Instrument ${instrumentId} not found`);
        return;
      }
      
      // Create a unique ID for this note
      const noteId = `${instrumentId}-${event.time}-${frequency}`;
      
      // Initialize oscillator states for this note
      const oscillatorStates = [];
      
      if (instrument.oscillators) {
        for (const osc of instrument.oscillators) {
          oscillatorStates.push({
            id: osc.id,
            type: osc.type,
            frequency,
            amplitude: osc.amplitude * amplitude,
            phase: osc.phase || 0,
            currentPhase: osc.phase || 0
          });
        }
      }
      
      // Add to active notes
      this.activeNotes.set(noteId, {
        instrumentId,
        frequency,
        amplitude,
        startTime: event.time,
        duration,
        oscillatorStates
      });
    } 
    else if (event.type === 'TER') {
      // Find the note to terminate
      for (const [noteId, note] of this.activeNotes.entries()) {
        if (note.instrumentId === event.instrumentId && 
            Math.abs(note.startTime + note.duration - event.time) < 0.001) {
          this.activeNotes.delete(noteId);
          break;
        }
      }
    }
  }
  
  processActiveNotes(numSamples) {
    for (const [noteId, note] of this.activeNotes.entries()) {
      const instrument = this.instruments.get(note.instrumentId.toString());
      
      if (!instrument) continue;
      
      // Process each oscillator in the instrument
      for (const oscState of note.oscillatorStates) {
        this.processOscillator(oscState, numSamples);
      }
      
      // Process outputs
      if (instrument.outputs) {
        for (const output of instrument.outputs) {
          this.processOutput(output, numSamples);
        }
      }
    }
  }
  
  processOscillator(oscState, numSamples) {
    const { id, type, frequency, amplitude, currentPhase } = oscState;
    const block = this.blocks.get(id + 1); // +1 because block 1 is reserved for output
    
    if (!block) return;
    
    const waveFunction = this.functions.get(type) || this.functions.get(1); // Default to sine
    
    for (let i = 0; i < numSamples; i++) {
      // Calculate the phase increment per sample
      const phaseIncrement = frequency / this.sampleRate;
      
      // Get the sample value from the wave function
      const sampleValue = waveFunction(currentPhase) * amplitude;
      
      // Add to the block
      block[i] += sampleValue;
      
      // Update phase for next sample
      oscState.currentPhase = (currentPhase + phaseIncrement) % 1;
    }
  }
  
  processOutput(output, numSamples) {
    const { bus, amplitude } = output;
    const sourceBlock = this.blocks.get(bus + 1); // +1 because block 1 is reserved for output
    const outputBlock = this.blocks.get(1); // Block 1 is the output
    
    if (!sourceBlock || !outputBlock) return;
    
    for (let i = 0; i < numSamples; i++) {
      outputBlock[i] += sourceBlock[i] * amplitude;
    }
  }
}

registerProcessor('music-v-processor', MusicVProcessor); 