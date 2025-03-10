<template>
  <div class="app-container">
    <div class="settings">
      <button @click="toggleShowCode" class="icon-button" :title="showCode ? 'Hide Code' : 'Show Code'">
        <svg v-if="showCode" class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
        </svg>
        <transition name="title-fade">
          <span v-if="currentTitle" class="current-title">{{ currentTitle }}</span>
        </transition>
      </button>
      <button @click="handleEvaluateBinary" class="icon-button" title="Evaluate Binary (Ctrl+Enter)">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
      </button>
      <button @click="handleEvaluateTS" class="icon-button" title="Evaluate TS (Alt+Enter)">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
        <span class="ts-subscript">TS</span>
      </button>
      <button @click="handleClear" class="icon-button" title="Clear Editor (Ctrl+H)">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,21V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
        </svg>
      </button>
      <button @click="handleRandomPrompt" class="icon-button" title="Random Prompt">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
        </svg>
      </button>
      <button @click="showHelp = true" class="icon-button" title="Help">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
        </svg>
      </button>
      <button @click="toggleStorageMenu" class="icon-button" title="Storage Menu (Ctrl+M)">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </button>
    </div>
    <div class="content-wrapper" v-if="showCode">
      <div class="editor-container">
        <div class="score-editor" :style="{ flex: scoreEditorFlex }">
          <AceEditor ref="scoreEditorRef" mode="editor" :value="defaultScore" @evaluate="handleEvaluateBinary" @evaluateTS="handleEvaluateTS" @keydown="handleKeyDown" />
          <div class="mini-oscilloscopes">
            <div v-for="(table, index) in functionTables" :key="index" class="mini-oscilloscope">
              <div class="mini-oscilloscope-label">F{{ table.functionNum }}</div>
              <canvas :ref="el => { if (el) canvasRefs[table.functionNum] = el }" width="80" height="50" class="mini-oscilloscope-canvas"></canvas>
            </div>
          </div>
        </div>
        <div class="divider" @mousedown="startDrag"></div>
        <div class="console-editor" :style="{ flex: consoleEditorFlex }">
          <div class="console-header">
            <button class="clear-btn" @click="clearConsole" title="Clear console">🗑️</button>
          </div>
          <AceEditor ref="consoleEditorRef" mode="terminal" />
        </div>
      </div>
    </div>
    <Transition enter-active-class="fadeIn" leave-active-class="fadeOut" :duration="3000" mode="out-in">
      <div v-if="plotImage" class="plot-display" :key="transitionKey">
        <img :src="`data:image/png;base64,${plotImage}`" alt="Plot" @click="showLightbox = true" class="plot-image" />
      </div>
    </Transition>
    <Transition enter-active-class="fadeIn" leave-active-class="fadeOut" :duration="300">
      <div v-if="showLightbox" class="lightbox" @click="showLightbox = false">
        <button class="close-button" @click.stop="showLightbox = false">
          <svg class="icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        <img :src="`data:image/png;base64,${plotImage}`" alt="Plot" class="lightbox-image" @click.stop />
      </div>
    </Transition>
    <div v-if="showStorageMenu" class="storage-menu" @click.self="toggleStorageMenu">
      <div class="storage-menu-content">
        <div class="left-panel">
          <div class="entry-fields">
            <form @submit.prevent="addCode">
              <input v-model="formFields.title" placeholder="Title" required />
              <input type="number" v-model.number="formFields.year" placeholder="Year" required />
              <input v-model="formFields.composer" placeholder="Composer" required />
              <textarea v-model="formFields.comments" placeholder="Comments" rows="3" required></textarea>
              <button type="submit">[ Add ]</button>
            </form>
          </div>
          <div class="code-list">
            <div v-for="(codeEntry, index) in codes" :key="index" 
                 :class="{ 'selected': selectedCodeIndex === index }" 
                 @click="selectCode(index)">
              {{ codeEntry.composer }} - {{ codeEntry.year }} - {{ codeEntry.title || 'Untitled' }}
            </div>
          </div>
        </div>
        <div class="right-panel">
          <AceEditor ref="codeEditorRef" mode="editor" :value="selectedCode ? selectedCode.code : ''" @input="updateCodeContent" />
          <div class="code-actions">
            <button @click="handleEvaluateTSFromMenu">[ Play TS ]</button>
            <button @click="sendToEditor">[ To Editor ]</button>
            <button @click="updateCode(selectedCodeIndex)">[ Update ]</button>
            <button @click="deleteCode(selectedCodeIndex)">[ Delete ]</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div v-if="loading" class="loading">Processing... {{ Math.round(progress) }}%</div>
      <button v-if="isMobileOrTablet" @click="handleEvaluateTS" class="mobile-evaluate-btn" title="Alt+Enter">Evaluate TS</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <HelpModal v-model="showHelp" />
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, nextTick, reactive, watch } from 'vue';
import AceEditor from '~/components/AceEditor.vue';
import HelpModal from '~/components/HelpModal.vue';
import { useRandomPrompt } from '~/composables/useRandomPrompt';
import { useFavicon } from '~/composables/useFavicon';
import { MusicV } from '~/lib/musicV';

const musicV = new MusicV();
const defaultScore = `
INS 0 1 ;
OSC P5 P6 B2 F2 P30;
OUT B2 B1;
END;
GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;
NOT 0 1 .50 125 8.45;
NOT .75 1 .17 250 8.45;
NOT 4.00 1 .50 500 8.46; // Fixed instrument to 1
TER 8.00 ;
`;

const { startProcessing, completeProcessing } = useFavicon();
const scoreEditorRef = ref(null);
const consoleEditorRef = ref(null);
const codeEditorRef = ref(null);
const loading = ref(false);
const progress = ref(0);
const error = ref(null);
const plotImage = ref(null);
const showCode = ref(true);
const showHelp = ref(false);
const showStorageMenu = ref(false);
const transitionKey = ref(0);
const isMobileOrTablet = ref(false);
const showLightbox = ref(false);
const audioUrl = ref(null);
const functionTables = ref([]);
const canvasRefs = reactive({});
const currentTitle = ref('');

const codes = ref([]);
const newCode = ref({ title: '', year: new Date().getFullYear(), composer: '', comments: '', code: '' });
const selectedCodeIndex = ref(-1);
const selectedCode = ref(null);
const formFields = ref({ ...newCode.value });

const isDragging = ref(false);
const scoreEditorFlex = ref(0.85);
const consoleEditorFlex = ref(0.15);
const startY = ref(0);
const startScoreEditorFlex = ref(0);
const startConsoleEditorFlex = ref(0);

const checkDevice = () => {
  isMobileOrTablet.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const loadCodes = async () => {
  const response = await $fetch('/api/codes');
  codes.value = response.map(entry => ({
    ...entry,
    title: entry.title || entry.code.split('\n')[0].substring(0, 20) + (entry.code.split('\n')[0].length > 20 ? '...' : '') || 'Untitled'
  })) || [];
};

onMounted(async () => {
  checkDevice();
  window.addEventListener('resize', checkDevice);
  window.addEventListener('keydown', handleKeyDownGlobal);
  await nextTick();
  clearConsole();
  await loadCodes();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice);
  window.removeEventListener('keydown', handleKeyDownGlobal);
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
});

const handleKeyDownGlobal = (event) => {
  if (event.altKey && event.shiftKey) {
    if (event.key === 'ArrowLeft' && codes.value.length > 0) {
      event.preventDefault();
      navigateCodes(-1);
    } else if (event.key === 'ArrowRight' && codes.value.length > 0) {
      event.preventDefault();
      navigateCodes(1);
    }
  }
  handleKeyDown(event);
};

const navigateCodes = (direction) => {
  if (codes.value.length === 0) return;
  let newIndex = selectedCodeIndex.value + direction;
  if (newIndex < 0) newIndex = codes.value.length - 1;
  if (newIndex >= codes.value.length) newIndex = 0;
  selectedCodeIndex.value = newIndex;
  selectedCode.value = codes.value[newIndex];
  if (showStorageMenu.value && codeEditorRef.value) {
    codeEditorRef.value.addToEditor(selectedCode.value.code || '');
  } else {
    scoreEditorRef.value?.addToEditor(selectedCode.value.code || '');
  }
  currentTitle.value = selectedCode.value.title || 'Untitled';
  setTimeout(() => { currentTitle.value = ''; }, 4000);
};

const handleClear = () => scoreEditorRef.value?.clearEditor();
const toggleShowCode = () => showCode.value = !showCode.value;
const toggleStorageMenu = () => showStorageMenu.value = !showStorageMenu.value;

const handleRandomPrompt = async () => {
  const { getRandomPrompt } = useRandomPrompt();
  const prompt = await getRandomPrompt();
  scoreEditorRef.value?.addToEditor(prompt);
};

const startProgress = () => {
  progress.value = 0;
  const interval = setInterval(() => {
    if (progress.value < 90) progress.value += Math.random() * 15;
    if (progress.value > 90) progress.value = 90;
  }, 1200);
  return () => clearInterval(interval);
};

const handleEvaluateBinary = () => {
  const text = scoreEditorRef.value?.aceEditor()?.getValue();
  if (!text?.trim()) {
    error.value = "Please enter some text to evaluate.";
    return;
  }
  loading.value = true;
  startProcessing();
  const stopProgress = startProgress();
  setTimeout(() => {
    consoleEditorRef.value?.addTerminalOutput("Binary evaluation not implemented yet.");
    stopProgress();
    loading.value = false;
    completeProcessing();
  }, 1000);
};

const handleEvaluateTS = async (text = null) => {
  let evalText = text ?? scoreEditorRef.value?.aceEditor()?.getValue();
  if (!evalText || typeof evalText !== 'string' || !evalText.trim()) {
    evalText = defaultScore;
  }
  loading.value = true;
  startProcessing();
  const stopProgress = startProgress();
  try {
    consoleEditorRef.value?.addTerminalOutput('');
    functionTables.value = [];
    Object.keys(canvasRefs).forEach(key => delete canvasRefs[key]);
    await nextTick();

    // CONVT Implementation
    const lines = evalText.split('\n');
    let genTable = [];
    let modifiedLines = [];
    let hasConvt = false;
    for (const line of lines) {
      if (line.trim().startsWith('COMMENT: CONVT') || line.trim().startsWith('CONVT')) {
        hasConvt = true;
        consoleEditorRef.value?.addTerminalOutput('Detected CONVT directive - applying frequency conversion', 'info');
        continue;
      }
      if (line.trim().startsWith('GEN')) {
        genTable = line.split(/\s+/).map(val => parseFloat(val) || val);
      } else if (line.trim().startsWith('NOT')) {
        const params = line.split(/\s+/).map(val => parseFloat(val) || val);
        const time = params[1];
        const insNum = params[2];
        let freq = params[5];
        if (hasConvt && time === 1 && insNum >= 1 && insNum <= 6) {
          const g4 = genTable[4] || 512;
          const f = 511 / g4;
          const originalFreq = freq;
          freq *= f;
          consoleEditorRef.value?.addTerminalOutput(`CONVT: Scaled freq ${originalFreq} to ${freq.toFixed(2)} for ins ${insNum} at time ${time}`, 'info');
        }
        modifiedLines.push(`NOT ${time} ${insNum} ${params[3]} ${params[4]} ${freq}${params[6] ? ` ${params[6]}` : ''}${params[7] ? ` ${params[7]}` : ''}${params[8] ? ` ${params[8]}` : ''}`);
      } else {
        modifiedLines.push(line);
      }
    }
    const modifiedScore = modifiedLines.join('\n');
    evalText = modifiedScore;

    musicV.parseScore(evalText);
    consoleEditorRef.value?.addTerminalOutput(musicV.getConsoleOutput());
    await musicV.initAudio();
    await musicV.play();
    const audioBuffer = await musicV.generateSound(10);
    const wavBlob = createWavBlob(audioBuffer, 44100);
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
    audioUrl.value = URL.createObjectURL(wavBlob);
    consoleEditorRef.value?.addTerminalOutput(`Audio generated: ${audioUrl.value}`);
    functionTables.value = musicV.getFunctionTables();

    // Add download link
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `musicv-output-${timestamp}.wav`;
    consoleEditorRef.value?.addTerminalOutput(`<a href="${audioUrl.value}" download="${filename}" style="color:#ffb000;">Download ${filename}</a>`, 'html');
  } catch (err) {
    consoleEditorRef.value?.addTerminalOutput(`Error: ${err.message}`);
  } finally {
    stopProgress();
    loading.value = false;
    completeProcessing();
  }
};

watch(functionTables, (newTables) => {
  setTimeout(() => newTables.forEach(drawOscilloscope), 0);
}, { deep: true });

const handleEvaluateTSFromMenu = () => {
  if (selectedCode.value) handleEvaluateTS(selectedCode.value.code);
};

const handleKeyDown = (event) => {
  if (event.altKey && event.key === 'Enter') {
    event.preventDefault();
    handleEvaluateTS();
  } else if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    handleEvaluateBinary();
  } else if (event.ctrlKey && event.key === 'h') {
    event.preventDefault();
    handleClear();
  }
};

const createWavBlob = (audioData, sampleRate) => {
  const bufferLength = audioData.length * 2;
  const buffer = new ArrayBuffer(44 + bufferLength);
  const view = new DataView(buffer);
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + bufferLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, bufferLength, true);
  const masterGain = 0.1;
  let index = 44;
  for (let i = 0; i < audioData.length; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i] * masterGain));
    const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(index, int16Sample, true);
    index += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
};

const startDrag = (event) => {
  isDragging.value = true;
  startY.value = event.clientY;
  startScoreEditorFlex.value = scoreEditorFlex.value;
  startConsoleEditorFlex.value = consoleEditorFlex.value;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.body.style.userSelect = 'none';
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  const container = document.querySelector('.editor-container');
  if (!container) return;
  const containerHeight = container.clientHeight;
  const deltaY = event.clientY - startY.value;
  const deltaRatio = deltaY / containerHeight;
  let newScoreEditorFlex = startScoreEditorFlex.value + deltaRatio;
  let newConsoleEditorFlex = startConsoleEditorFlex.value - deltaRatio;
  const minFlex = 0.1;
  if (newScoreEditorFlex < minFlex) {
    newScoreEditorFlex = minFlex;
    newConsoleEditorFlex = 1 - minFlex;
  } else if (newConsoleEditorFlex < minFlex) {
    newConsoleEditorFlex = minFlex;
    newScoreEditorFlex = 1 - minFlex;
  }
  scoreEditorFlex.value = newScoreEditorFlex;
  consoleEditorFlex.value = newConsoleEditorFlex;
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.userSelect = '';
  nextTick(() => {
    scoreEditorRef.value?.resize();
    consoleEditorRef.value?.resize();
  });
};

const clearConsole = () => {
  consoleEditorRef.value?.addTerminalOutput('MUSIC V SCORE PROCESSING\n=======================\nReady to evaluate.');
};

const addCode = () => {
  codes.value.push({ ...formFields.value });
  formFields.value = { title: '', year: new Date().getFullYear(), composer: '', comments: '', code: '' };
  selectedCodeIndex.value = codes.value.length - 1;
  selectedCode.value = codes.value[selectedCodeIndex.value];
  if (codeEditorRef.value) codeEditorRef.value.addToEditor('');
};

const updateCode = async (index) => {
  if (index >= 0 && selectedCode.value) {
    const editorContent = codeEditorRef.value?.aceEditor()?.getValue() || '';
    codes.value[index] = { ...formFields.value, code: editorContent };
    await saveCodes();
  }
};

const deleteCode = async (index) => {
  if (index >= 0 && confirm('Delete this code?')) {
    codes.value.splice(index, 1);
    selectedCodeIndex.value = -1;
    selectedCode.value = null;
    formFields.value = { ...newCode.value };
    if (codeEditorRef.value) codeEditorRef.value.addToEditor('');
    await saveCodes();
  }
};

const saveCodes = async () => {
  await $fetch('/api/codes', { method: 'POST', body: codes.value });
};

const selectCode = (index) => {
  selectedCodeIndex.value = index;
  selectedCode.value = codes.value[index];
  formFields.value = { ...selectedCode.value };
  const codeEditor = codeEditorRef.value?.aceEditor();
  if (codeEditor) codeEditor.setValue(selectedCode.value.code || '', -1);
};

const updateCodeContent = (value) => {
  if (selectedCode.value) {
    selectedCode.value.code = value;
    formFields.value.code = value;
  }
};

const sendToEditor = () => {
  if (selectedCode.value) {
    scoreEditorRef.value?.addToEditor(selectedCode.value.code || '');
    toggleStorageMenu();
  }
};

const drawOscilloscope = (table) => {
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
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  let minVal = Infinity, maxVal = -Infinity;
  for (let i = 0; i < data.length; i++) {
    minVal = Math.min(minVal, data[i]);
    maxVal = Math.max(maxVal, data[i]);
  }
  if (minVal === maxVal) { minVal -= 0.5; maxVal += 0.5; }
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
  ctx.font = '9px monospace';
  ctx.fillText(`${maxVal.toFixed(2)}`, 2, 8);
  ctx.fillText(`${minVal.toFixed(2)}`, 2, height - 2);
  ctx.fillText(`${dataLength}p`, width - 25, 8);
};
</script>

<style scoped>
/* Reset to eliminate white borders */
:deep(html), :deep(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: #000 !important;
  color: #ffffff;
  overflow: hidden;
  font-family: 'Web437_IBM_MDA', monospace;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: fixed; /* Fix white borders */
  top: 0;
  left: 0;
  background: #000 !important;
  color: #ffffff;
  overflow: hidden;
}

.current-title {
  position: absolute;
  right: 100%; /* Left of eye toggle */
  top: 50%;
  transform: translateY(-50%);
  margin-right: 10px; /* Space from eye */
  color: #ffffff;
  opacity: 0.5;
  font-family: 'Web437_IBM_MDA', monospace;
  font-size: 14px;
  pointer-events: none;
  white-space: nowrap;
}

.title-fade-enter-active,
.title-fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.title-fade-enter-from,
.title-fade-leave-to {
  opacity: 0;
}

.title-fade-enter-to {
  opacity: 0.5;
}

.title-fade-leave-from {
  opacity: 0.5;
}

@keyframes titleFadeOut {
  0% { opacity: 0.5; }
  75% { opacity: 0.5; } /* Hold until 3s */
  100% { opacity: 0; } /* Fade out 3-4s */
}

.title-fade-leave-active {
  animation: titleFadeOut 4s ease-in-out forwards;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 60px;
  padding-bottom: 60px;
  background: #000; /* Ensure no white gaps */
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
}

.score-editor, .console-editor {
  position: relative;
  min-height: 50px;
}

.console-editor {
  background: #000;
  border-top: 1px solid #333;
}

.console-header {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}

.clear-btn {
  background: transparent;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
}

.clear-btn:hover { background: #555; }

.divider {
  height: 5px;
  background: #333;
  cursor: row-resize;
}

.divider:hover { background: #555; }
.divider:active { background: #777; }

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
  background: rgba(0, 0, 0, 0.7);
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

.settings {
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 8px;
}

.icon-button {
  position: relative;
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover { background: rgba(255, 255, 255, 0.1); }

.ts-subscript {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  color: #00ff00;
}

.icon { width: 24px; height: 24px; }

.plot-display { text-align: center; }

.plot-image {
  cursor: pointer;
  transition: transform 0.3s;
}

.plot-image:hover { transform: scale(1.02); }

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.lightbox-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}

.close-button:hover { background: rgba(255, 255, 255, 0.1); }

.storage-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
}

.storage-menu-content {
  width: 80%;
  height: 80%;
  display: flex;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.left-panel {
  width: 40%;
  display: flex;
  flex-direction: column;
  background: #252526;
}

.entry-fields {
  flex: 1;
  padding: 10px;
  border-bottom: 1px solid #333;
}

.entry-fields input,
.entry-fields textarea {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  background: #3c3c3c;
  border: 1px solid #555;
  color: #ffffff;
  font-family: 'Web437_IBM_MDA', monospace;
  resize: vertical;
}

.entry-fields button {
  width: 100%;
  padding: 5px;
  background: #444;
  border: 1px solid #ffffff;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Web437_IBM_MDA', monospace;
}

.entry-fields button:hover { background: #555; }

.code-list {
  flex: 2;
  overflow-y: auto;
  padding: 10px;
  color: #d4d4d4;
  font-family: 'Web437_IBM_MDA', monospace;
  font-size: 12px;
}

.code-list div {
  padding: 5px;
  cursor: pointer;
  border-bottom: 1px solid #333;
}

.code-list div:hover { background: #3c3c3c; }
.code-list div.selected { background: #555; color: #ffffff; }

.right-panel {
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.code-actions {
  display: flex;
  gap: 5px;
  padding: 10px 0;
}

.code-actions button {
  flex: 1;
  padding: 5px;
  background: #444;
  border: 1px solid #ffffff;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Web437_IBM_MDA', monospace;
}

.code-actions button:hover { background: #555; }

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  background: #000 !important;
  z-index: 1000;
}

.loading { margin-right: auto; }

.mobile-evaluate-btn {
  background: #4caf50;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mobile-evaluate-btn:hover { background: #45a049; }
.mobile-evaluate-btn:active { background: #3d8b40; transform: translateY(1px); }

.error {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff5252;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 1000;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.fadeIn { animation: fadeIn 2s ease-in-out; animation-fill-mode: both; }
.fadeOut { animation: fadeOut 3s ease-in-out; animation-fill-mode: both; }

::selection {
  background: #2d2d2d;
  color: #ffffff;
}
</style>