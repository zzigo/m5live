<template>
  <div class="musicv-test-container">
    <div class="editor-container">
      <div class="score-editor" :style="{ flex: scoreEditorFlex }">
        <AceEditor
          ref="scoreEditorRef"
          mode="editor"
          @keydown="handleKeyDown"
          @evaluate="evaluateSelection"
        />
        
        <div class="mini-oscilloscopes">
          <div v-for="(table, index) in functionTables" :key="index" class="mini-oscilloscope">
            <div class="mini-oscilloscope-label">F{{ table.functionNum }}</div>
            <canvas :ref="el => { if (el) canvasRefs[table.functionNum] = el as HTMLCanvasElement }" 
                    width="80" height="50" 
                    class="mini-oscilloscope-canvas">
            </canvas>
          </div>
        </div>
      </div>
      
      <div class="divider" @mousedown="startDrag"></div>
      
      <div class="console-editor" :style="{ flex: consoleEditorFlex }">
        <div class="console-header">
          <button class="clear-btn" @click="clearConsole" title="Clear console">🗑️</button>
        </div>
        <AceEditor
          ref="consoleEditorRef"
          mode="terminal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, reactive, watch } from 'vue'
import { MusicV } from '~/lib/musicV'
import AceEditor from '~/components/AceEditor.vue'

// Define the default score as a constant
const defaultScore = `
INS 0 1 ;
OSC P5 P6 B2 F2 P30;
OUT B2 B1;
END;
GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;
NOT 0 1 .50 125 8.45;
NOT .75 1 .17 250 8.45;
NOT 4.00 2 .50 500 8.46;
NOT 1.75 1 .17 1000 8.93;
NOT 2.00 1 .95 2000 10.04;
NOT 3.00 1 .95 1000 8.45;
NOT 4.00 1 .50 500 8.93;
NOT 4.75 1 .17 500 8.93;
NOT 5.00 1 .50 700 8.93;
NOT 5.75 1 .17 1000 13.39;
NOT 6.00 1 1.95 2000 12.65;
TER 8.00 ;
`;

const scoreText = ref(defaultScore);
const consoleOutput = ref('MUSIC V SCORE PROCESSING\n=======================\n')
const audioUrl = ref<string | null>(null)
const scoreEditorRef = ref<any>(null)
const consoleEditorRef = ref<any>(null)

const isDragging = ref(false)
const scoreEditorFlex = ref(0.85)
const consoleEditorFlex = ref(0.15)
const startY = ref(0)
const startScoreEditorFlex = ref(0)
const startConsoleEditorFlex = ref(0)

const functionTables = ref<Array<{functionNum: number, data: number[]}>>([])
const canvasRefs = reactive<Record<number, HTMLCanvasElement>>({})

async function waitForEditor(ref: any, timeout = 1000): Promise<ace.Ace.Editor | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const instance = ref?.value?.aceEditorInstance?.();
    if (instance) return instance;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  return null;
}
function handleKeyDown(event: KeyboardEvent) {
  if (event.altKey && event.key === 'Enter') {
    event.preventDefault();
    evaluateSelection();
  }
  
  if (event.ctrlKey && (event.key === 'p' || event.key === 'P')) {
    console.log('Ctrl+P detected, playing audio');
    event.preventDefault();
    event.stopPropagation();
    playAudio();
    return false;
  }
}

async function playAudio() {
  if (audioUrl.value) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const audioElement = new Audio(audioUrl.value);
      audioElement.volume = 0.8;
      
      audioElement.play()
        .then(() => {
          if (consoleEditorRef.value) {
            (consoleEditorRef.value as any).addTerminalOutput('Audio playback started');
          }
        })
        .catch((err: Error) => {
          console.error('Error playing audio:', err);
          if (consoleEditorRef.value) {
            (consoleEditorRef.value as any).addTerminalOutput(`Error playing audio: ${err.message}. Try clicking on the page first to enable audio.`);
          }
          fallbackAudioPlayback();
        });
    } catch (err) {
      console.error('Error creating audio element:', err);
      if (consoleEditorRef.value) {
        (consoleEditorRef.value as any).addTerminalOutput(`Error creating audio element: ${(err as Error).message}`);
      }
      fallbackAudioPlayback();
    }
  } else if (consoleEditorRef.value) {
    (consoleEditorRef.value as any).addTerminalOutput('No audio available to play');
  }
}

function fallbackAudioPlayback() {
  if (!audioUrl.value) return;
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('AudioContext not supported');
    
    const audioContext = new AudioContextClass();
    const unlockBuffer = audioContext.createBuffer(1, 1, 44100);
    const unlockSource = audioContext.createBufferSource();
    unlockSource.buffer = unlockBuffer;
    unlockSource.connect(audioContext.destination);
    unlockSource.start(0);
    
    fetch(audioUrl.value)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.8;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
        if (consoleEditorRef.value) {
          (consoleEditorRef.value as any).addTerminalOutput('Audio playback started (fallback)');
        }
      })
      .catch((err: Error) => {
        console.error('Error in fallback audio playback:', err);
        if (consoleEditorRef.value) {
          (consoleEditorRef.value as any).addTerminalOutput(`Error in fallback audio playback: ${err.message}`);
        }
      });
  } catch (err) {
    console.error('Error in fallback audio playback:', err);
    if (consoleEditorRef.value) {
      (consoleEditorRef.value as any).addTerminalOutput(`Error in fallback audio playback: ${(err as Error).message}`);
    }
  }
}

function startDrag(event: MouseEvent) {
  isDragging.value = true
  startY.value = event.clientY
  startScoreEditorFlex.value = scoreEditorFlex.value
  startConsoleEditorFlex.value = consoleEditorFlex.value
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.body.style.userSelect = 'none'
}

function onDrag(event: MouseEvent) {
  if (!isDragging.value) return
  
  const editorContainer = document.querySelector('.editor-container') as HTMLElement
  if (!editorContainer) return
  
  const containerHeight = editorContainer.clientHeight
  const deltaY = event.clientY - startY.value
  const deltaRatio = deltaY / containerHeight
  
  let newScoreEditorFlex = startScoreEditorFlex.value + deltaRatio
  let newConsoleEditorFlex = startConsoleEditorFlex.value - deltaRatio
  
  const minFlex = 0.1
  if (newScoreEditorFlex < minFlex) {
    newScoreEditorFlex = minFlex
    newConsoleEditorFlex = 1 - minFlex
  } else if (newConsoleEditorFlex < minFlex) {
    newConsoleEditorFlex = minFlex
    newScoreEditorFlex = 1 - minFlex
  }
  
  scoreEditorFlex.value = newScoreEditorFlex
  consoleEditorFlex.value = newConsoleEditorFlex
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.body.style.userSelect = ''
  
  nextTick(() => {
    if (scoreEditorRef.value) (scoreEditorRef.value as any).resize();
    if (consoleEditorRef.value) (consoleEditorRef.value as any).resize();
  })
}

onMounted(async () => {
  await nextTick();

  const scoreEditor = await waitForEditor(scoreEditorRef);
  if (scoreEditor) {
    scoreEditor.setValue(defaultScore.trim(), -1);
    scoreEditor.gotoLine(1, 0);
    scoreEditor.setOverwrite(false);
    scoreEditor.setOptions({
      fontFamily: 'Web437_IBM_MDA, monospace',
      fontSize: '12px',
    });
    scoreEditor.renderer.updateFull();
    console.log('Default score set in editor:', defaultScore.trim());
  } else {
    console.error('Score editor instance not available after timeout');
  }

  const consoleEditor = await waitForEditor(consoleEditorRef);
  if (consoleEditor) {
    clearConsole();
    consoleEditor.setOptions({
      fontFamily: 'Web437_IBM_MDA, monospace',
      fontSize: '8.4px',
    });
    consoleEditor.renderer.setStyle('line-height', '1.5');
    consoleEditor.renderer.updateFull();
  } else {
    console.error('Console editor instance not available after timeout');
  }

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
});

async function evaluateSelection() {
  try {
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
    audioUrl.value = null;
    
    let currentScore = '';
    if (scoreEditorRef.value) {
      const aceEditorInstance = (scoreEditorRef.value as any).aceEditorInstance?.();
      if (aceEditorInstance) currentScore = aceEditorInstance.getValue();
      else console.error('AceEditor instance not available during evaluation');
    }
    
    if (consoleEditorRef.value) {
      const terminalInstance = (consoleEditorRef.value as any).terminalInstance?.();
      if (terminalInstance) terminalInstance.setValue('');
    }
    
  const musicV = new MusicV();
  musicV.parseScore(currentScore);
  
  if (consoleEditorRef.value) {
    (consoleEditorRef.value as any).addTerminalOutput(musicV.getConsoleOutput());
  }
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') await audioContext.resume();
    
    await musicV.initAudio();
    await musicV.play(); // Real-time playback first
    
    if (consoleEditorRef.value) {
      (consoleEditorRef.value as any).addTerminalOutput('Real-time audio playback initialized.');
    }
  } catch (audioError) {
    console.error('Error initializing real-time audio:', audioError);
    if (consoleEditorRef.value) {
      (consoleEditorRef.value as any).addTerminalOutput(`Note: Real-time audio failed.`);
      (consoleEditorRef.value as any).addTerminalOutput(`Error: ${(audioError as Error).message}`);
    }
  }
  
  if (consoleEditorRef.value) {
    (consoleEditorRef.value as any).addTerminalOutput('Generating audio samples for WAV...');
  }
  
  const audioBuffer = await musicV.generateSound(10); // WAV generation after audioBuffer = await musicV.generateSound(10);
    
    if (consoleEditorRef.value) {
      (consoleEditorRef.value as any).addTerminalOutput(`Generated ${audioBuffer.length} audio samples`);
      let nonZeroCount = 0;
      let maxValue = 0;
      for (let i = 0; i < audioBuffer.length; i++) {
        if (Math.abs(audioBuffer[i]) > 0.0001) {
          nonZeroCount++;
          maxValue = Math.max(maxValue, Math.abs(audioBuffer[i]));
        }
      }
      (consoleEditorRef.value as any).addTerminalOutput(`Non-zero samples: ${nonZeroCount}`);
      (consoleEditorRef.value as any).addTerminalOutput(`Max amplitude: ${maxValue}`);
    }
    
    const wavBlob = createWavBlob(audioBuffer, 44100);
    audioUrl.value = URL.createObjectURL(wavBlob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `musicv-output-${timestamp}.wav`;
    
    if (consoleEditorRef.value) {
      (consoleEditorRef.value as any).addTerminalOutput('Audio generation complete.');
      (consoleEditorRef.value as any).addTerminalOutput(`Audio file stored as Blob URL: ${audioUrl.value}`);
      (consoleEditorRef.value as any).addTerminalOutput('Press Ctrl+P to play the audio.');
      (consoleEditorRef.value as any).addTerminalOutput('To save, right-click: ');
      (consoleEditorRef.value as any).addTerminalOutput(`<a href="${audioUrl.value}" download="${filename}" style="color:#ffb000;">Download ${filename}</a>`, 'html');
    }
    
    await playAudio();
    
    functionTables.value = musicV.getFunctionTables();
  } catch (error) {
    console.error('Error in evaluation:', error);
    if (consoleEditorRef.value) {
      (consoleEditorRef.value as any).addTerminalOutput(`Error: ${(error as Error).message}`);
    }
  }
}

function createWavBlob(audioData: Float32Array, sampleRate: number): Blob {
  const bufferLength = audioData.length * 2;
  const buffer = new ArrayBuffer(44 + bufferLength);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + bufferLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, bufferLength, true);

  const masterGain = 0.1; // Test with 0 and 1
  let index = 44;
  for (let i = 0; i < audioData.length; i++) {
    const rawSample = audioData[i];
    const sample = Math.max(-1, Math.min(1, rawSample * masterGain));
    const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(index, int16Sample, true);
    if (i < 10 || Math.random() < 0.01) {
      console.log(`WAV sample at ${i}: raw=${rawSample.toFixed(6)}, gain=${masterGain}, final=${sample.toFixed(6)}`);
    }
    index += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function clearConsole() {
  if (consoleEditorRef.value) {
    const terminalInstance = (consoleEditorRef.value as any).terminalInstance?.();
    if (terminalInstance) terminalInstance.setValue('');
    (consoleEditorRef.value as any).addTerminalOutput('MUSIC V SCORE PROCESSING');
    (consoleEditorRef.value as any).addTerminalOutput('=======================');
    (consoleEditorRef.value as any).addTerminalOutput('Ready to evaluate. Press Alt+Enter to process the score.');
    (consoleEditorRef.value as any).addTerminalOutput('After evaluation, you can play audio with Ctrl+P');
  }
}

watch(functionTables, (newTables) => {
  setTimeout(() => {
    newTables.forEach(table => drawOscilloscope(table));
  }, 0);
}, { deep: true });

function drawOscilloscope(table: {functionNum: number, data: number[]}) {
  const canvas = canvasRefs[table.functionNum];
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const data = table.data;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= width; x += width / 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= height; y += height / 2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.strokeStyle = '#555555';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (let i = 0; i < data.length; i++) {
    minVal = Math.min(minVal, data[i]);
    maxVal = Math.max(maxVal, data[i]);
  }
  
  if (minVal === maxVal) {
    minVal -= 0.5;
    maxVal += 0.5;
  }
  
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  
  const dataLength = data.length;
  for (let i = 0; i < dataLength; i++) {
    const x = (i / (dataLength - 1)) * width;
    const normalizedValue = (data[i] - minVal) / (maxVal - minVal);
    const y = (1 - normalizedValue) * height;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.stroke();
  
  ctx.fillStyle = '#00ff00';
  ctx.font = '8px monospace';
  ctx.fillText(`${maxVal.toFixed(2)}`, 2, 8);
  ctx.fillText(`${minVal.toFixed(2)}`, 2, height - 2);
  ctx.fillText(`${dataLength}p`, width - 25, 8);
  
  if (table.functionNum === 2) {
    ctx.fillStyle = '#ff5500';
    const keyPoints = [0, 256, 512];
    keyPoints.forEach(pos => {
      if (pos < dataLength) {
        const x = (pos / (dataLength - 1)) * width;
        const normalizedValue = (data[pos] - minVal) / (maxVal - minVal);
        const y = (1 - normalizedValue) * height;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}
</script>

<style scoped>
.musicv-test-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: transparent;
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: transparent;
}

.score-editor, .console-editor {
  position: relative;
  min-height: 50px;
  background-color: transparent;
}

.console-editor {
  position: relative;
  background-color: #000000;
  border-top: 1px solid #333;
}

.console-header {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}

.clear-btn {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background-color: #555;
}

.divider {
  height: 5px;
  background-color: #333;
  cursor: row-resize;
  position: relative;
}

.divider:hover {
  background-color: #555;
}

.divider:active {
  background-color: #777;
}

.mini-oscilloscopes {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mini-oscilloscope {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  padding: 2px;
}

.mini-oscilloscope-label {
  font-family: 'Web437_IBM_MDA', monospace;
  color: #00ff00;
  font-size: 8px;
  margin-bottom: 2px;
}

.mini-oscilloscope-canvas {
  border: 1px solid #444;
  border-radius: 2px;
}

:deep(.ace_editor) {
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
}

:deep(.ace_editor.terminal .ace_line) {
  line-height: 1.5 !important;
  height: auto !important;
}
</style>