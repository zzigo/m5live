class MusicVProcessor extends AudioWorkletProcessor {
  private sampleRate: number = 44100;
  private currentTime: number = 0;
  private events: any[] = [];
  private activeNotes: Map<number, any> = new Map();
  private instruments: Map<number, any> = new Map();
  private functions: Map<number, Float32Array> = new Map();
  private masterGain: number = 0.1; // Master volume control (adjustable)

constructor() {
    super();
    console.log('[Worklet] Processor constructed');
    this.port.onmessage = (event) => {
      console.log('[Worklet] Received message:', event.data.type);
      if (event.data.type === 'init') {
        console.log('[Worklet] Received init message');
        this.sampleRate = event.data.sampleRate;
        this.events = event.data.events;
        this.instruments = new Map(Object.entries(event.data.instruments));
        this.functions = new Map(
          Object.entries(event.data.functions).map(([key, value]) => [
            Number(key),
            new Float32Array(value as number[])
          ])
        );
        console.log('[Worklet] Initialization complete. Termination time:', event.data.terminationTime, 'Events:', this.events.length);
      } else if (event.data.type === 'play') {
        console.log('[Worklet] Received play command');
        this.currentTime = event.data.currentTime;
        this.events = event.data.events;
        console.log('[Worklet] Received', this.events.length, 'events');
        this.activeNotes.clear();
        console.log('[Worklet] Playback started');
      } else if (event.data.type === 'stop') {
        console.log('[Worklet] Received stop command');
        this.activeNotes.clear();
      }
    };
  }

process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const output = outputs[0][0];
    if (!output) return true;

    while (this.events.length > 0 && this.events[0].time <= this.currentTime) {
      const event = this.events.shift();
      this.processEvent(event);
    }

for (let i = 0; i < output.length; i++) {
      const time = this.currentTime + i / this.sampleRate;
      const rawSample = this.generateSample(time);
      output[i] = rawSample * this.masterGain;
      if (time < 0.01 || Math.random() < 0.01) {
        console.log('[Worklet] Output sample at', time.toFixed(2) + 's:', 'raw=', rawSample.toFixed(4), 'gain=', this.masterGain, 'final=', output[i].toFixed(4));
      }
    }

    this.currentTime += output.length / this.sampleRate;
    return true;
  }

  private processEvent(event: any): void {
    switch (event.type) {
      case 'note':
        const noteNum = Date.now();
        this.activeNotes.set(noteNum, {
          instrument: this.instruments.get(event.insNum),
          startTime: event.time,
          duration: event.duration,
          frequency: event.frequency,
          amplitude: event.amplitude,
          oscState: { sum: 0 }
        });
        console.log('[Worklet] Note started:', event.insNum, 'at', event.time, 'Freq:', event.frequency, 'Amp:', event.amplitude);
        break;
      case 'termination':
        this.activeNotes.clear();
        console.log('[Worklet] Termination at', event.time);
        break;
    }
  }

  private generateSample(currentTime: number): number {
    let sample = 0;

    for (const [noteNum, note] of this.activeNotes) {
      const noteEndTime = note.startTime + note.duration;

      if (currentTime >= note.startTime && currentTime <= noteEndTime) {
        const instrument = note.instrument;
        if (instrument && instrument.units) {
          const blocks = new Map<number, Float32Array>();
          blocks.set(1, new Float32Array(1));

          for (const unit of instrument.units) {
            if (unit.type === 'OSC') {
              const increment = 0.02555 * note.frequency;
              note.oscState.sum += increment;
              const index = Math.floor(note.oscState.sum % 511);
              const functionData = this.functions.get(unit.params.functionNum) || this.functions.get(2)!;
              const value = functionData[index];
              const outputBlock = blocks.get(unit.params.outputBlock) || new Float32Array(1);
              outputBlock[0] = value * note.amplitude; // Removed * 10
              blocks.set(unit.params.outputBlock, outputBlock);
            } else if (unit.type === 'OUT') {
              const inputBlock = blocks.get(unit.params.inputBlock) || new Float32Array(1);
              const outputBlock = blocks.get(unit.params.outputBlock) || new Float32Array(1);
              outputBlock[0] += inputBlock[0] * unit.params.amplitude;
              blocks.set(unit.params.outputBlock, outputBlock);
            }
          }
          sample += blocks.get(1)![0];
        }
      } else if (currentTime > noteEndTime) {
        this.activeNotes.delete(noteNum);
      }
    }

    return sample;
  }
}

registerProcessor('music-v-processor', MusicVProcessor);