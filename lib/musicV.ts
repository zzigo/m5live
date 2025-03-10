/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    AudioWorkletNode: typeof AudioWorkletNode;
  }
}

interface Note {
  startTime: number;
  duration: number;
  frequency: number;
  amplitude: number;
  instrument: MusicVInstrument;
  p6?: number;
  p7?: number;
  p8?: number;
  p29?: number;
  p30?: number;
  oscState?: { sum: number };
  envState?: { time: number };
  [key: string]: any;
}

interface MusicVInstrument {
  id: number;
  units: { type: string; params: any }[];
  oscillators: any[];
  outputs: any[];
  [key: string]: any;
}

interface FunctionTable {
  functionNum: number;
  data: number[];
}

interface Event {
  type: string;
  time: number;
  insNum?: number;
  frequency?: number;
  amplitude?: number;
  duration?: number;
  p6?: number;
  p7?: number;
  p8?: number;
  p29?: number;
  p30?: number;
  varNum?: number;
  value?: number;
}

export class MusicV {
  private sampleRate: number = 44100;
  private parameters: Float32Array = new Float32Array(1000);
  private events: Event[] = [];
  private currentTime: number = 0;
  private instruments: Map<number, MusicVInstrument> = new Map();
  private functions: Map<number, Float32Array> = new Map();
  private currentInstrument: MusicVInstrument | null = null;
  private audioContext: globalThis.AudioContext | null = null;
  private workletNode: globalThis.AudioWorkletNode | null = null;
  private consoleOutput: string = '';
  private isServer: boolean = typeof globalThis.window === 'undefined';
  private activeNotes: Map<number, Note> = new Map();
  private pass2Report: string[] = [];
  private globalVars: Map<number, number> = new Map();

  constructor() {
    this.initDefaultFunctionTables();
    if (!this.isServer) {
      this.setupKeyboardShortcuts();
    }
  }

  private initDefaultFunctionTables(): void {
    const sineWave = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      sineWave[i] = Math.sin(2 * Math.PI * i / 512);
    }
    this.functions.set(2, sineWave);

    const straightLine = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      straightLine[i] = i / 512;
    }
    this.functions.set(1, straightLine);
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const stopKey = isMac ? (event.metaKey && event.key === '.') : (event.ctrlKey && event.key === '.');
      if (stopKey) {
        event.preventDefault();
        this.stopAndReset();
      }
    });
  }

  private stopAndReset(): void {
    try {
      if (this.audioContext) {
        if (this.workletNode) {
          this.workletNode.port.postMessage({ type: 'stop' });
          this.workletNode.disconnect();
          this.workletNode = null;
        }
        this.audioContext.suspend().then(() => {
          this.audioContext!.close();
          this.audioContext = null;
          this.activeNotes.clear();
          this.events = [];
          this.currentTime = 0;
          this.consoleOutput = '';
          console.clear();
          this.consoleOutput += 'MusicV stopped and reset\n';
        });
      } else {
        this.activeNotes.clear();
        this.events = [];
        this.currentTime = 0;
        this.consoleOutput = '';
        console.clear();
        this.consoleOutput += 'MusicV reset\n';
      }
    } catch (error: any) {
      console.error('Error during stop and reset:', error);
      this.consoleOutput += `Error during stop and reset: ${error.message}\n`;
    }
  }

  parseScore(scoreText: string): void {
    this.consoleOutput = '*** MUSIC V SCORE PROCESSING ***\n\n';
    this.events = [];
    this.instruments.clear();
    this.pass2Report = [];
    this.activeNotes.clear();
    this.globalVars.clear();

    const lines = scoreText.split('\n');
    let currentInstrumentId = -1;
    const instrumentUnitCounts = new Map<number, number>();

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      if (!line.trim() || line.trim().startsWith(';')) continue;
      if (line.trim().startsWith('COM') || line.trim().startsWith('COMMENT')) {
        this.consoleOutput += `Comment: ${line.trim().substring(line.indexOf(' ') + 1)}\n`;
        continue;
      }

      const parts = line.trim().split(/\s+/);
      const opcode = parts[0];
      const formattedLine = `${opcode.padEnd(8)}${parts.slice(1).map(p => p.padEnd(9, ' ')).join('')}`;
      this.pass2Report.push(formattedLine);

      switch (opcode) {
        case 'INS':
          if (this.currentInstrument) {
            this.consoleOutput += `Instrument ${currentInstrumentId} definition complete\n\n`;
            instrumentUnitCounts.set(currentInstrumentId, this.currentInstrument.units.length);
            this.pass2Report.push(`       ${currentInstrumentId}    ${this.currentInstrument.units.length}.000    0.000`);
          }
          const insStartTime = parseFloat(parts[1]);
          currentInstrumentId = parseInt(parts[2], 10);
          this.currentInstrument = {
            id: currentInstrumentId,
            units: [],
            oscillators: [],
            outputs: []
          };
          this.instruments.set(currentInstrumentId, this.currentInstrument);
          this.consoleOutput += `Defining Instrument ${currentInstrumentId}\n`;
          break;

        case 'OSC':
          if (this.currentInstrument) {
            const freqParam = parts[1];
            const ampParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            const functionNum = parseInt(parts[4].substring(1), 10);
            const phaseParam = parts[5] || 'P30';
            const oscId = this.currentInstrument.oscillators.length + 1;
            this.currentInstrument.oscillators.push({
              id: oscId,
              type: 1,
              freqParam,
              ampParam,
              outputBus: outputBlock,
              functionTable: functionNum,
              phaseParam
            });
            this.currentInstrument.units.push({
              type: 'OSC',
              params: { freqParam, ampParam, outputBlock, functionNum, phaseParam }
            });
            this.consoleOutput += `  OSC: Freq=${freqParam}, Amp=${ampParam}, Out=B${outputBlock}, Func=F${functionNum}, Phase=${phaseParam}\n`;
          }
          break;

        case 'OUT':
          if (this.currentInstrument) {
            const inputBlock = parseInt(parts[1].substring(1), 10);
            const outputBlock = parseInt(parts[2].substring(1), 10);
            this.currentInstrument.outputs.push({ inputBus: inputBlock, outputBus: outputBlock });
            this.currentInstrument.units.push({
              type: 'OUT',
              params: { inputBlock, outputBlock, amplitude: 1.0 }
            });
            this.consoleOutput += `  OUT: In=B${inputBlock}, Out=B${outputBlock}, Amp=1\n`;
          }
          break;

        case 'AD2':
          if (this.currentInstrument) {
            const input1 = parts[1].startsWith('P') ? parts[1] : parseInt(parts[1].substring(1), 10);
            const input2 = parts[2].startsWith('P') ? parts[2] : parseInt(parts[2].substring(1), 10);
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: 'AD2',
              params: { input1, input2, outputBlock }
            });
            this.consoleOutput += `  AD2: In1=${input1}, In2=${input2}, Out=B${outputBlock}\n`;
          }
          break;

        case 'SET':
          if (this.currentInstrument) {
            const param = parts[1];
            this.currentInstrument.units.push({
              type: 'SET',
              params: { param }
            });
            this.consoleOutput += `  SET: Param=${param}\n`;
          }
          break;

        case 'MLT':
          if (this.currentInstrument) {
            const input1 = parts[1].startsWith('P') ? parts[1] : parseInt(parts[1].substring(1), 10);
            const input2 = parts[2].startsWith('P') ? parts[2] : parseInt(parts[2].substring(1), 10);
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: 'MLT',
              params: { input1, input2, outputBlock }
            });
            this.consoleOutput += `  MLT: In1=${input1}, In2=${input2}, Out=B${outputBlock}\n`;
          }
          break;

        case 'ENV':
          if (this.currentInstrument) {
            const ampParam = parts[1];
            const durParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            const functionNum = parseInt(parts[4].substring(1), 10);
            const phaseParam = parts[5] || 'P30';
            this.currentInstrument.units.push({
              type: 'ENV',
              params: { ampParam, durParam, outputBlock, functionNum, phaseParam }
            });
            this.consoleOutput += `  ENV: Amp=${ampParam}, Dur=${durParam}, Out=B${outputBlock}, Func=F${functionNum}, Phase=${phaseParam}\n`;
          }
          break;

        case 'SIA':
          const siaTime = parseFloat(parts[1]);
          const varNum = parseInt(parts[2], 10);
          const value = parseInt(parts[3], 10);
          this.globalVars.set(varNum, value);
          if (varNum === 4) this.sampleRate = value;
          this.events.push({ type: 'sia', time: siaTime, varNum, value });
          this.consoleOutput += `SIA: Time=${siaTime}, Var=${varNum}, Value=${value} (SampleRate=${this.sampleRate})\n`;
          break;

        case 'SV2':
          const sv2Time = parseFloat(parts[1]);
          const sv2VarNum = parseInt(parts[2], 10);
          const sv2Value = parseFloat(parts[3]);
          this.events.push({ type: 'sv2', time: sv2Time, varNum: sv2VarNum, value: sv2Value });
          this.consoleOutput += `SV2: Time=${sv2Time}, Var=P${sv2VarNum}, Value=${sv2Value}\n`;
          break;

        case 'END':
          if (this.currentInstrument) {
            this.consoleOutput += `Instrument ${currentInstrumentId} definition complete\n\n`;
            instrumentUnitCounts.set(currentInstrumentId, this.currentInstrument.units.length);
            this.currentInstrument = null;
          }
          break;

        case 'GEN':
          const functionNum = parseInt(parts[3], 10);
          const params = parts.slice(4).map(p => parseFloat(p));
          this.handleGenFunction(functionNum, parseInt(parts[1]), parseInt(parts[2]), params);
          this.consoleOutput += `GEN: Function=${functionNum}, Params=${params.length}\n`;
          break;

        case 'NOT':
          const notStartTime = parseFloat(parts[1]);
          const notInsNum = parseInt(parts[2], 10);
          const notAmplitude = parseFloat(parts[3]);
          const notFrequency = parseFloat(parts[4]);
          const notDuration = parseFloat(parts[5]);
          const notP6 = parts[6] ? parseFloat(parts[6]) : undefined;
          const notP7 = parts[7] ? parseFloat(parts[7]) : undefined;
          const notP8 = parts[8] ? parseFloat(parts[8]) : undefined;
          this.events.push({ 
            type: 'note', 
            time: notStartTime, 
            insNum: notInsNum, 
            frequency: notFrequency, 
            amplitude: notAmplitude, 
            duration: notDuration, 
            p6: notP6, 
            p7: notP7, 
            p8: notP8 
          });
          this.consoleOutput += `NOTE: Time=${notStartTime}, Ins=${notInsNum}, Amp=${notAmplitude}, Freq=${notFrequency}, Dur=${notDuration}${notP6 ? `, P6=${notP6}` : ''}${notP7 ? `, P7=${notP7}` : ''}${notP8 ? `, P8=${notP8}` : ''}\n`;
          break;

        case 'TER':
          const terTime = parseFloat(parts[1]);
          this.events.push({ type: 'termination', time: terTime });
          this.consoleOutput += `Termination time: ${terTime}\n\n`;
          break;

        case 'PLF':
          const plfStartTime = parseFloat(parts[1]);
          const plfSubNum = parseInt(parts[2], 10);
          const plfInsNum = parseInt(parts[3], 10);
          const plfParams = parts.slice(4).map(p => parseFloat(p));
          if (plfSubNum === 3) {
            this.handlePLF3(plfStartTime, plfInsNum, plfParams, lines, lineIndex);
          } else {
            this.consoleOutput += `PLF: Unsupported subroutine ${plfSubNum} (only PLF3 implemented)\n`;
          }
          break;

        case 'SV3': this.consoleOutput += `SV3: Set variable in Pass III (not implemented)\n`; break;
        case 'SEC': this.consoleOutput += `SEC: End section (not implemented)\n`; break;
        case 'SV1': this.consoleOutput += `SV1: Set variable in Pass I (not implemented)\n`; break;
        case 'PLS': this.consoleOutput += `PLS: Execute subroutine in Pass II (not implemented)\n`; break;
        case 'SI3': this.consoleOutput += `SI3: Set integer in Pass III (not implemented)\n`; break;
        case 'RAN': this.consoleOutput += `RAN: Random generator (not implemented)\n`; break;
        case 'STR':
          if (this.currentInstrument) {
            const inputBlock = parts[1].startsWith('B') ? parseInt(parts[1].substring(1), 10) : parts[1];
            const varParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: 'STR',
              params: { inputBlock, varParam, outputBlock }
            });
            this.consoleOutput += `  STR: In=${inputBlock}, Var=${varParam}, Out=B${outputBlock}\n`;
          }
          break;
        case 'AD3': this.consoleOutput += `AD3: Three-input adder (not implemented)\n`; break;
        case 'AD4': this.consoleOutput += `AD4: Four-input adder (not implemented)\n`; break;
        case 'FLT': this.consoleOutput += `FLT: Filter (not implemented)\n`; break;
        case 'RAH': this.consoleOutput += `RAH: Random and hold (not implemented)\n`; break;
        case 'IOS': this.consoleOutput += `IOS: Interpolating oscillator (not implemented)\n`; break;

        default:
          this.consoleOutput += `Unknown opcode: ${opcode} (skipped)\n`;
      }
    }

    this.events.sort((a, b) => a.time - b.time);
    this.processPass2();
  }

  private handlePLF3(startTime: number, insNum: number, params: number[], lines: string[], currentIndex: number): void {
    const [nnc, nn, tts, tfact, tdd] = params;
    let nextNoteLine: string | null = null;
    for (let i = currentIndex + 1; i < lines.length; i++) {
      const nextLine = lines[i].trim();
      if (nextLine && !nextLine.startsWith(';') && nextLine.startsWith('NOT')) {
        nextNoteLine = nextLine;
        break;
      }
    }
    if (!nextNoteLine) {
      this.consoleOutput += `PLF3: No following NOT card found at time ${startTime}\n`;
      return;
    }
    const noteParts = nextNoteLine.split(/\s+/).map(p => p.trim());
    const noteStart = parseFloat(noteParts[1]);
    const noteIns = parseInt(noteParts[2], 10);
    const amplitude = parseFloat(noteParts[3]);
    const frequency = parseFloat(noteParts[4]);
    const duration = parseFloat(noteParts[5]);
    const p6 = noteParts[6] ? parseFloat(noteParts[6]) : undefined;
    const p7 = noteParts[7] ? parseFloat(noteParts[7]) : undefined;
    const p8 = noteParts[8] ? parseFloat(noteParts[8]) : undefined;

    let currentTime = startTime;
    for (let ni = 0; ni < nnc; ni++) {
      for (let nj = 0; nj < nn; nj++) {
        const scaleFactor = nj + 1;
        const newP6 = p6 !== undefined ? scaleFactor * p6 : undefined;
        const newDuration = newP6 !== undefined ? newP6 : duration * scaleFactor;
        const newIns = noteIns === 1 ? noteIns : 2;
        const newFreq = tfact > 0 ? frequency * tfact : frequency;
        this.events.push({
          type: 'note',
          time: currentTime,
          insNum: newIns,
          frequency: newFreq,
          amplitude,
          duration: newDuration,
          p6: newP6,
          p7,
          p8
        });
        this.consoleOutput += `PLF3: Generated note at ${currentTime}, ins=${newIns}, freq=${newFreq}, amp=${amplitude}, dur=${newDuration}${newP6 ? `, p6=${newP6}` : ''}\n`;
      }
      currentTime += tts;
    }
  }

  private processPass2(): void {
    this.consoleOutput += '1PASS II REPORT\n0(WORD CNT)\n';
    this.pass2Report.forEach(line => this.consoleOutput += `${line}\n`);
    this.instruments.forEach((instrument, id) => {
      this.consoleOutput += `       ${id.toString().padStart(2)}    ${instrument.units.length.toFixed(3).padStart(6)}    0.000\n`;
    });

    for (const event of this.events) {
      if (event.type === 'sv2') {
        const { time, varNum, value } = event;
        for (const noteEvent of this.events) {
          if (noteEvent.type === 'note' && noteEvent.time >= time) {
            switch (varNum) {
              case 5: noteEvent.frequency = value; break;
              case 6: noteEvent.p6 = value; break;
              case 7: noteEvent.p7 = value; break;
              case 8: noteEvent.p8 = value; break;
              default: this.consoleOutput += `SV2: Unsupported varNum P${varNum}\n`; break;
            }
            this.consoleOutput += `SV2 applied at ${time}s: P${varNum}=${value} to note at ${noteEvent.time}s\n`;
          }
        }
      }
    }

    this.consoleOutput += 'END OF PASS II\n\nScore processing complete\n';
  }

  private processOscillator(unit: any, note: Note, blocks: Map<number, Float32Array>, currentTime: number): void {
    const { freqParam, ampParam, outputBlock, functionNum, phaseParam } = unit.params;
    const frequency = freqParam.startsWith('B') ? (blocks.get(parseInt(freqParam.substring(1)))?.[0] || 0) : (note[freqParam.toLowerCase()] || note.frequency || 440);
    const amplitude = ampParam.startsWith('B') ? (blocks.get(parseInt(ampParam.substring(1)))?.[0] || 0) : (note[ampParam.toLowerCase()] || note.amplitude || 0.5);
    const functionData = this.functions.get(functionNum) || this.functions.get(2)!;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    if (!note.oscState) {
      const initialPhase = phaseParam.startsWith('P') ? (note[phaseParam.toLowerCase()] || 0) : 0;
      note.oscState = { sum: initialPhase };
    }
    const tableSize = functionData.length;
    const increment = frequency * tableSize / this.sampleRate;
    note.oscState.sum += increment;
    const index = Math.floor(note.oscState.sum % (tableSize - 1));
    const value = functionData[index];
    output[0] = value * amplitude;
    if (freqParam.startsWith('B') && parseInt(freqParam.substring(1)) === outputBlock) {
      output[0] *= 0.9;
    }
  }

  private processOutput(unit: any, blocks: Map<number, Float32Array>): void {
    const { inputBlock, outputBlock, amplitude } = unit.params;
    const input = blocks.get(inputBlock)?.[0] || 0;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] += input * amplitude;
  }

  private processAd2(unit: any, note: Note, blocks: Map<number, Float32Array>): void {
    const { input1, input2, outputBlock } = unit.params;
    const input1Value = typeof input1 === 'string' ? (note[input1.toLowerCase()] || 0) : (blocks.get(input1)?.[0] || 0);
    const input2Value = typeof input2 === 'string' ? (note[input2.toLowerCase()] || 0) : (blocks.get(input2)?.[0] || 0);
    const sum = input1Value + input2Value;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] = sum;
  }

  private processSet(unit: any, note: Note, blocks: Map<number, Float32Array>, instrumentUnits: any[]): void {
    const { param } = unit.params;
    const paramValue = note[param.toLowerCase()] || 0;
    const currentIndex = instrumentUnits.findIndex(u => u === unit);
    for (let i = currentIndex + 1; i < instrumentUnits.length; i++) {
      if (instrumentUnits[i].type === 'OSC') {
        instrumentUnits[i].params.functionNum = Math.floor(paramValue) || instrumentUnits[i].params.functionNum;
        break;
      }
    }
  }

  private processMlt(unit: any, note: Note, blocks: Map<number, Float32Array>): void {
    const { input1, input2, outputBlock } = unit.params;
    const input1Value = typeof input1 === 'string' ? (note[input1.toLowerCase()] || 0) : (blocks.get(input1)?.[0] || 0);
    const input2Value = typeof input2 === 'string' ? (note[input2.toLowerCase()] || 0) : (blocks.get(input2)?.[0] || 0);
    const product = input1Value * input2Value;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] = product;
  }

  private processEnv(unit: any, note: Note, blocks: Map<number, Float32Array>, currentTime: number): void {
    const { ampParam, durParam, outputBlock, functionNum, phaseParam } = unit.params;
    const amplitude = ampParam.startsWith('B') ? (blocks.get(parseInt(ampParam.substring(1)))?.[0] || 0) : (note[ampParam.toLowerCase()] || note.amplitude || 0.5);
    const duration = durParam.startsWith('P') ? (note[durParam.toLowerCase()] || note.duration || 1) : (blocks.get(parseInt(durParam.substring(1)))?.[0] || note.duration || 1);
    const functionData = this.functions.get(functionNum) || this.functions.get(2)!;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }

    if (!note.envState) {
      const initialTime = phaseParam.startsWith('P') ? (note[phaseParam.toLowerCase()] || 0) : 0;
      note.envState = { time: initialTime };
    }

    const elapsedTime = currentTime - note.startTime;
    const t = Math.min(elapsedTime / duration, 1);
    const index = Math.floor(t * (functionData.length - 1));
    const value = functionData[index];
    output[0] = value * amplitude;
  }

  private processStr(unit: any, note: Note, blocks: Map<number, Float32Array>): void {
    const { inputBlock, outputBlock } = unit.params;
    const input = blocks.get(inputBlock)?.[0] || 0;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] += input;
  }

  private generateSample(currentTime: number, blocks: Map<number, Float32Array>): number {
    for (let i = 2; i <= 10; i++) {
      const block = blocks.get(i);
      if (block) block.fill(0);
    }

    for (const [noteNum, note] of this.activeNotes.entries()) {
      const noteEndTime = note.startTime + note.duration;
      if (currentTime >= note.startTime && currentTime <= noteEndTime) {
        const instrument = note.instrument;
        if (instrument && instrument.units) {
          for (const unit of instrument.units) {
            switch (unit.type) {
              case 'OSC': this.processOscillator(unit, note, blocks, currentTime); break;
              case 'OUT': this.processOutput(unit, blocks); break;
              case 'AD2': this.processAd2(unit, note, blocks); break;
              case 'SET': this.processSet(unit, note, blocks, instrument.units); break;
              case 'MLT': this.processMlt(unit, note, blocks); break;
              case 'ENV': this.processEnv(unit, note, blocks, currentTime); break;
              case 'STR': this.processStr(unit, note, blocks); break;
              case 'RAN': break; // Not implemented
              case 'AD3': break;
              case 'AD4': break;
              case 'FLT': break;
              case 'RAH': break;
              case 'IOS': break;
            }
          }
        }
      } else if (currentTime > noteEndTime) {
        this.activeNotes.delete(noteNum);
      }
    }

    const rawSample = blocks.get(1)?.[0] || 0;
    const masterGain = 0.5;
    return rawSample * masterGain;
  }

  async generateSound(duration: number = 8): Promise<Float32Array> {
    try {
      const numSamples = Math.floor(this.sampleRate * duration);
      const outputBuffer = new Float32Array(numSamples);
      this.currentTime = 0;
      const blocks = new Map<number, Float32Array>([[1, new Float32Array(1)]]);
      this.activeNotes.clear();
      const eventsCopy = [...this.events];

      for (let i = 0; i < numSamples; i++) {
        const currentTimeInSeconds = i / this.sampleRate;

        while (eventsCopy.length > 0 && eventsCopy[0].time <= currentTimeInSeconds) {
          const event = eventsCopy.shift()!;
          this.processEvent(event, currentTimeInSeconds);
        }

        outputBuffer[i] = this.generateSample(currentTimeInSeconds, blocks);
        this.currentTime = currentTimeInSeconds;
      }

      return outputBuffer;
    } catch (error: any) {
      console.error('Error generating sound:', error);
      this.consoleOutput += `Error generating sound: ${error.message}\n`;
      return new Float32Array(0);
    }
  }

  private processEvent(event: Event, currentTime: number): void {
    switch (event.type) {
      case 'note':
        const instrument = this.instruments.get(event.insNum!);
        if (instrument) {
          const noteNum = Date.now() + Math.random();
          const instrumentCopy = JSON.parse(JSON.stringify(instrument));
          this.activeNotes.set(noteNum, {
            instrument: instrumentCopy,
            startTime: currentTime,
            duration: event.duration!,
            frequency: event.frequency!,
            amplitude: event.amplitude!,
            p6: event.p6,
            p7: event.p7,
            p8: event.p8,
            p29: event.p29,
            p30: event.p30
          });
        } else {
          this.consoleOutput += `Error: Instrument ${event.insNum} not found\n`;
        }
        break;
      case 'sia':
        this.globalVars.set(event.varNum!, event.value!);
        if (event.varNum === 4) this.sampleRate = event.value!;
        break;
      case 'sv2':
        // Handled in processPass2
        break;
      case 'termination':
        this.activeNotes.clear();
        break;
    }
  }

  async initAudio(): Promise<void> {
  if (!this.audioContext) {
    try {
      if (this.isServer) throw new Error('Cannot initialize audio in server environment');
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate, latencyHint: 'interactive' });

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const workletPaths = [
        '/musicVWorklet.js',
        './musicVWorklet.js',
        '../musicVWorklet.js',
        'musicVWorklet.js'
      ];
      
      let workletLoaded = false;
      let lastError: Error | null = null;
      
      for (const workletUrl of workletPaths) {
        if (workletLoaded) break;
        try {
          await this.audioContext.audioWorklet.addModule(workletUrl);
          workletLoaded = true;
        } catch (error) {
          console.warn(`Failed to load worklet from ${workletUrl}:`, error);
          lastError = error as Error;
        }
      }
      
      if (!workletLoaded) {
        throw new Error(`Failed to load worklet from any path: ${lastError?.message || 'Unknown error'}`);
      }

      this.workletNode = new AudioWorkletNode(this.audioContext, 'music-v-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2], // Stereo output
        processorOptions: { sampleRate: this.sampleRate }
      });

      this.workletNode.connect(this.audioContext.destination);

      // [Rest of the method unchanged]
    } catch (error: any) {
      console.error('Failed to initialize audio:', error);
      this.consoleOutput += `Failed to initialize audio: ${error.message || 'Unknown error'}\n`;
      throw new Error(`Failed to initialize audio: ${error.message || 'Unknown error'}`);
    }
  } else if (this.audioContext.state === 'suspended') {
    await this.audioContext.resume();
  }
}

  async play(): Promise<void> {
    try {
      if (!this.audioContext) await this.initAudio();
      if (!this.audioContext || !this.workletNode) throw new Error('Audio system not properly initialized');

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      let terminationTime = 8.0;
      const terEvent = this.events.find(e => e.type === 'termination');
      if (terEvent) {
        terminationTime = terEvent.time;
      }

      this.workletNode.port.postMessage({
        type: 'play',
        events: this.events.map(e => ({ ...e })),
        currentTime: 0,
        terminationTime: terminationTime
      });

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
          this.workletNode.port.postMessage({ type: 'stop' });
        }
        this.audioContext.suspend();
        this.consoleOutput += 'Audio playback stopped\n';
      }
    } catch (error: any) {
      console.error('Failed to stop audio playback:', error);
      this.consoleOutput += `Failed to stop audio playback: ${error.message || 'Unknown error'}\n`;
    }
  }

  private handleGenFunction(functionNum: number, genType: number, normalization: number, params: number[]): void {
    const functionData = new Float32Array(512);
    if (genType === 0 || genType === 1) {
      const points = [];
      for (let i = 0; i < params.length; i += 2) {
        const value = params[i] || 0;
        const position = Math.floor(params[i + 1] || (i === params.length - 1 ? 511 : 0));
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

      this.consoleOutput += `Function table ${functionNum} created with ${points.length} points\n`;
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
      if (normalization === 1) normFactor = Math.max(Math.abs(minVal), Math.abs(maxVal));
      else if (normalization === 2) normFactor = maxVal - minVal;

      if (normFactor !== 0) {
        for (let i = 0; i < 512; i++) {
          if (normalization === 1) functionData[i] /= normFactor;
          else if (normalization === 2) functionData[i] = (functionData[i] - minVal) / normFactor;
        }
      }
    }

    this.functions.set(functionNum, functionData);
  }

  getConsoleOutput(): string {
    return this.consoleOutput;
  }

  getFunctionTables(): FunctionTable[] {
    return Array.from(this.functions.entries()).map(([functionNum, data]) => ({
      functionNum,
      data: Array.from(data)
    }));
  }
}