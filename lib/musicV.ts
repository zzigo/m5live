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
    
    const lines = scoreText.split('\n');
    
    let currentInstrument: any = null;
    let currentInstrumentId = -1;
    let wordCount = 0;
    
    const instrumentUnitCounts = new Map<number, number>();
    const pass2Report: string[] = [];
    let pass2WordCount = 0;

    for (const line of lines) {
      if (!line.trim()) continue;
      
      if (line.trim().startsWith('COM') || line.trim().startsWith('COMMENT')) {
        this.consoleOutput += `Comment: ${line.trim().substring(line.trim().indexOf(' ') + 1)}\n`;
        continue;
      }
      
      if (line.trim().startsWith(';')) continue;
      
      const parts = line.trim().split(/\s+/);
      const opcode = parts[0];
      wordCount += parts.length;
      pass2WordCount += parts.length;

      // Format parameters for PASS II report
      const paramStr = parts.slice(1).map(p => p.padEnd(9, ' ')).join('');
      const formattedLine = `${opcode.padEnd(8)}${paramStr}`;

      if (opcode === 'INS') {
        if (currentInstrument) {
          this.consoleOutput += `Instrument ${currentInstrumentId} definition complete\n\n`;
          instrumentUnitCounts.set(currentInstrumentId, currentInstrument.units.length);
          pass2Report.push(`       ${currentInstrumentId}    ${currentInstrument.units.length}.000    0.000`);
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
        pass2Report.push(formattedLine);
      } 
      else if (opcode === 'OSC' && currentInstrument) {
        const freqParam = parts[1];
        const ampParam = parts[2];
        const outputBus = parseInt(parts[3].substring(1), 10);
        const functionTable = parseInt(parts[4].substring(1), 10);
        const phaseParam = parts.length > 5 ? parts[5] : 'P30';
        
        const oscId = currentInstrument.oscillators.length + 1;
        currentInstrument.oscillators.push({
          id: oscId,
          type: 1,
          freqParam,
          ampParam,
          outputBus,
          functionTable,
          phaseParam
        });
        
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
        pass2Report.push(formattedLine);
      } 
      else if (opcode === 'OUT' && currentInstrument) {
        const inputBus = parseInt(parts[1].substring(1), 10);
        const outputBus = parseInt(parts[2].substring(1), 10);
        
        currentInstrument.outputs.push({
          inputBus,
          outputBus
        });
        
        currentInstrument.units.push({
          type: 'OUT',
          params: {
            inputBlock: inputBus,
            outputBlock: outputBus,
            amplitude: 1.0
          }
        });
        
        this.consoleOutput += `  OUT: Input Bus=${inputBus}, Output Bus=${outputBus}, Amp=1\n`;
        pass2Report.push(formattedLine);
      } 
      else if (opcode === 'END' && currentInstrument) {
        this.consoleOutput += `Instrument ${currentInstrumentId} definition complete\n\n`;
        instrumentUnitCounts.set(currentInstrumentId, currentInstrument.units.length);
        pass2Report.push(formattedLine);
        currentInstrument = null;
      } 
      else if (opcode === 'GEN') {
        const p1 = parseInt(parts[1], 10);
        const actionTime = parseFloat(parts[2]);
        const functionNum = parseInt(parts[3], 10);
        
        const params = [];
        for (let i = 4; i < parts.length; i++) {
          if (parts[i] === ';') break;
          params.push(parseFloat(parts[i]));
        }
        
        this.consoleOutput += `GEN: Function=${functionNum}, Params=${params.length}\n`;
        this.handleGenFunction(functionNum, 0, 0, params);
        pass2Report.push(formattedLine);
      }
      else if (opcode === 'NOT') {
        const startTime = parseFloat(parts[1]);
        const instrumentId = parseInt(parts[2], 10);
        const noteAmplitude = parseFloat(parts[3]);
        const frequency = parseFloat(parts[4]);
        const duration = parseFloat(parts[5]);
        
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
        pass2Report.push(formattedLine);
      }
      else if (opcode === 'TER') {
        const terminationTime = parseFloat(parts[1]);
        
        this.events.push({
          type: 'termination',
          time: terminationTime
        });
        
        console.log(`Added termination event at ${terminationTime}s`);
        this.consoleOutput += `Termination time: ${terminationTime}\n\n`;
        pass2Report.push(formattedLine);
      }
    }
    
    this.events.sort((a, b) => a.time - b.time);
    
    // Enhanced PASS II Report
    this.consoleOutput += '1PASS II REPORT\n';
    this.consoleOutput += '0(WORD CNT)\n';
    pass2Report.forEach(line => {
      this.consoleOutput += `${line}\n`;
    });
    instrumentUnitCounts.forEach((unitCount, id) => {
      this.consoleOutput += `       ${id.toString().padStart(2)}    ${unitCount.toFixed(3).padStart(6)}    0.000\n`;
    });
    this.consoleOutput += `END OF PASS II\n\n`;
    this.consoleOutput += 'Score processing complete\n';
  }

  private handleGenFunction(functionNum: number, genType: number, normalization: number, params: number[]): void {
    const functionData = new Float32Array(512);
    
    if (genType === 0) {
      const points = [];
      for (let i = 0; i < params.length; i += 2) {
        const value = params[i] || 0;
        const position = Math.floor(params[i + 1]);
        
        if (position >= 0 && position < 512) {
          points.push({ position, value });
          this.consoleOutput += `  Point: val=${value}, pos=${position}\n`;
        }
      }
      
      points.sort((a, b) => a.position - b.position);
      
      if (points.length < 2) {
        if (points.length === 0) {
          points.push({ position: 0, value: 0 });
          points.push({ position: 511, value: 0 });
        } else {
          points.push({ position: 511, value: points[0].value });
        }
      }
      
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        
        const startPos = startPoint.position;
        const endPos = endPoint.position;
        const startVal = startPoint.value;
        const endVal = endPoint.value;
        
        for (let pos = startPos; pos <= endPos; pos++) {
          const t = (endPos === startPos) ? 0 : (pos - startPos) / (endPos - startPos);
          functionData[pos] = startVal * (1 - t) + endVal * t;
        }
      }
      
      this.consoleOutput += `  Function table ${functionNum} created with ${points.length} points\n`;
      console.log(`F${functionNum} sample values: [0]=${functionData[0]}, [50]=${functionData[50]}, [205]=${functionData[205]}, [306]=${functionData[306]}, [461]=${functionData[461]}, [511]=${functionData[511]}`);
    } else {
      for (let i = 0; i < 512; i++) {
        functionData[i] = Math.sin(2 * Math.PI * i / 512);
      }
      this.consoleOutput += `Warning: GEN type ${genType} not supported, using sine wave\n`;
    }
    
    if (normalization > 0) {
      let minVal = Infinity;
      let maxVal = -Infinity;
      
      for (let i = 0; i < 512; i++) {
        minVal = Math.min(minVal, functionData[i]);
        maxVal = Math.max(maxVal, functionData[i]);
      }
      
      let normFactor = 1;
      if (normalization === 1) {
        normFactor = Math.max(Math.abs(minVal), Math.abs(maxVal));
      } else if (normalization === 2) {
        const range = maxVal - minVal;
        normFactor = range;
      }
      
      if (normFactor !== 0) {
        for (let i = 0; i < 512; i++) {
          if (normalization === 1) {
            functionData[i] /= normFactor;
          } else if (normalization === 2) {
            functionData[i] = (functionData[i] - minVal) / normFactor;
          }
        }
      }
    }
    
    this.functions.set(functionNum, functionData);
    console.log(`Created function table F${functionNum} with ${functionData.length} points`);
  }

  async generateSound(duration: number = 8): Promise<Float32Array> {
    try {
      const numSamples = Math.floor(this.sampleRate * duration);
      const outputBuffer = new Float32Array(numSamples);
      
      this.currentTime = 0;
      this.events.sort((a, b) => a.time - b.time);
      
      for (let i = 0; i < numSamples; i++) {
        const currentTimeInSeconds = i / this.sampleRate;
        
        while (this.events.length > 0 && this.events[0].time <= currentTimeInSeconds) {
          const event = this.events.shift();
          if (event) {
            this.processEvent(event, currentTimeInSeconds);
          }
        }
        
        const blocks = new Map<number, Float32Array>();
        blocks.set(1, new Float32Array(1));
        
        outputBuffer[i] = this.generateSample(currentTimeInSeconds, blocks);
        
        if (currentTimeInSeconds < 0.01 || Math.random() < 0.01) {
          console.log(`Sample at ${currentTimeInSeconds.toFixed(3)}s: ${outputBuffer[i].toFixed(6)}`);
        }
        
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
          const noteNum = Date.now();
          const instrumentCopy = JSON.parse(JSON.stringify(instrument));
          
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
    for (let i = 2; i <= 10; i++) {
      const block = blocks.get(i);
      if (block) {
        block.fill(0);
      }
    }
    
    for (const [noteNum, note] of this.activeNotes.entries()) {
      const noteEndTime = note.startTime + note.duration;
      
      if (currentTime >= note.startTime && currentTime <= noteEndTime) {
        const instrument = note.instrument;
        
        if (instrument && instrument.units) {
          for (const unit of instrument.units) {
            switch (unit.type) {
              case 'OSC':
                this.processOscillator(unit, note, blocks, currentTime);
                break;
              case 'OUT':
                this.processOutput(unit, blocks);
                break;
            }
          }
        }
      } else if (currentTime > noteEndTime) {
        this.activeNotes.delete(noteNum);
      }
    }
    
    const outputBlock = blocks.get(1);
const rawSample = outputBlock ? outputBlock[0] : 0;
  const masterGain = 0.0001; // Test with 0 and 1 later
  const finalSample = rawSample * masterGain;  
  
// Debug logging
  if (currentTime < 0.01 || Math.random() < 0.01) {
    console.log(`Sample at ${currentTime.toFixed(3)}s: raw=${rawSample.toFixed(6)}, gain=${masterGain}, final=${finalSample.toFixed(6)}`);
  }
  
  return finalSample;
}
  
private processOscillator(unit: any, note: any, blocks: Map<number, Float32Array>, currentTime: number): void {
  const params = unit.params;
  const functionNum = params.functionNum || 2;
  const outputBlockNum = params.outputBlock || 2;
  
  const functionData = this.functions.get(functionNum) || this.functions.get(2)!;
  
  let outputBlock = blocks.get(outputBlockNum);
  if (!outputBlock) {
    outputBlock = new Float32Array(1);
    blocks.set(outputBlockNum, outputBlock);
  }
  
  const amplitude = note.amplitude || 0.5;
  const frequency = note.frequency || 440;
  
  if (!note.oscState) {
    note.oscState = { sum: 0 };
  }
  
  const increment = 0.02555 * frequency;
  note.oscState.sum += increment;
  const index = Math.floor(note.oscState.sum % 511);
  const value = functionData[index];
  
  outputBlock[0] = value * amplitude;
  if (currentTime < 0.01 || Math.random() < 0.01) {
    console.log(`OSC at ${currentTime.toFixed(2)}s: Freq=${frequency.toFixed(2)}, Amp=${amplitude.toFixed(2)}, Value=${value.toFixed(6)}, Output=${outputBlock[0].toFixed(6)}`);
  }
}

  //MASTER VOLUME
private generateSample(currentTime: number, blocks: Map<number, Float32Array>): number {
  for (let i = 2; i <= 10; i++) {
    const block = blocks.get(i);
    if (block) {
      block.fill(0);
    }
  }
  
  console.log(`Generating sample at ${currentTime.toFixed(2)}s, Active notes: ${this.activeNotes.size}`);
  
  for (const [noteNum, note] of this.activeNotes.entries()) {
    const noteEndTime = note.startTime + note.duration;
    
    if (currentTime >= note.startTime && currentTime <= noteEndTime) {
      const instrument = note.instrument;
      
      if (instrument && instrument.units) {
        for (const unit of instrument.units) {
          switch (unit.type) {
            case 'OSC':
              this.processOscillator(unit, note, blocks, currentTime);
              break;
            case 'OUT':
              this.processOutput(unit, blocks);
              break;
          }
        }
      }
    } else if (currentTime > noteEndTime) {
      this.activeNotes.delete(noteNum);
    }
  }
  
  const outputBlock = blocks.get(1);
  const rawSample = outputBlock ? outputBlock[0] : 0;
  const masterGain = 0.0; // Increased to 0.5 for testing audibility
  const finalSample = rawSample * masterGain;
  
  if (currentTime < 0.01 || Math.random() < 0.01) {
    console.log(`Sample at ${currentTime.toFixed(2)}s: Raw=${rawSample.toFixed(6)}, Gain=${masterGain}, Final=${finalSample.toFixed(6)}`);
  }
  
  return finalSample;
}
  
  private processOutput(unit: any, blocks: Map<number, Float32Array>): void {
    const params = unit.params;
    const inputBlockNum = params.inputBlock || 2;
    const outputBlockNum = params.outputBlock || 1;
    const amplitude = params.amplitude || 1.0;
    
    const inputBlock = blocks.get(inputBlockNum);
    let outputBlock = blocks.get(outputBlockNum);
    
    if (!inputBlock) {
      blocks.set(inputBlockNum, new Float32Array(1));
      return;
    }
    
    if (!outputBlock) {
      outputBlock = new Float32Array(1);
      blocks.set(outputBlockNum, outputBlock);
    }
    
    outputBlock[0] += inputBlock[0] * amplitude;
  }

  async initAudio(): Promise<void> {
    if (!this.audioContext) {
      try {
        console.log('Initializing audio context...');
        
        if (this.isServer) {
          throw new Error('Cannot initialize audio in server environment');
        }
        
        this.audioContext = new AudioContext({ 
          sampleRate: this.sampleRate,
          latencyHint: 'interactive'
        });
        
        console.log('Audio context created with sample rate:', this.audioContext.sampleRate);
        
        if (this.audioContext.state === 'suspended') {
          console.log('Audio context is suspended, attempting to resume...');
          await this.audioContext.resume();
          console.log('Audio context resumed successfully');
        }
        
        const workletUrl = '/musicVWorklet.js';
        console.log('Loading worklet from URL:', workletUrl);
        
        try {
          await this.audioContext.audioWorklet.addModule(workletUrl);
          console.log('Worklet module loaded successfully!');
        } catch (workletError: any) {
          console.error('Failed to load worklet module:', workletError);
          const fallbackUrl = './musicVWorklet.js';
          console.log('Trying fallback URL:', fallbackUrl);
          await this.audioContext.audioWorklet.addModule(fallbackUrl);
          console.log('Worklet module loaded successfully from fallback URL!');
        }
        
        console.log('Creating AudioWorkletNode with processor name: music-v-processor');
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
        
        this.workletNode.onprocessorerror = (error: ErrorEvent) => {
          console.error('Worklet processor error:', error);
          this.consoleOutput += `Audio processing error: ${error.message || 'Unknown error'}\n`;
        };
        
        let terminationTime = 8.0;
        const terEvent = this.events.find(e => e.type === 'termination');
        if (terEvent) {
          terminationTime = terEvent.time;
          console.log(`Found termination time for init: ${terminationTime}s`);
        }
        
        console.log('Sending initialization data to worklet...');
        this.workletNode.port.postMessage({
          type: 'init',
          events: this.events.map(e => ({...e})),
          instruments: Object.fromEntries(this.instruments),
          functions: Array.from(this.functions).reduce((obj, [key, value]) => {
            obj[key] = Array.from(value);
            return obj;
          }, {} as Record<string, number[]>),
          sampleRate: this.sampleRate,
          terminationTime: terminationTime
        });
        
        console.log('Initialization data sent to worklet');
      } catch (error: any) {
        console.error('Failed to initialize audio:', error);
        this.consoleOutput += `Failed to initialize audio: ${error.message || 'Unknown error'}\n`;
        throw new Error(`Failed to initialize audio: ${error.message || 'Unknown error'}`);
      }
    } else if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('Existing audio context resumed');
    }
  }

  async play(): Promise<void> {
    try {
      if (!this.audioContext) {
        await this.initAudio();
      }
      
      if (!this.audioContext || !this.workletNode) {
        throw new Error('Audio system not properly initialized');
      }
      
      if (this.audioContext.state === 'suspended') {
        console.log('Resuming audio context for playback...');
        await this.audioContext.resume();
        console.log('Audio context resumed:', this.audioContext.state);
      }
      
      let terminationTime = 8.0;
      const terEvent = this.events.find(e => e.type === 'termination');
      if (terEvent) {
        terminationTime = terEvent.time;
        console.log(`Found termination time: ${terminationTime}s`);
      }
      
      console.log(`Sending ${this.events.length} events to worklet:`);
      this.events.forEach((e, i) => {
        console.log(`Event ${i}: ${e.type} at ${e.time}s: ${e.type === 'note' ? `ins=${e.insNum}, freq=${e.frequency}, amp=${e.amplitude}, dur=${e.duration}` : ''}`);
      });
      
      this.workletNode.port.postMessage({
        type: 'play',
        events: this.events.map(e => ({...e})),
        currentTime: 0,
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

  stop(): void {
    try {
      if (this.audioContext) {
        if (this.workletNode) {
          this.workletNode.port.postMessage({
            type: 'stop'
          });
        }
        
        this.audioContext.suspend();
        console.log('Audio playback stopped');
        this.consoleOutput += 'Audio playback stopped\n';
      }
    } catch (error: any) {
      console.error('Failed to stop audio playback:', error);
      this.consoleOutput += `Failed to stop audio playback: ${error.message || 'Unknown error'}\n`;
    }
  }

  getConsoleOutput(): string {
    return this.consoleOutput;
  }
  
  getFunctionTables(): FunctionTable[] {
    const tables: FunctionTable[] = [];
    this.functions.forEach((data, functionNum) => {
      tables.push({
        functionNum,
        data: Array.from(data)
      });
    });
    return tables;
  }
}