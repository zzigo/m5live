// Add TypeScript declarations for AudioWorkletProcessor and registerProcessor
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor();
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

declare function registerProcessor(
  name: string,
  processorCtor: new () => AudioWorkletProcessor
): void;

class MusicVProcessor extends AudioWorkletProcessor {
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private events: any[] = [];
  private activeNotes: Map<number, any> = new Map();
  private instruments: Map<number, any> = new Map();
  private functions: Map<number, any> = new Map();
  private terminationTime: number = 8.0;
  private sampleRate: number = 44100;

  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent) => {
      console.log('[Worklet] Received message:', event.data);
      const { type, events, terminationTime } = event.data;
      
      if (type === 'play') {
        this.events = events;
        this.terminationTime = terminationTime || 8.0;
        this.currentTime = 0;
        this.isPlaying = true;
        this.activeNotes.clear();
        console.log('[Worklet] Starting playback, termination time:', this.terminationTime);
        this.port.postMessage({ type: 'status', message: 'Playback started' });
      } else if (type === 'stop') {
        this.isPlaying = false;
        this.activeNotes.clear();
        console.log('[Worklet] Stopping playback');
        this.port.postMessage({ type: 'status', message: 'Playback stopped' });
      }
    };
  }

  private processEvent(event: any) {
    if (event.type === 'note') {
      console.log(`[Worklet] Processing note event at ${this.currentTime}s:`, event);
      this.activeNotes.set(event.time, {
        frequency: event.frequency,
        amplitude: event.amplitude,
        duration: event.duration,
        startTime: this.currentTime
      });
      this.port.postMessage({ 
        type: 'noteStart',
        time: this.currentTime,
        frequency: event.frequency,
        amplitude: event.amplitude
      });
    }
  }

  private generateSample(time: number): number {
    let sample = 0;
    
    // Process active notes
    for (const [startTime, note] of this.activeNotes.entries()) {
      const noteAge = time - note.startTime;
      if (noteAge >= note.duration) {
        this.activeNotes.delete(startTime);
        this.port.postMessage({ 
          type: 'noteEnd',
          time: time,
          startTime: startTime
        });
        continue;
      }
      
      // Simple sine wave synthesis
      const frequency = note.frequency;
      const amplitude = note.amplitude;
      sample += amplitude * Math.sin(2 * Math.PI * frequency * time);
    }
    
    // Prevent clipping
    return Math.max(-1, Math.min(1, sample));
  }

  override process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
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
      this.port.postMessage({ type: 'ended', time: this.currentTime });
      return true;
    }

    // Process events that should occur at this time
    while (this.events.length > 0 && this.events[0].time <= this.currentTime) {
      const event = this.events.shift();
      this.processEvent(event);
    }

    // Generate audio for this block
    for (let i = 0; i < output.length; i++) {
      output[i] = this.generateSample(this.currentTime);
      
      // Log occasional samples for debugging
      if (Math.random() < 0.0001) {
        this.port.postMessage({ 
          type: 'debug',
          time: this.currentTime,
          value: output[i]
        });
      }
      
      this.currentTime += 1 / this.sampleRate;
      
      if (this.currentTime >= this.terminationTime) {
        console.log(`[Worklet] Reached termination time (${this.terminationTime}s) during block processing`);
        for (let j = i + 1; j < output.length; j++) {
          output[j] = 0;
        }
        this.isPlaying = false;
        this.port.postMessage({ type: 'ended', time: this.currentTime });
        break;
      }
    }

    return true;
  }
}

registerProcessor('music-v-processor', MusicVProcessor);