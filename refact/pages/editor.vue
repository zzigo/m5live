<template>
  <div class="editor-container">
    <div class="editor-header">
      <h1>M5Live Editor</h1>
      <div class="controls">
        <button @click="runCode" class="run-button">Run</button>
        <button @click="stopAudio" class="stop-button">Stop</button>
      </div>
    </div>
    
    <div class="editor-layout">
      <div class="code-editor">
        <client-only>
          <VAceEditor
            v-model:value="code"
            @init="editorInit"
            lang="javascript"
            theme="monokai"
            :options="editorOptions"
            class="ace-editor"
          />
        </client-only>
      </div>
      
      <div class="output-panel">
        <h3>Output</h3>
        <div class="output-content">
          <pre>{{ output }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';

// Only import these on client-side
let aceRequires = null;
if (process.client) {
  aceRequires = () => {
    require('ace-builds/src-noconflict/mode-javascript');
    require('ace-builds/src-noconflict/theme-monokai');
    require('ace-builds/src-noconflict/ext-language_tools');
  };
}

const code = ref(`// M5Live MUSIC V Example
// Press Run to execute

function playNote(frequency, duration) {
  console.log(\`Playing note: \${frequency}Hz for \${duration}s\`);
  // Audio implementation will go here
}

// Play a simple melody
playNote(440, 0.5);  // A4
playNote(494, 0.5);  // B4
playNote(523, 0.5);  // C5
playNote(587, 1.0);  // D5
`);

const output = ref('Output will appear here...');
const editorOptions = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  showLineNumbers: true,
  tabSize: 2,
  fontSize: 14,
  fontFamily: "'Glass TTY VT220', monospace",
};

function editorInit(editor) {
  editor.setShowPrintMargin(false);
  
  // Load the custom font
  if (process.client) {
    const fontFace = new FontFace(
      'Glass TTY VT220',
      'url(/fonts/Glass_TTY_VT220.ttf)',
      { display: 'swap' }
    );
    
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
      console.log('Custom font loaded for editor');
    }).catch(err => {
      console.error('Error loading custom font:', err);
    });
  }
}

function runCode() {
  output.value = '';
  
  try {
    // Capture console.log output
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      output.value += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };
    
    // Execute the code
    const result = new Function(code.value)();
    
    // Restore console.log
    console.log = originalConsoleLog;
    
    if (result !== undefined) {
      output.value += `Result: ${result}\n`;
    }
  } catch (error) {
    output.value = `Error: ${error.message}`;
    console.error(error);
  }
}

function stopAudio() {
  output.value += 'Audio stopped.\n';
  // Implementation for stopping audio will go here
}

onMounted(() => {
  if (process.client && aceRequires) {
    aceRequires();
  }
});

onBeforeUnmount(() => {
  // Clean up any resources if needed
});
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  padding: 0;
  background-color: #1a1a1a;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #333;
  border-bottom: 1px solid #444;
}

.editor-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.controls {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.run-button {
  background-color: #ffb000;
  color: #000;
}

.run-button:hover {
  background-color: #ffc033;
}

.stop-button {
  background-color: #e74c3c;
  color: #fff;
}

.stop-button:hover {
  background-color: #f55c4c;
}

.editor-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.code-editor {
  flex: 2;
  height: 100%;
  border-right: 1px solid #444;
}

.ace-editor {
  width: 100%;
  height: 100%;
  font-family: 'Glass TTY VT220', monospace;
}

.output-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #222;
  padding: 1rem;
  overflow: hidden;
}

.output-panel h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #ffb000;
}

.output-content {
  flex: 1;
  overflow: auto;
  background-color: #111;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Glass TTY VT220', monospace;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  color: #f5f5f5;
}
</style> 