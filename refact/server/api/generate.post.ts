import { MusicV } from '..musicV/';
import { defineEventHandler, readBody, setHeader, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { score } = body;

    if (!score) {
      throw createError({
        statusCode: 400,
        message: 'Score is required'
      });
    }

    // Create MusicV instance and generate sound
    const musicV = new MusicV();

    try {
      musicV.parseScore(score);
    } catch (parseError: any) {
      console.error('Error parsing score:', parseError);
      throw createError({
        statusCode: 400,
        message: `Failed to parse score: ${parseError?.message || 'Unknown error'}`
      });
    }

    try {
      // Get console output for display
      const consoleOutput = musicV.getConsoleOutput();

      // Generate audio data
      const audioData = await musicV.generateSound();
      const wavData = createWavFile(audioData);

      // Set response headers
      setHeader(event, 'Content-Type', 'application/json');
      setHeader(event, 'Content-Length', JSON.stringify({
        audio: Array.from(new Uint8Array(wavData)),
        console: consoleOutput
      }).length);

      return {
        audio: Array.from(new Uint8Array(wavData)),
        console: consoleOutput
      };
    } catch (generateError: any) {
      console.error('Error generating sound:', generateError);
      throw createError({
        statusCode: 500,
        message: `Failed to generate sound: ${generateError?.message || 'Unknown error'}`
      });
    }
  } catch (error: any) {
    console.error('Error in generate endpoint:', error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || 'Failed to process request'
    });
  }
});

function createWavFile(audioData: Float32Array): ArrayBuffer {
  const numChannels = 1;
  const sampleRate = 44100;
  const bitsPerSample = 32;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = audioData.length * bytesPerSample;
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true); // Format: IEEE float
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write audio data
  const offset = 44;
  for (let i = 0; i < audioData.length; i++) {
    view.setFloat32(offset + i * 4, audioData[i], true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
} 