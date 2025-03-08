var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ref, mergeProps, useSSRContext, defineComponent, reactive, watch } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import "hookable";
import "destr";
import "klona";
import "defu";
import "#internal/nuxt/paths";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-monokai.js";
import "ace-builds/src-noconflict/mode-text.js";
import { _ as _export_sfc } from "../server.mjs";
const _sfc_main$1 = {
  __name: "AceEditor",
  __ssrInlineRender: true,
  props: {
    mode: {
      type: String,
      default: "editor"
      // 'editor' or 'terminal'
    }
  },
  emits: ["evaluate", "keydown"],
  setup(__props, { expose: __expose, emit: __emit }) {
    ref(null);
    ref("0.0.0");
    let aceEditorInstance;
    const commandHistory = ref([]);
    let historyIndex = ref(-1);
    ref("");
    const editorContainer = ref(null);
    ref(null);
    const addToEditor = (content, type = "text") => {
      return;
    };
    const clearEditor = () => {
    };
    const addToHistory = (content) => {
      if (content.trim() && commandHistory.value[commandHistory.value.length - 1] !== content) {
        commandHistory.value.push(content);
        historyIndex.value = commandHistory.value.length;
      }
    };
    __expose({
      addToEditor,
      aceEditor: () => aceEditorInstance,
      clearEditor,
      addToHistory,
      resize: () => aceEditorInstance == null ? void 0 : aceEditorInstance.resize(),
      terminalInstance: () => aceEditorInstance,
      aceEditorInstance: () => aceEditorInstance
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "ace-editor-container",
        ref_key: "editorContainer",
        ref: editorContainer
      }, _attrs))} data-v-2d368146><div class="editor" data-v-2d368146></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AceEditor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AceEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2d368146"]]);
class MusicV {
  constructor() {
    __publicField(this, "sampleRate", 44100);
    __publicField(this, "parameters");
    __publicField(this, "events", []);
    __publicField(this, "currentTime", 0);
    __publicField(this, "instruments", /* @__PURE__ */ new Map());
    __publicField(this, "functions", /* @__PURE__ */ new Map());
    // Stored functions F1-F10
    __publicField(this, "currentInstrument", null);
    __publicField(this, "audioContext", null);
    __publicField(this, "workletNode", null);
    __publicField(this, "consoleOutput", "");
    __publicField(this, "isServer", typeof globalThis.window === "undefined");
    __publicField(this, "activeNotes", /* @__PURE__ */ new Map());
    this.sampleRate = 44100;
    this.currentTime = 0;
    this.events = [];
    this.instruments = /* @__PURE__ */ new Map();
    this.functions = /* @__PURE__ */ new Map();
    this.activeNotes = /* @__PURE__ */ new Map();
    this.consoleOutput = "";
    this.parameters = new Float32Array(1e3);
    this.initDefaultFunctionTables();
  }
  initDefaultFunctionTables() {
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
  // Parse score text into events (simplified version of Pass1)
  parseScore(scoreText) {
    this.consoleOutput = "";
    this.consoleOutput += "*** MUSIC V SCORE PROCESSING ***\n\n";
    const lines = scoreText.split("\n");
    let currentInstrument = null;
    let currentInstrumentId = -1;
    let wordCount = 0;
    const instrumentUnitCounts = /* @__PURE__ */ new Map();
    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      if (line.trim().startsWith("COM") || line.trim().startsWith("COMMENT")) {
        this.consoleOutput += `Comment: ${line.trim().substring(line.trim().indexOf(" ") + 1)}
`;
        continue;
      }
      if (line.trim().startsWith(";")) {
        continue;
      }
      const parts = line.trim().split(/\s+/);
      const opcode = parts[0];
      wordCount += parts.length;
      if (opcode === "INS") {
        if (currentInstrument) {
          this.consoleOutput += `Instrument ${currentInstrumentId} definition complete

`;
          instrumentUnitCounts.set(currentInstrumentId, currentInstrument.units.length);
        }
        currentInstrumentId = parseInt(parts[1], 10);
        currentInstrument = {
          id: currentInstrumentId,
          units: [],
          oscillators: [],
          outputs: []
        };
        this.consoleOutput += `Defining Instrument ${currentInstrumentId}
`;
        this.instruments.set(currentInstrumentId, currentInstrument);
      } else if (opcode === "OSC" && currentInstrument) {
        const freqParam = parts[1];
        const ampParam = parts[2];
        const outputBus = parseInt(parts[3].substring(1), 10);
        const functionTable = parseInt(parts[4].substring(1), 10);
        const phaseParam = parts.length > 5 ? parts[5] : "P30";
        const oscId = currentInstrument.oscillators.length + 1;
        currentInstrument.oscillators.push({
          id: oscId,
          type: 1,
          // Default to sine
          freqParam,
          ampParam,
          outputBus,
          functionTable,
          phaseParam
        });
        currentInstrument.units.push({
          type: "OSC",
          params: {
            freqParam,
            ampParam,
            outputBlock: outputBus,
            functionNum: functionTable,
            phaseParam
          }
        });
        this.consoleOutput += `  OSC: Type=1, Freq=${freqParam}, Amp=${ampParam}, Phase=${phaseParam}, Bus=${outputBus}, Function=${functionTable}
`;
      } else if (opcode === "OUT" && currentInstrument) {
        const inputBus = parseInt(parts[1].substring(1), 10);
        const outputBus = parseInt(parts[2].substring(1), 10);
        currentInstrument.outputs.push({
          inputBus,
          outputBus
        });
        currentInstrument.units.push({
          type: "OUT",
          params: {
            inputBlock: inputBus,
            outputBlock: outputBus,
            amplitude: 1
            // Default amplitude
          }
        });
        this.consoleOutput += `  OUT: Input Bus=${inputBus}, Output Bus=${outputBus}, Amp=1
`;
      } else if (opcode === "END" && currentInstrument) {
        this.consoleOutput += `Instrument ${currentInstrumentId} definition complete

`;
        instrumentUnitCounts.set(currentInstrumentId, currentInstrument.units.length);
        currentInstrument = null;
      } else if (opcode === "GEN") {
        parseInt(parts[1], 10);
        parseFloat(parts[2]);
        const functionNum = parseInt(parts[3], 10);
        const params = [];
        for (let i = 4; i < parts.length; i++) {
          if (parts[i] === ";") break;
          params.push(parseFloat(parts[i]));
        }
        this.consoleOutput += `GEN: Function=${functionNum}, Params=${params.length}
`;
        this.handleGenFunction(functionNum, 0, 0, params);
      } else if (opcode === "NOT") {
        const startTime = parseFloat(parts[1]);
        const instrumentId = parseInt(parts[2], 10);
        const frequency = parseFloat(parts[3]);
        const noteAmplitude = parseFloat(parts[4]);
        const duration = parseFloat(parts[5]);
        this.events.push({
          type: "note",
          time: startTime,
          insNum: instrumentId,
          frequency,
          amplitude: noteAmplitude,
          duration
        });
        this.consoleOutput += `Note: Start=${startTime}, Ins=${instrumentId}, Freq=${frequency}, Amp=${noteAmplitude}, Dur=${duration}
`;
      } else if (opcode === "TER") {
        const terminationTime = parseFloat(parts[1]);
        this.consoleOutput += `Termination time: ${terminationTime}

`;
      }
    }
    this.events.sort((a, b) => a.time - b.time);
    this.consoleOutput += "PASS II REPORT\n";
    this.consoleOutput += "(WORD CNT)\n";
    instrumentUnitCounts.forEach((unitCount, id) => {
      this.consoleOutput += `       ${id}    ${unitCount}.000    0.000
`;
    });
    this.consoleOutput += "END OF PASS II\n\n";
    this.consoleOutput += "Score processing complete\n";
  }
  // Handle GEN function definition
  handleGenFunction(functionNum, genType, normalization, params) {
    const functionData = new Float32Array(512);
    if (genType === 0) {
      const points = [];
      for (let i = 0; i < params.length; i += 2) {
        const value = params[i] || 0;
        const position = Math.floor(params[i + 1]);
        if (position >= 0 && position < 512) {
          points.push({ position, value });
          this.consoleOutput += `  Point: val=${value}, pos=${position}
`;
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
          const t = endPos === startPos ? 0 : (pos - startPos) / (endPos - startPos);
          functionData[pos] = startVal * (1 - t) + endVal * t;
        }
      }
      this.consoleOutput += `  Function table ${functionNum} created with ${points.length} points
`;
      this.consoleOutput += `  Function table values (sample): [0]=${functionData[0].toFixed(3)}, [50]=${functionData[50].toFixed(3)}, [205]=${functionData[205].toFixed(3)}, [306]=${functionData[306].toFixed(3)}, [461]=${functionData[461].toFixed(3)}, [511]=${functionData[511].toFixed(3)}
`;
    } else {
      for (let i = 0; i < 512; i++) {
        functionData[i] = Math.sin(2 * Math.PI * i / 512);
      }
      this.consoleOutput += `Warning: GEN type ${genType} not supported, using sine wave
`;
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
  // Generate audio samples (simplified version of Pass3)
  async generateSound(duration = 8) {
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
        const blocks = /* @__PURE__ */ new Map();
        blocks.set(1, new Float32Array(1));
        outputBuffer[i] = this.generateSample(currentTimeInSeconds, blocks);
        this.currentTime = currentTimeInSeconds;
      }
      return outputBuffer;
    } catch (error) {
      console.error("Error generating sound:", error);
      this.consoleOutput += `Error generating sound: ${error.message}
`;
      return new Float32Array(0);
    }
  }
  processEvent(event, currentTime) {
    const { type, insNum } = event;
    switch (type) {
      case "note":
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
          this.consoleOutput += `Error: Instrument ${insNum} not found
`;
        }
        break;
    }
  }
  generateSample(currentTime, blocks) {
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
              case "OSC":
                this.processOscillator(unit, note, blocks, currentTime);
                break;
              case "OUT":
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
    return outputBlock ? outputBlock[0] : 0;
  }
  processOscillator(unit, note, blocks, currentTime) {
    const params = unit.params;
    const functionNum = params.functionNum || 2;
    const outputBlockNum = params.outputBlock || 2;
    const functionData = this.functions.get(functionNum);
    if (!functionData) {
      const defaultFunction = new Float32Array(512);
      for (let i = 0; i < 512; i++) {
        defaultFunction[i] = Math.sin(2 * Math.PI * i / 512);
      }
      this.functions.set(functionNum, defaultFunction);
    }
    let outputBlock = blocks.get(outputBlockNum);
    if (!outputBlock) {
      outputBlock = new Float32Array(1);
      blocks.set(outputBlockNum, outputBlock);
    }
    const amplitude = note.amplitude || 0.5;
    const frequency = note.frequency || 440;
    if (currentTime < 0.01 || Math.abs(currentTime - Math.floor(currentTime * 10) / 10) < 1e-3) {
      console.log(`OSC at ${currentTime.toFixed(2)}s: Freq=${frequency.toFixed(2)}, Amp=${amplitude.toFixed(2)}, Block=${outputBlockNum}, Func=${functionNum}`);
    }
    if (!note.oscState) {
      note.oscState = { sum: 0 };
    }
    const increment = 0.02555 * frequency;
    note.oscState.sum += increment;
    const index = Math.floor(note.oscState.sum % 511);
    const functionTable = this.functions.get(functionNum) || new Float32Array(512);
    const value = functionTable[index];
    outputBlock[0] = value * amplitude;
  }
  processOutput(unit, blocks) {
    const params = unit.params;
    const inputBlockNum = params.inputBlock || 2;
    const outputBlockNum = params.outputBlock || 1;
    const amplitude = params.amplitude || 1;
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
  // Initialize audio context and worklet
  async initAudio() {
    if (!this.audioContext) {
      try {
        console.log("Initializing audio context...");
        this.audioContext = new AudioContext({
          sampleRate: this.sampleRate,
          latencyHint: "interactive"
        });
        console.log("Audio context created with sample rate:", this.audioContext.sampleRate);
        const workletUrl = "/musicVWorklet.js";
        console.log("Loading worklet from URL:", workletUrl);
        try {
          await this.audioContext.audioWorklet.addModule(workletUrl);
          console.log("Worklet module loaded successfully!");
        } catch (workletError) {
          console.error("Failed to load worklet module:", workletError);
          throw new Error(`Worklet loading failed: ${workletError.message}`);
        }
        console.log("Creating AudioWorkletNode with processor name: music-v-processor");
        this.workletNode = new AudioWorkletNode(this.audioContext, "music-v-processor");
        this.workletNode.connect(this.audioContext.destination);
        console.log("Sending initialization data to worklet...");
        this.workletNode.port.postMessage({
          type: "init",
          events: this.events,
          instruments: Object.fromEntries(this.instruments),
          functions: Array.from(this.functions).reduce((obj, [key, value]) => {
            obj[key] = Array.from(value);
            return obj;
          }, {}),
          sampleRate: this.sampleRate
        });
        this.workletNode.onprocessorerror = (error) => {
          console.error("Worklet processor error:", error);
          throw new Error("Audio processing error occurred");
        };
        if (this.audioContext.state === "suspended") {
          console.log("Resuming audio context...");
          await this.audioContext.resume();
          console.log("Audio context resumed:", this.audioContext.state);
        }
        console.log("Audio initialization complete!");
      } catch (error) {
        console.error("Failed to initialize audio worklet:", error);
        throw new Error(`Failed to initialize audio: ${error.message || "Unknown error"}`);
      }
    }
  }
  // Start audio playback
  async play() {
    if (!this.audioContext) {
      await this.initAudio();
    }
    if (this.audioContext && this.workletNode) {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    }
  }
  // Stop audio playback
  stop() {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }
  // Get console output for display
  getConsoleOutput() {
    return this.consoleOutput;
  }
  // Get all function tables for visualization
  getFunctionTables() {
    const tables = [];
    this.functions.forEach((data, functionNum) => {
      tables.push({
        functionNum,
        data: Array.from(data)
        // Convert Float32Array to regular array for easier handling
      });
    });
    return tables;
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MusicVTest",
  __ssrInlineRender: true,
  setup(__props) {
    ref(`COM Define instrument 1
INS 1 1 ;
OSC P5 P6 B2 F2 P30 ;
OUT B2 B1 ;
END ;

COM Define a square wave using GEN (value-time pairs)
GEN 0 1 2 .999 0 .999 256 -.999 256 -.999 512 0 512 ;

COM Commented sine wave for reference
COM GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511 ;

COM Play notes with the square waveform
NOT 0 1 440 0.05 0.15 ;
NOT 0.2 1 500 0.045 0.15 ;
NOT 0.6 1 550 0.045 0.15 ;
NOT 1 1 600 0.045 0.15 ;
NOT 1.4 1 650 0.045 0.15 ;
NOT 1.8 1 700 0.045 0.15 ;
NOT 2.2 1 750 0.01 0.15 ;
NOT 2.6 1 800 0.045 0.15 ;
NOT 2.9 1 850 0.045 0.15 ;
NOT 3.4 1 900 0.045 0.15 ;
NOT 3.8 1 950 0.045 0.15 ;
NOT 4.2 1 1000 0.045 0.15 ;
NOT 4.6 1 1050 0.045 0.15 ;
NOT 5.0 1 800 0.055 0.15 ;
TER 20 ;`);
    ref("MUSIC V SCORE PROCESSING\n=======================\n");
    const audioUrl = ref(null);
    const scoreEditorRef = ref(null);
    const consoleEditorRef = ref(null);
    ref(false);
    const scoreEditorFlex = ref(0.85);
    const consoleEditorFlex = ref(0.15);
    ref(0);
    ref(0);
    ref(0);
    const functionTables = ref([]);
    const canvasRefs = reactive({});
    function handleKeyDown(event) {
      if (event.altKey && event.key === "Enter") {
        event.preventDefault();
        evaluateSelection();
      }
      if (event.ctrlKey && (event.key === "p" || event.key === "P")) {
        console.log("Ctrl+P detected, playing audio");
        event.preventDefault();
        event.stopPropagation();
        playAudio();
        return false;
      }
    }
    function playAudio() {
      if (audioUrl.value) {
        const audioContext = new ((void 0).AudioContext || (void 0).webkitAudioContext)();
        fetch(audioUrl.value).then((response) => response.arrayBuffer()).then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer)).then((audioBuffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start(0);
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput("Audio playback started (Ctrl+P)", "success");
          }
        }).catch((err) => {
          console.error("Error playing audio:", err);
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput(`Error playing audio: ${err.message}`, "error");
          }
        });
      } else if (consoleEditorRef.value) {
        consoleEditorRef.value.addTerminalOutput("No audio available to play", "error");
      }
    }
    async function evaluateSelection() {
      try {
        if (audioUrl.value) {
          URL.revokeObjectURL(audioUrl.value);
        }
        audioUrl.value = null;
        let currentScore = "";
        if (scoreEditorRef.value) {
          const aceEditorInstance = scoreEditorRef.value.aceEditorInstance();
          if (aceEditorInstance) {
            currentScore = aceEditorInstance.getValue();
          }
        }
        if (consoleEditorRef.value) {
          const terminalInstance = consoleEditorRef.value.terminalInstance();
          if (terminalInstance) {
            terminalInstance.setValue("");
          }
          consoleEditorRef.value.addTerminalOutput("MUSIC V SCORE PROCESSING", "success");
          consoleEditorRef.value.addTerminalOutput("=======================", "info");
        }
        const musicV = new MusicV();
        try {
          musicV.parseScore(currentScore);
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput(musicV.getConsoleOutput(), "info");
          }
          if (musicV.getFunctionTables && typeof musicV.getFunctionTables === "function") {
            const functionTables2 = musicV.getFunctionTables();
            functionTables2.forEach((table) => {
              visualizeFunctionTable(table.functionNum, table.data);
            });
          }
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput("Generating audio samples...", "info");
          }
          const audioBuffer = await musicV.generateSound(4);
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput(`Generated ${audioBuffer.length} audio samples`, "info");
            let nonZeroCount = 0;
            let maxValue = 0;
            for (let i = 0; i < audioBuffer.length; i++) {
              if (Math.abs(audioBuffer[i]) > 1e-4) {
                nonZeroCount++;
                maxValue = Math.max(maxValue, Math.abs(audioBuffer[i]));
              }
            }
            consoleEditorRef.value.addTerminalOutput(`Non-zero samples: ${nonZeroCount}`, "info");
            consoleEditorRef.value.addTerminalOutput(`Max amplitude: ${maxValue}`, "info");
          }
          const wavBlob = createWavBlob(audioBuffer, 44100);
          audioUrl.value = URL.createObjectURL(wavBlob);
          const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
          const filename = `musicv-output-${timestamp}.wav`;
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput("Audio generation complete.", "info");
            consoleEditorRef.value.addTerminalOutput(`Audio file is stored in memory as a Blob URL: ${audioUrl.value}`, "info");
            consoleEditorRef.value.addTerminalOutput(`Press Ctrl+P to play the audio.`, "success");
            consoleEditorRef.value.addTerminalOutput(`To save the file, right-click this link and select "Save Link As": `, "info");
            consoleEditorRef.value.addTerminalOutput(`<a href="${audioUrl.value}" download="${filename}" style="color:#ffb000;">Download ${filename}</a>`, "html");
          }
          playAudio();
        } catch (error) {
          if (consoleEditorRef.value) {
            consoleEditorRef.value.addTerminalOutput(`Error: ${error.message}`, "error");
          }
          console.error("Error in MusicV processing:", error);
        }
        functionTables.value = musicV.getFunctionTables();
      } catch (error) {
        console.error("Error in evaluation:", error);
        if (consoleEditorRef.value) {
          consoleEditorRef.value.addTerminalOutput(`Error: ${error.message}`, "error");
        }
      }
    }
    function visualizeFunctionTable(tableNum, tableData) {
      if (!consoleEditorRef.value || !tableData) return;
      const width = 80;
      const height = 15;
      const grid = Array(height).fill(0).map(() => Array(width).fill(" "));
      Math.floor(tableData.length / width);
      let minVal = Infinity;
      let maxVal = -Infinity;
      for (let i = 0; i < tableData.length; i++) {
        minVal = Math.min(minVal, tableData[i]);
        maxVal = Math.max(maxVal, tableData[i]);
      }
      if (minVal === maxVal) {
        minVal -= 0.5;
        maxVal += 0.5;
      }
      if (minVal < 0 && maxVal > 0) {
        const zeroLineY = Math.floor((height - 1) * (1 - (0 - minVal) / (maxVal - minVal)));
        if (zeroLineY >= 0 && zeroLineY < height) {
          for (let x = 0; x < width; x++) {
            grid[zeroLineY][x] = "-";
          }
        }
      }
      for (let x = 0; x < width; x++) {
        const idx = Math.min(tableData.length - 1, Math.floor(x * tableData.length / width));
        if (idx < tableData.length) {
          const value = tableData[idx];
          const y = Math.floor((height - 1) * (1 - (value - minVal) / (maxVal - minVal)));
          const gridY = Math.max(0, Math.min(height - 1, y));
          grid[gridY][x] = "*";
        }
      }
      let visualization = `
Function Table F${tableNum} (${tableData.length} points, range: ${minVal.toFixed(3)} to ${maxVal.toFixed(3)}):
`;
      for (let y = 0; y < height; y++) {
        const yValue = maxVal - y * (maxVal - minVal) / (height - 1);
        if (y === 0 || y === height - 1 || minVal < 0 && maxVal > 0 && Math.abs(yValue) < 0.1) {
          visualization += `${yValue.toFixed(2).padStart(7)} |`;
        } else {
          visualization += "        |";
        }
        visualization += grid[y].join("") + "\n";
      }
      visualization += "        +" + "-".repeat(width) + "\n";
      visualization += "         " + "0".padEnd(Math.floor(width / 4)) + Math.floor(tableData.length / 4).toString().padEnd(Math.floor(width / 4)) + Math.floor(tableData.length / 2).toString().padEnd(Math.floor(width / 4)) + Math.floor(3 * tableData.length / 4).toString().padEnd(Math.floor(width / 4)) + tableData.length.toString() + "\n";
      consoleEditorRef.value.addTerminalOutput(visualization, "info");
      const keyPositions = [0, 50, 205, 306, 461, 511];
      let valueStr = "Key values: ";
      keyPositions.forEach((pos) => {
        if (pos < tableData.length) {
          valueStr += `[${pos}]=${tableData[pos].toFixed(3)} `;
        }
      });
      consoleEditorRef.value.addTerminalOutput(valueStr, "info");
    }
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    function createWavBlob(audioData, sampleRate) {
      const bufferLength = audioData.length * 2;
      const buffer = new ArrayBuffer(44 + bufferLength);
      const view = new DataView(buffer);
      writeString(view, 0, "RIFF");
      view.setUint32(4, 36 + bufferLength, true);
      writeString(view, 8, "WAVE");
      writeString(view, 12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, "data");
      view.setUint32(40, bufferLength, true);
      const volume = 0.8;
      let index = 44;
      for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i])) * volume;
        const int16Sample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(index, int16Sample, true);
        index += 2;
      }
      return new Blob([buffer], { type: "audio/wav" });
    }
    watch(functionTables, (newTables) => {
      setTimeout(() => {
        newTables.forEach((table) => {
          drawOscilloscope(table);
        });
      }, 0);
    }, { deep: true });
    function drawOscilloscope(table) {
      const canvas = canvasRefs[table.functionNum];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const data = table.data;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#333333";
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
      ctx.strokeStyle = "#555555";
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
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        const x = i / (dataLength - 1) * width;
        const normalizedValue = (data[i] - minVal) / (maxVal - minVal);
        const y = (1 - normalizedValue) * height;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.fillStyle = "#00ff00";
      ctx.font = "8px monospace";
      ctx.fillText(`${maxVal.toFixed(2)}`, 2, 8);
      ctx.fillText(`${minVal.toFixed(2)}`, 2, height - 2);
      ctx.fillText(`${dataLength}p`, width - 25, 8);
      if (table.functionNum === 2) {
        ctx.fillStyle = "#ff5500";
        const keyPoints = [0, 256, 512];
        keyPoints.forEach((pos) => {
          if (pos < dataLength) {
            const x = pos / (dataLength - 1) * width;
            const normalizedValue = (data[pos] - minVal) / (maxVal - minVal);
            const y = (1 - normalizedValue) * height;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "musicv-test-container" }, _attrs))} data-v-29529401><div class="editor-container" data-v-29529401><div class="score-editor" style="${ssrRenderStyle({ flex: scoreEditorFlex.value })}" data-v-29529401>`);
      _push(ssrRenderComponent(AceEditor, {
        ref_key: "scoreEditorRef",
        ref: scoreEditorRef,
        mode: "editor",
        onKeydown: handleKeyDown,
        onEvaluate: evaluateSelection
      }, null, _parent));
      _push(`<div class="mini-oscilloscopes" data-v-29529401><!--[-->`);
      ssrRenderList(functionTables.value, (table, index) => {
        _push(`<div class="mini-oscilloscope" data-v-29529401><div class="mini-oscilloscope-label" data-v-29529401>F${ssrInterpolate(table.functionNum)}</div><canvas width="80" height="50" class="mini-oscilloscope-canvas" data-v-29529401></canvas></div>`);
      });
      _push(`<!--]--></div></div><div class="divider" data-v-29529401></div><div class="console-editor" style="${ssrRenderStyle({ flex: consoleEditorFlex.value })}" data-v-29529401><div class="console-header" data-v-29529401><button class="clear-btn" title="Clear console" data-v-29529401>🗑️</button></div>`);
      _push(ssrRenderComponent(AceEditor, {
        ref_key: "consoleEditorRef",
        ref: consoleEditorRef,
        mode: "terminal"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MusicVTest.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MusicVTest = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-29529401"]]);
export {
  AceEditor as A,
  MusicVTest as M
};
//# sourceMappingURL=MusicVTest-BFFyWJuM.js.map
