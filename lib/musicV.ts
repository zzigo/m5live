/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// MusicV implementation based on the original MUSIC V specification
declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    AudioWorkletNode: typeof AudioWorkletNode;
  }
}

// Define types for MusicV
interface MusicVInstrument {
  id: number;
  units: any[];
  [key: string]: any; // Allow for additional properties
}

// Define interface for function table data
interface FunctionTable {
  functionNum: number;
  data: number[];
}

export class MusicV {
  private sampleRate: number = 44100;
  private parameters: Float32Array;
  private events: any[] = [];
  private currentTime: number = 0;
  private instruments: Map<number, MusicVInstrument> = new Map();
  private functions: Map<number, Float32Array> = new Map(); // Stored functions F1-F10
  private currentInstrument: MusicVInstrument | null = null;
  private audioContext: globalThis.AudioContext | null = null;
  private workletNode: globalThis.AudioWorkletNode | null = null;
  private consoleOutput: string = '';
  private isServer: boolean = typeof globalThis.window === 'undefined';
  private activeNotes: Map<number, any> = new Map();

  constructor() {
    this.sampleRate = 44100;
    this.currentTime = 0;
    this.events = [];
    this.instruments = new Map();
    this.functions = new Map();
    this.activeNotes = new Map();
    this.consoleOutput = '';
    this.parameters = new Float32Array(1000); // Initialize parameters array
    
    // Initialize default function tables
    this.initDefaultFunctionTables();
  }
  
  private initDefaultFunctionTables(): void {
    // Create F2 - Sine wave
    const sineWave = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      sineWave[i] = Math.sin(2 * Math.PI * i / 512);
    }
    this.functions.set(2, sineWave);
    
    // Create F1 - Straight line (for testing)
    const straightLine = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      straightLine[i] = i / 512;
    }
    this.functions.set(1, straightLine);
  }

  // Parse score text into events (simplified version of Pass1)
  parseScore(scoreText: string): void {
    this.consoleOutput = '';
    this.consoleOutput += '*** MUSIC V SCORE PROCESSING ***\n\n';
    
    // Split the score into lines
    const lines = scoreText.split('\n');
    
    // Process each line
    let currentInstrument: any = null;
    let currentInstrumentId = -1;
    let wordCount = 0;
    
    // Track instruments and their unit counts for the PASS II report
    const instrumentUnitCounts = new Map<number, number>();
    
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) {
        continue;
      }
      
      // Handle comments (COM or COMMENT)
      if (line.trim().startsWith('COM') || line.trim().startsWith('COMMENT')) {
        this.consoleOutput += `Comment: ${line.trim().substring(line.trim().indexOf(' ') + 1)}\n`;
        continue;
      }
      
      // Skip lines that are just comments (;)
      if (line.trim().startsWith(';')) {
        continue;
      }
      
      // Split the line into parts
      const parts = line.trim().split(/\s+/);
      const opcode = parts[0];
      wordCount += parts.length;
      
      // Handle different opcodes
      if (opcode === 'INS') {
        // INS P1 P2
        // P1: Instrument number
        // P2: Instrument type (optional)
        
        // If we were defining an instrument, finalize it
        if (currentInstrument) {
          this.consoleOutput += `Instrument ${currentInstrumentId} definition complete\n\n`;
          instrumentUnitCounts.set(currentInstrumentId, currentInstrument.units.length);
        }
        
        currentInstrumentId = parseInt(parts[1], 10);
        currentInstrument = {
          id: currentInstrumentId,
          units: [],
          oscillators: [],
          outputs: []
        };
        
        this.consoleOutput += `Defining Instrument ${currentInstrumentId}\n`;
        this.instruments.set(currentInstrumentId, currentInstrument);
      } 
      else if (opcode === 'OSC' && currentInstrument) {
        // OSC P5 P6 B2 F2 P30
        // P5: Frequency parameter number (P-field)
        // P6: Amplitude parameter number (P-field)
        // B2: Output bus number
        // F2: Function table number
        // P30: Initial phase parameter (optional)
        
        const freqParam = parts[1];
        const ampParam = parts[2];
        const outputBus = parseInt(parts[3].substring(1), 10); // Remove 'B' prefix
        const functionTable = parseInt(parts[4].substring(1), 10); // Remove 'F' prefix
        const phaseParam = parts.length > 5 ? parts[5] : 'P30';
        
        // Add oscillator to instrument
        const oscId = currentInstrument.oscillators.length + 1;
        currentInstrument.oscillators.push({
          id: oscId,
          type: 1, // Default to sine
          freqParam,
          ampParam,
          outputBus,
          functionTable,
          phaseParam
        });
        
        // Add as unit generator
        currentInstrument.units.push({
          type: 'OSC',
          params: {
            freqParam,
            ampParam,
            outputBlock: outputBus,
            functionNum: functionTable,
            phaseParam
          }
        });
        
        this.consoleOutput += `  OSC: Type=1, Freq=${freqParam}, Amp=${ampParam}, Phase=${phaseParam}, Bus=${outputBus}, Function=${functionTable}\n`;
      } 
      else if (opcode === 'OUT' && currentInstrument) {
        // OUT B2 B1
        // B2: Input bus number
        // B1: Output bus number
        
        const inputBus = parseInt(parts[1].substring(1), 10); // Remove 'B' prefix
        const outputBus = parseInt(parts[2].substring(1), 10); // Remove 'B' prefix
        
        currentInstrument.outputs.push({
          inputBus,
          outputBus
        });
        
        // Add as unit generator
        currentInstrument.units.push({
          type: 'OUT',
          params: {
            inputBlock: inputBus,
            outputBlock: outputBus,
            amplitude: 1.0 // Default amplitude
          }
        });
        
        this.consoleOutput += `  OUT: Input Bus=${inputBus}, Output Bus=${outputBus}, Amp=1\n`;
      } 
      else if (opcode === 'END' && currentInstrument) {
        this.consoleOutput += `Instrument ${currentInstrumentId} definition complete\n\n`;
        instrumentUnitCounts.set(currentInstrumentId, currentInstrument.units.length);
        currentInstrument = null;
      } 
      else if (opcode === 'GEN') {
        // GEN P1 P2 P3 P4 P5 P6 P7 ...
        // Format: GEN P1 P2 P3 [P4 P5 P6 P7 ...] ;
        // P1: Not used currently
        // P2: Action time (not used currently)
        // P3: Function table number to generate (F1, F2, etc.)
        // P4, P5, P6, ... : Pairs of (value, time) for the function table
        //                   where value is in range [-1, 1] and time is in range [0, 512]
        
        const p1 = parseInt(parts[1], 10);
        const actionTime = parseFloat(parts[2]);
        const functionNum = parseInt(parts[3], 10);
        
        // Extract the value-time pairs
        const params = [];
        for (let i = 4; i < parts.length; i++) {
          if (parts[i] === ';') break;
          params.push(parseFloat(parts[i]));
        }
        
        this.consoleOutput += `GEN: Function=${functionNum}, Params=${params.length}\n`;
        this.handleGenFunction(functionNum, 0, 0, params);
      }
      else if (opcode === 'NOT') {
        // NOT P1 P2 P3 P4 P5
        // Original format: NOT startTime insNum amplitude frequency duration
        // P1: Start time
        // P2: Instrument number
        // P3: Amplitude
        // P4: Frequency
        // P5: Duration
        
        const startTime = parseFloat(parts[1]);
        const instrumentId = parseInt(parts[2], 10);
        const noteAmplitude = parseFloat(parts[3]);
        const frequency = parseFloat(parts[4]);
        const duration = parseFloat(parts[5]);
        
        // Add note start event
        this.events.push({
          type: 'note',
          time: startTime,
          insNum: instrumentId,
          frequency,
          amplitude: noteAmplitude,
          duration
        });
        
        console.log(`Added note event: Start=${startTime}, Ins=${instrumentId}, Amp=${noteAmplitude}, Freq=${frequency}, Dur=${duration}`);
        this.consoleOutput += `Note: Start=${startTime}, Ins=${instrumentId}, Amp=${noteAmplitude}, Freq=${frequency}, Dur=${duration}\n`;
      }
      else if (opcode === 'TER') {
        // TER P1
        // P1: Termination time
        const terminationTime = parseFloat(parts[1]);
        
        // Add termination event
        this.events.push({
          type: 'termination',
          time: terminationTime
        });
        
        console.log(`Added termination event at ${terminationTime}s`);
        this.consoleOutput += `Termination time: ${terminationTime}\n\n`;
      }
    }
    
    // Sort events by time
    this.events.sort((a, b) => a.time - b.time);
    
    // Add PASS II style output
    this.consoleOutput += 'PASS II REPORT\n';
    this.consoleOutput += '(WORD CNT)\n';
    
    // Format the instrument unit counts in the style of the original PASS II output
    instrumentUnitCounts.forEach((unitCount, id) => {
      // Format with proper spacing to match original output
      this.consoleOutput += `       ${id}    ${unitCount}.000    0.000\n`;
    });
    
    this.consoleOutput += 'END OF PASS II\n\n';
    this.consoleOutput += 'Score processing complete\n';
  }
  
  // Handle GEN function definition
  private handleGenFunction(functionNum: number, genType: number, normalization: number, params: number[]): void {
    // Create a function table with 512 points
    const functionData = new Float32Array(512);
    
    // Process based on GEN type
    if (genType === 0) {
      // GEN type 0: Line segments between specified points
      // Params are pairs of (value, time)
      
      // First, set the values at the specified positions
      const points = [];
      for (let i = 0; i < params.length; i += 2) {
        const value = params[i] || 0;
        const position = Math.floor(params[i + 1]);
        
        // Ensure position is within bounds
        if (position >= 0 && position < 512) {
          points.push({ position, value });
          // Debug output for troubleshooting
          this.consoleOutput += `  Point: val=${value}, pos=${position}\n`;
        }
      }
      
      // Sort points by position
      points.sort((a, b) => a.position - b.position);
      
      // Ensure we have at least two points
      if (points.length < 2) {
        // Add default points if needed
        if (points.length === 0) {
          points.push({ position: 0, value: 0 });
          points.push({ position: 511, value: 0 });
        } else {
          // If we have only one point, duplicate it at the end
          points.push({ position: 511, value: points[0].value });
        }
      }
      
      // Interpolate between points
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        
        const startPos = startPoint.position;
        const endPos = endPoint.position;
        const startVal = startPoint.value;
        const endVal = endPoint.value;
        
        // Linear interpolation between points
        for (let pos = startPos; pos <= endPos; pos++) {
          const t = (endPos === startPos) ? 0 : (pos - startPos) / (endPos - startPos);
          functionData[pos] = startVal * (1 - t) + endVal * t;
        }
      }
      
      // Debug output for the first few and last few values
      this.consoleOutput += `  Function table ${functionNum} created with ${points.length} points\n`;
      this.consoleOutput += `  Function table values (sample): [0]=${functionData[0].toFixed(3)}, [50]=${functionData[50].toFixed(3)}, [205]=${functionData[205].toFixed(3)}, [306]=${functionData[306].toFixed(3)}, [461]=${functionData[461].toFixed(3)}, [511]=${functionData[511].toFixed(3)}\n`;
    } else {
      // Default to sine wave for unsupported GEN types
      for (let i = 0; i < 512; i++) {
        functionData[i] = Math.sin(2 * Math.PI * i / 512);
      }
      this.consoleOutput += `Warning: GEN type ${genType} not supported, using sine wave\n`;
    }
    
    // Apply normalization if requested
    if (normalization > 0) {
      // Find min and max values
      let minVal = Infinity;
      let maxVal = -Infinity;
      
      for (let i = 0; i < 512; i++) {
        minVal = Math.min(minVal, functionData[i]);
        maxVal = Math.max(maxVal, functionData[i]);
      }
      
      // Calculate normalization factor
      let normFactor = 1;
      if (normalization === 1) {
        // Normalize to range [-1, 1]
        normFactor = Math.max(Math.abs(minVal), Math.abs(maxVal));
      } else if (normalization === 2) {
        // Normalize to range [0, 1]
        const range = maxVal - minVal;
        normFactor = range;
      }
      
      // Apply normalization
      if (normFactor !== 0) {
        for (let i = 0; i < 512; i++) {
          if (normalization === 1) {
            // Normalize to range [-1, 1]
            functionData[i] /= normFactor;
          } else if (normalization === 2) {
            // Normalize to range [0, 1]
            functionData[i] = (functionData[i] - minVal) / normFactor;
          }
        }
      }
    }
    
    // Store the function
    this.functions.set(functionNum, functionData);
    
    // Debug output
    console.log(`Created function table F${functionNum} with ${functionData.length} points`);
  }

  // Generate audio samples (simplified version of Pass3)
  async generateSound(duration: number = 8): Promise<Float32Array> {
    try {
      // Create a buffer for the output
      const numSamples = Math.floor(this.sampleRate * duration);
      const outputBuffer = new Float32Array(numSamples);
      
      // Reset time
      this.currentTime = 0;
      
      // Sort events by time
      this.events.sort((a, b) => a.time - b.time);
      
      // Process each sample
      for (let i = 0; i < numSamples; i++) {
        // Process any events that should occur at this time
        const currentTimeInSeconds = i / this.sampleRate;
        
        // Check for events that should be processed at this time
        while (this.events.length > 0 && this.events[0].time <= currentTimeInSeconds) {
          const event = this.events.shift();
          if (event) {
            this.processEvent(event, currentTimeInSeconds);
          }
        }
        
        // Generate the sample for this time
        const blocks = new Map<number, Float32Array>();
        blocks.set(1, new Float32Array(1)); // Initialize output block B1
        
        outputBuffer[i] = this.generateSample(currentTimeInSeconds, blocks);
        
        // Update time
        this.currentTime = currentTimeInSeconds;
      }
      
      return outputBuffer;
    } catch (error: any) {
      console.error('Error generating sound:', error);
      this.consoleOutput += `Error generating sound: ${error.message}\n`;
      return new Float32Array(0);
    }
  }

  private processEvent(event: any, currentTime: number): void {
    const { type, insNum } = event;
    
    switch (type) {
      case 'note':
        const instrument = this.instruments.get(insNum);
        if (instrument) {
          // Create a copy of the instrument for this note
          const noteNum = Date.now(); // Unique ID for this note
          const instrumentCopy = JSON.parse(JSON.stringify(instrument));
          
          // Add to active notes with all necessary properties
          this.activeNotes.set(noteNum, {
            instrument: instrumentCopy,
            startTime: currentTime,
            duration: event.duration,
            frequency: event.frequency,
            amplitude: event.amplitude
          });
          
          console.log(`Note started: Instrument=${insNum}, Freq=${event.frequency}, Amp=${event.amplitude}`);
        } else {
          this.consoleOutput += `Error: Instrument ${insNum} not found\n`;
        }
        break;
    }
  }

  private generateSample(currentTime: number, blocks: Map<number, Float32Array>): number {
    // Clear all blocks except B1 (output)
    for (let i = 2; i <= 10; i++) {
      const block = blocks.get(i);
      if (block) {
        block.fill(0);
      }
    }
    
    // Process all active notes
    for (const [noteNum, note] of this.activeNotes.entries()) {
      const noteEndTime = note.startTime + note.duration;
      
      if (currentTime >= note.startTime && currentTime <= noteEndTime) {
        const instrument = note.instrument;
        
        if (instrument && instrument.units) {
          // Process each unit generator in the instrument
          for (const unit of instrument.units) {
            switch (unit.type) {
              case 'OSC':
                this.processOscillator(unit, note, blocks, currentTime);
                break;
                
              case 'OUT':
                this.processOutput(unit, blocks);
                break;
                
              // Add other unit generators as needed
            }
          }
        }
      } else if (currentTime > noteEndTime) {
        // Remove note if it's finished
        this.activeNotes.delete(noteNum);
      }
    }
    
    // Return the sample from the output block (B1)
    const outputBlock = blocks.get(1);
    return outputBlock ? outputBlock[0] : 0;
  }
  
  private processOscillator(unit: any, note: any, blocks: Map<number, Float32Array>, currentTime: number): void {
    // Implement the oscillator algorithm as described in the specification
    // OSC P5 P6 B2 F2 P30
    const params = unit.params;
    const functionNum = params.functionNum || 2; // Default to F2
    const outputBlockNum = params.outputBlock || 2; // Default to B2
    
    // Get the function data
    const functionData = this.functions.get(functionNum);
    if (!functionData) {
      // If function table doesn't exist, create a default sine wave
      const defaultFunction = new Float32Array(512);
      for (let i = 0; i < 512; i++) {
        defaultFunction[i] = Math.sin(2 * Math.PI * i / 512);
      }
      this.functions.set(functionNum, defaultFunction);
    }
    
    // Get the output block
    let outputBlock = blocks.get(outputBlockNum);
    if (!outputBlock) {
      // Create the output block if it doesn't exist
      outputBlock = new Float32Array(1);
      blocks.set(outputBlockNum, outputBlock);
    }
    
    // Get amplitude and frequency directly from the note object
    // These were set in processEvent
    const amplitude = note.amplitude || 0.5;
    const frequency = note.frequency || 440;
    
    // Log values for debugging
    if (currentTime < 0.01 || Math.abs(currentTime - Math.floor(currentTime * 10) / 10) < 0.001) {
      console.log(`OSC at ${currentTime.toFixed(2)}s: Freq=${frequency.toFixed(2)}, Amp=${amplitude.toFixed(2)}, Block=${outputBlockNum}, Func=${functionNum}`);
    }
    
    // Initialize oscillator state if needed
    if (!note.oscState) {
      note.oscState = { sum: 0 };
    }
    
    // Calculate the increment for the oscillator
    // I2 = 0.02555 * freq as per the specification
    const increment = 0.02555 * frequency;
    
    // Update the oscillator state
    note.oscState.sum += increment;
    
    // Calculate the index into the function table
    // [S_i]mod 511 as per the specification
    const index = Math.floor(note.oscState.sum % 511);
    
    // Get the value from the function table
    const functionTable = this.functions.get(functionNum) || new Float32Array(512);
    const value = functionTable[index];
    
    // Scale by amplitude and store in output block
    outputBlock[0] = value * amplitude;
  }
  
  private processOutput(unit: any, blocks: Map<number, Float32Array>): void {
    // Implement the output unit as described in the specification
    // OUT B2 B1
    const params = unit.params;
    const inputBlockNum = params.inputBlock || 2; // Default to B2
    const outputBlockNum = params.outputBlock || 1; // Default to B1
    const amplitude = params.amplitude || 1.0; // Default amplitude
    
    // Get the input and output blocks
    const inputBlock = blocks.get(inputBlockNum);
    let outputBlock = blocks.get(outputBlockNum);
    
    if (!inputBlock) {
      // Input block not found, create an empty one
      blocks.set(inputBlockNum, new Float32Array(1));
      return;
    }
    
    if (!outputBlock) {
      // Output block not found, create it
      outputBlock = new Float32Array(1);
      blocks.set(outputBlockNum, outputBlock);
    }
    
    // Add the input to the output (allows combining multiple instruments)
    outputBlock[0] += inputBlock[0] * amplitude;
  }

  // Initialize audio context and worklet
  async initAudio(): Promise<void> {
    if (!this.audioContext) {
      try {
        console.log('Initializing audio context...');
        
        // Check if we're in a browser environment
        if (this.isServer) {
          throw new Error('Cannot initialize audio in server environment');
        }
        
        // Create audio context with proper sample rate
        this.audioContext = new AudioContext({ 
          sampleRate: this.sampleRate,
          latencyHint: 'interactive'
        });
        
        console.log('Audio context created with sample rate:', this.audioContext.sampleRate);
        
        // Resume audio context if needed (for browsers that require user interaction)
        if (this.audioContext.state === 'suspended') {
          console.log('Audio context is suspended, attempting to resume...');
          try {
            await this.audioContext.resume();
            console.log('Audio context resumed successfully');
          } catch (resumeError) {
            console.warn('Could not resume audio context:', resumeError);
            console.warn('Audio may not play until user interacts with the page');
          }
        }
        
        // Load worklet module with absolute path
        const workletUrl = '/musicVWorklet.js';
        console.log('Loading worklet from URL:', workletUrl);
        
        try {
          await this.audioContext.audioWorklet.addModule(workletUrl);
          console.log('Worklet module loaded successfully!');
        } catch (workletError: any) {
          console.error('Failed to load worklet module:', workletError);
          
          // Try with a different URL as fallback
          try {
            const fallbackUrl = './musicVWorklet.js';
            console.log('Trying fallback URL:', fallbackUrl);
            await this.audioContext.audioWorklet.addModule(fallbackUrl);
            console.log('Worklet module loaded successfully from fallback URL!');
          } catch (fallbackError) {
            console.error('Failed to load worklet module from fallback URL:', fallbackError);
            throw new Error(`Worklet loading failed: ${workletError.message}`);
          }
        }
        
        // Create and connect worklet node
        console.log('Creating AudioWorkletNode with processor name: music-v-processor');
        try {
          this.workletNode = new AudioWorkletNode(this.audioContext, 'music-v-processor', {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [1],
            processorOptions: {
              sampleRate: this.sampleRate
            }
          });
          
          this.workletNode.connect(this.audioContext.destination);
          console.log('AudioWorkletNode connected to destination');
          
          // Handle worklet errors
          this.workletNode.onprocessorerror = (error: ErrorEvent) => {
            console.error('Worklet processor error:', error);
            this.consoleOutput += `Audio processing error: ${error.message || 'Unknown error'}\n`;
          };
          
          // Find termination time from events
          let terminationTime = 8.0; // Default to 8 seconds
          const terEvent = this.events.find(e => e.type === 'termination');
          if (terEvent) {
            terminationTime = terEvent.time;
            console.log(`Found termination time for init: ${terminationTime}s`);
          }
          
          console.log('Sending initialization data to worklet...');
          // Initialize worklet with events and instruments
          this.workletNode.port.postMessage({
            type: 'init',
            events: this.events.map(e => ({...e})), // Create a deep copy of events
            instruments: Object.fromEntries(this.instruments),
            functions: Array.from(this.functions).reduce((obj, [key, value]) => {
              obj[key] = Array.from(value);
              return obj;
            }, {} as Record<string, number[]>),
            sampleRate: this.sampleRate,
            terminationTime: terminationTime
          });
          
          console.log('Initialization data sent to worklet');
        } catch (nodeError: any) {
          console.error('Failed to create or connect AudioWorkletNode:', nodeError);
          throw new Error(`AudioWorkletNode creation failed: ${nodeError.message}`);
        }
        
        console.log('Audio initialization complete!');
      } catch (error: any) {
        console.error('Failed to initialize audio:', error);
        this.consoleOutput += `Failed to initialize audio: ${error.message || 'Unknown error'}\n`;
        throw new Error(`Failed to initialize audio: ${error.message || 'Unknown error'}`);
      }
    } else {
      // Audio context already exists, just resume it if needed
      if (this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
          console.log('Existing audio context resumed');
        } catch (resumeError) {
          console.warn('Could not resume existing audio context:', resumeError);
        }
      }
    }
  }

  // Start audio playback
  async play(): Promise<void> {
    try {
      // Initialize audio if not already initialized
      if (!this.audioContext) {
        await this.initAudio();
      }
      
      // Make sure we have a valid audio context and worklet node
      if (!this.audioContext || !this.workletNode) {
        throw new Error('Audio system not properly initialized');
      }
      
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        console.log('Resuming audio context for playback...');
        await this.audioContext.resume();
        console.log('Audio context resumed:', this.audioContext.state);
      }
      
      // Find termination time from events
      let terminationTime = 8.0; // Default to 8 seconds
      const terEvent = this.events.find(e => e.type === 'termination');
      if (terEvent) {
        terminationTime = terEvent.time;
        console.log(`Found termination time: ${terminationTime}s`);
      }
      
      // Log the events being sent to the worklet
      console.log(`Sending ${this.events.length} events to worklet:`);
      this.events.forEach((e, i) => {
        console.log(`Event ${i}: ${e.type} at ${e.time}s: ${e.type === 'note' ? `ins=${e.insNum}, freq=${e.frequency}, amp=${e.amplitude}, dur=${e.duration}` : ''}`);
      });
      
      // Send play command to worklet
      this.workletNode.port.postMessage({
        type: 'play',
        events: this.events.map(e => ({...e})), // Create a deep copy of events
        currentTime: 0, // Always start from the beginning
        terminationTime: terminationTime
      });
      
      console.log('Play command sent to audio worklet');
      this.consoleOutput += 'Audio playback started\n';
    } catch (error: any) {
      console.error('Failed to start audio playback:', error);
      this.consoleOutput += `Failed to start audio playback: ${error.message || 'Unknown error'}\n`;
      throw new Error(`Failed to start audio playback: ${error.message || 'Unknown error'}`);
    }
  }

  // Stop audio playback
  stop(): void {
    try {
      if (this.audioContext) {
        // Send stop command to worklet if available
        if (this.workletNode) {
          this.workletNode.port.postMessage({
            type: 'stop'
          });
        }
        
        // Suspend audio context
        this.audioContext.suspend();
        console.log('Audio playback stopped');
        this.consoleOutput += 'Audio playback stopped\n';
      }
    } catch (error: any) {
      console.error('Failed to stop audio playback:', error);
      this.consoleOutput += `Failed to stop audio playback: ${error.message || 'Unknown error'}\n`;
    }
  }

  // Get console output for display
  getConsoleOutput(): string {
    return this.consoleOutput;
  }
  
  // Get all function tables for visualization
  getFunctionTables(): FunctionTable[] {
    const tables: FunctionTable[] = [];
    this.functions.forEach((data, functionNum) => {
      tables.push({
        functionNum,
        data: Array.from(data) // Convert Float32Array to regular array for easier handling
      });
    });
    return tables;
  }
} 