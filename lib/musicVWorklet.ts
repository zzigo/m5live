class MusicVProcessor extends AudioWorkletProcessor {
  private sampleRate: number = 44100;
  private currentTime: number = 0;
  private events: any[] = [];
  private activeNotes: Map<number, any> = new Map();
  private instruments: Map<number, any> = new Map();
  private functions: Map<number, Float32Array> = new Map();
  private masterGain: number = 0.5;

  constructor() {
    super();
    this.port.onmessage = (event) => {
      console.log('[Worklet] Received message:', event.data.type);
      if (event.data.type === 'init') {
        this.sampleRate = event.data.sampleRate;
        this.events = event.data.events;
        this.instruments = new Map(Object.entries(event.data.instruments));
        this.functions = new Map(Object.entries(event.data.functions).map(([k, v]) => [Number(k), new Float32Array(v as number[])]));
        this.masterGain = event.data.masterGain || 0.5;
        console.log('[Worklet] Initialized with masterGain:', this.masterGain, 'sampleRate:', this.sampleRate);
      } else if (event.data.type === 'play') {
        this.currentTime = event.data.currentTime;
        this.events = event.data.events;
        this.activeNotes.clear();
        console.log('[Worklet] Play started with', this.events.length, 'events');
      } else if (event.data.type === 'stop') {
        this.activeNotes.clear();
        console.log('[Worklet] Stopped');
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const output = outputs[0][0];
    if (!output) return true;

    const blocks = new Map<number, Float32Array>([[1, new Float32Array(1)]]);
    while (this.events.length > 0 && this.events[0].time <= this.currentTime) {
      const event = this.events.shift();
      if (event.type === 'note') {
        const instrument = this.instruments.get(event.insNum);
        if (instrument) {
          this.activeNotes.set(Date.now() + Math.random(), {
            startTime: event.time,
            duration: event.duration,
            frequency: event.frequency,
            amplitude: event.amplitude,
            p6: event.p6,
            p7: event.p7,
            p8: event.p8,
            p29: event.p29,
            p30: event.p30,
            instrument: JSON.parse(JSON.stringify(instrument))
          });
          console.log('[Worklet] Note added:', event.insNum, 'at', event.time);
        }
      } else if (event.type === 'sia') {
        if (event.varNum === 4) this.sampleRate = event.value;
        console.log('[Worklet] SIA applied: varNum=', event.varNum, 'value=', event.value, 'sampleRate=', this.sampleRate);
      } else if (event.type === 'termination' && this.currentTime >= event.time) {
        console.log('[Worklet] Reached termination time:', event.time);
        return false;
      }
    }

    for (let i = 0; i < output.length; i++) {
      const time = this.currentTime + i / this.sampleRate;
      const rawSample = this.generateSample(time, blocks);
      output[i] = rawSample * this.masterGain;
      if (time < 0.01 || Math.random() < 0.01) {
        console.log('[Worklet] Output sample at', time.toFixed(2) + 's:', 'raw=', rawSample.toFixed(4), 'gain=', this.masterGain, 'final=', output[i].toFixed(4));
      }
    }

    this.currentTime += output.length / this.sampleRate;
    return true;
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
              case 'OSC':
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
                console.log('[Worklet] Note', noteNum, 'at', currentTime.toFixed(2) + 's:', `freq=${frequency.toFixed(2)}, amp=${amplitude.toFixed(2)}, val=${value.toFixed(2)}`);
                break;
              case 'OUT':
                const { inputBlock, outputBlock: outBlock, amplitude } = unit.params;
                const input = blocks.get(inputBlock)?.[0] || 0;
                let out = blocks.get(outBlock);
                if (!out) {
                  out = new Float32Array(1);
                  blocks.set(outBlock, out);
                }
                out[0] += input * amplitude;
                break;
              case 'AD2':
                const { input1, input2, outputBlock: ad2Out } = unit.params;
                const input1Value = typeof input1 === 'string' ? (note[input1.toLowerCase()] || 0) : (blocks.get(input1)?.[0] || 0);
                const input2Value = typeof input2 === 'string' ? (note[input2.toLowerCase()] || 0) : (blocks.get(input2)?.[0] || 0);
                let ad2Output = blocks.get(ad2Out);
                if (!ad2Output) {
                  ad2Output = new Float32Array(1);
                  blocks.set(ad2Out, ad2Output);
                }
                ad2Output[0] = input1Value + input2Value;
                console.log('[Worklet] AD2 at', currentTime.toFixed(2) + 's:', `In1=${input1Value.toFixed(4)}, In2=${input2Value.toFixed(4)}, Out=${ad2Output[0].toFixed(4)}`);
                break;
              case 'SET':
                const { param } = unit.params;
                const paramValue = note[param.toLowerCase()] || 0;
                const currentIndex = instrument.units.findIndex((u: any) => u === unit);
                for (let i = currentIndex + 1; i < instrument.units.length; i++) {
                  if (instrument.units[i].type === 'OSC') {
                    instrument.units[i].params.functionNum = Math.floor(paramValue) || instrument.units[i].params.functionNum;
                    console.log(`[Worklet] SET: Updated OSC functionNum to ${instrument.units[i].params.functionNum} from ${param}`);
                    break;
                  }
                }
                break;
              case 'MLT':
                const { input1: mltIn1, input2: mltIn2, outputBlock: mltOut } = unit.params;
                const mltInput1 = typeof mltIn1 === 'string' ? (note[mltIn1.toLowerCase()] || 0) : (blocks.get(mltIn1)?.[0] || 0);
                const mltInput2 = typeof mltIn2 === 'string' ? (note[mltIn2.toLowerCase()] || 0) : (blocks.get(mltIn2)?.[0] || 0);
                let mltOutput = blocks.get(mltOut);
                if (!mltOutput) {
                  mltOutput = new Float32Array(1);
                  blocks.set(mltOut, mltOutput);
                }
                mltOutput[0] = mltInput1 * mltInput2;
                console.log('[Worklet] MLT at', currentTime.toFixed(2) + 's:', `In1=${mltInput1.toFixed(4)}, In2=${mltInput2.toFixed(4)}, Out=${mltOutput[0].toFixed(4)}`);
                break;
              case 'ENV':
                const { ampParam, durParam, outputBlock: envOut, functionNum, phaseParam } = unit.params;
                const envAmplitude = ampParam.startsWith('B') ? (blocks.get(parseInt(ampParam.substring(1)))?.[0] || 0) : (note[ampParam.toLowerCase()] || note.amplitude || 0.5);
                const envDuration = durParam.startsWith('P') ? (note[durParam.toLowerCase()] || note.duration || 1) : (blocks.get(parseInt(durParam.substring(1)))?.[0] || note.duration || 1);
                const envFunctionData = this.functions.get(functionNum) || this.functions.get(2)!;
                let envOutput = blocks.get(envOut);
                if (!envOutput) {
                  envOutput = new Float32Array(1);
                  blocks.set(envOut, envOutput);
                }
                if (!note.envState) {
                  const initialTime = phaseParam.startsWith('P') ? (note[phaseParam.toLowerCase()] || 0) : 0;
                  note.envState = { time: initialTime };
                }
                const elapsedTime = currentTime - note.startTime;
                const t = Math.min(elapsedTime / envDuration, 1);
                const envIndex = Math.floor(t * (envFunctionData.length - 1));
                const envValue = envFunctionData[envIndex];
                envOutput[0] = envValue * envAmplitude;
                console.log(`[Worklet] ENV at ${currentTime.toFixed(2)}s: Amp=${envAmplitude.toFixed(2)}, Dur=${envDuration.toFixed(2)}, T=${t.toFixed(2)}, Value=${envValue.toFixed(6)}`);
                break;
            }
          }
        }
      } else if (currentTime > noteEndTime) {
        this.activeNotes.delete(noteNum);
      }
    }

    return blocks.get(1)?.[0] || 0;
  }
}

registerProcessor('music-v-processor', MusicVProcessor);