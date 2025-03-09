import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$1 = {
  __name: "AceEditor",
  __ssrInlineRender: true,
  props: {
    mode: { type: String, default: "editor" },
    value: { type: String, default: "" }
  },
  emits: ["evaluate", "evaluateTS", "keydown", "input"],
  setup(__props, { expose: __expose, emit: __emit }) {
    ref(null);
    const editorContainer = ref(null);
    ref(null);
    ref(null);
    __expose({
      addToEditor: (text) => false,
      addTerminalOutput: (text) => {
      },
      aceEditor: () => null,
      resize: () => false,
      clearEditor: () => false,
      clearTerminal: () => false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "ace-editor-container",
        ref_key: "editorContainer",
        ref: editorContainer
      }, _attrs))} data-v-233d8b60><div class="${ssrRenderClass([{ "editor": __props.mode === "editor", "terminal": __props.mode === "terminal" }, "editor"])}" data-v-233d8b60></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AceEditor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AceEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-233d8b60"]]);

const _sfc_main = {
  __name: "HelpModal",
  __ssrInlineRender: true,
  props: {
    modelValue: Boolean
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-c4dc3b66><div class="modal-content" data-v-c4dc3b66><div class="modal-header" data-v-c4dc3b66><h2 data-v-c4dc3b66>Welcome to M5LIVE</h2><button class="close-button" data-v-c4dc3b66>×</button></div><div class="modal-body" data-v-c4dc3b66><h3 data-v-c4dc3b66>A LiveCoding Revival of MUSIC V</h3><p data-v-c4dc3b66> M5LIVE is a modern reinterpretation of Max Mathews&#39; pioneering MUSIC V system, enabling live coding of musical scores in the MUSIC V syntax. Built on Nuxt 3, it bridges vintage computer music with contemporary web technologies, offering a platform to explore sound synthesis and speculative instrument design. </p><h4 data-v-c4dc3b66>Historical Context: Max Mathews and MUSIC I-VI</h4><p data-v-c4dc3b66> Max Mathews, often called the &quot;father of computer music,&quot; invented the MUSIC series (I-VI) starting in 1957 at Bell Labs. MUSIC I was the first program to synthesize sound on a computer (an IBM 704), famously rendering &quot;Daisy Bell&quot; in 1961—later immortalized in *2001: A Space Odyssey*. By MUSIC V (1968), Mathews introduced a modular, score-based system that abstracted sound generation into &quot;instruments&quot; (unit generators) and &quot;notes,&quot; laying the groundwork for modern digital audio workstations. Through a media archaeology lens, MUSIC V reveals deep patterns in computational design—modularity, abstraction, and human-machine collaboration—that resonate with philosophical questions about creativity and interface incentives. M5LIVE recovers these patterns, extending them into a web-based, interactive environment. </p><h4 data-v-c4dc3b66>How It Works:</h4><ol data-v-c4dc3b66><li data-v-c4dc3b66>Write MUSIC V scores in the editor (e.g., <code data-v-c4dc3b66>INS 0 1; OSC P5 P6 B2 F2 P30;</code>).</li><li data-v-c4dc3b66>Use shortcuts to evaluate code live or send it to the console.</li><li data-v-c4dc3b66>Explore stored scores via the storage menu, updating or playing them as TypeScript audio.</li><li data-v-c4dc3b66>Leverage media archaeology to rediscover design paradigms from Mathews&#39; era, inspiring new interfaces.</li></ol><h4 data-v-c4dc3b66>Activated Commands:</h4><ul data-v-c4dc3b66><li data-v-c4dc3b66><strong data-v-c4dc3b66>Evaluate/Stop TS</strong>: <kbd data-v-c4dc3b66>Alt + Enter</kbd> - Runs the selected or full score as TypeScript audio. When playing, changes to a stop button. Syntax: <code data-v-c4dc3b66>INS &lt;time&gt; &lt;duration&gt;; OSC &lt;params&gt;; OUT &lt;buffer&gt;; END;</code></li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Stop Playback</strong>: <kbd data-v-c4dc3b66>Cmd + .</kbd> or <kbd data-v-c4dc3b66>Ctrl + .</kbd> - Stops audio playback.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Evaluate Binary</strong>: <kbd data-v-c4dc3b66>Ctrl + Enter</kbd> - Will execute the score using original Fortran MUSIC V binary compilation (future implementation).</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Clear Editor</strong>: <kbd data-v-c4dc3b66>Ctrl + H</kbd> - Wipes the editor content.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Clear Console</strong>: <kbd data-v-c4dc3b66>Ctrl + P</kbd> - Clears the console output.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Storage Menu</strong>: <kbd data-v-c4dc3b66>Ctrl + M</kbd> - Opens the storage menu for saved codes.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Navigate Codes</strong>: <kbd data-v-c4dc3b66>Alt + Shift + ←/→</kbd> - Navigate between saved codes.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Show/Hide Code</strong>: Click the eye icon - Toggles visibility of generated code.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Mobile Evaluate</strong>: Tap &quot;Evaluate&quot; button - Triggers evaluation on mobile devices.</li></ul><h4 data-v-c4dc3b66>Future Implementations:</h4><ul data-v-c4dc3b66><li data-v-c4dc3b66><strong data-v-c4dc3b66>Save Session</strong>: <kbd data-v-c4dc3b66>Ctrl + S</kbd> - Save current session to local storage.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Load Preset</strong>: <kbd data-v-c4dc3b66>Ctrl + L</kbd> - Load predefined MUSIC V presets.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Visualize Waveform</strong>: <kbd data-v-c4dc3b66>Ctrl + W</kbd> - Display real-time waveform of generated audio.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Export WAV</strong>: <kbd data-v-c4dc3b66>Ctrl + E</kbd> - Export audio as a WAV file.</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>Speculative Synth</strong>: Combine MUSIC V with organogram-style instrument design for hybrid sound generation.</li></ul><h4 data-v-c4dc3b66>Operation Codes (Future Implementation):</h4><ul data-v-c4dc3b66><li data-v-c4dc3b66><strong data-v-c4dc3b66>INS</strong> - Define an instrument</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>OSC</strong> - Create an oscillator</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>OUT</strong> - Define output routing</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>END</strong> - End instrument definition</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>GEN</strong> - Generate function table</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>NOT</strong> - Define a note event</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>TER</strong> - Terminate score</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>ADD</strong> - Add signals</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>MUL</strong> - Multiply signals</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>ENV</strong> - Create envelope</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>FLT</strong> - Apply filter</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>DEL</strong> - Create delay</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>REV</strong> - Apply reverb</li><li data-v-c4dc3b66><strong data-v-c4dc3b66>COM</strong> - Add comment</li></ul><h4 data-v-c4dc3b66>Shortcuts:</h4><ul data-v-c4dc3b66><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Alt + Enter</kbd>: Evaluate TypeScript audio / Start playback</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Cmd + .</kbd> or <kbd data-v-c4dc3b66>Ctrl + .</kbd>: Stop playback</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + Enter</kbd>: Evaluate binary audio</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + H</kbd>: Clear editor</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + P</kbd>: Clear console</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + M</kbd>: Open storage menu</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Alt + Shift + ←/→</kbd>: Navigate between saved codes</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + S</kbd>: Save session (future)</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + L</kbd>: Load preset (future)</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + W</kbd>: Show waveform (future)</li><li data-v-c4dc3b66><kbd data-v-c4dc3b66>Ctrl + E</kbd>: Export WAV (future)</li></ul><p class="tip" data-v-c4dc3b66><strong data-v-c4dc3b66>Tip:</strong> Start with a simple score like <code data-v-c4dc3b66>INS 0 1; OSC P5 P6 B2 F2 P30; OUT B2 B1; END;</code> to hear a basic oscillator output, then experiment with parameters. </p><div class="reference" data-v-c4dc3b66><h4 data-v-c4dc3b66>Media Archaeology &amp; Design Insights</h4><p data-v-c4dc3b66> Mathews&#39; MUSIC V series, explored through media archaeology, uncovers a philosophical shift: music as code, not just sound. Its unit-generator model prefigures modular synths and DAWs, offering interface-design incentives—intuitive control over abstract processes. M5LIVE extends this legacy, merging historical patterns with modern web interactivity to inspire new sonic explorations. </p></div><div class="credits" data-v-c4dc3b66><h4 data-v-c4dc3b66>Academic Attribution</h4><p data-v-c4dc3b66> M5LIVE is a research project by Luciano Azzigotti, inspired by Max Mathews&#39; MUSIC V and media archaeological principles, developed within a broader study of speculative sound design. </p></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HelpModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HelpModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4dc3b66"]]);

function useFavicon() {
  const favicon = ref(null);
  let blinkInterval = null;
  let fadeTimeout = null;
  const initFavicon = () => {
    favicon.value = (void 0).querySelector("link[rel*='icon']");
    if (!favicon.value) {
      favicon.value = (void 0).createElement("link");
      favicon.value.type = "image/x-icon";
      favicon.value.rel = "shortcut icon";
      (void 0).head.appendChild(favicon.value);
    }
  };
  const createFavicon = (color) => {
    const canvas = (void 0).createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.fillRect(0, 0, 32, 32);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
    const opacityMatch = color.match(/[\d.]+\)$/);
    const opacity = opacityMatch ? parseFloat(opacityMatch[0]) : 1;
    const baseRadius = 7;
    const radius = Math.max(1, baseRadius + (1 - opacity) * 1.5);
    const centerY = 16;
    const spacing = 10;
    const centerX = 16;
    ctx.beginPath();
    ctx.arc(centerX - spacing / 2, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX + spacing / 2, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    return canvas.toDataURL();
  };
  const startProcessing = () => {
    initFavicon();
    if (!favicon.value) return;
    let opacity = 1;
    let increasing = false;
    if (blinkInterval) clearInterval(blinkInterval);
    if (fadeTimeout) clearTimeout(fadeTimeout);
    blinkInterval = setInterval(() => {
      if (increasing) {
        opacity += 0.1;
        if (opacity >= 1) {
          opacity = 1;
          increasing = false;
        }
      } else {
        opacity -= 0.1;
        if (opacity <= 0.3) {
          opacity = 0.3;
          increasing = true;
        }
      }
      const color = `rgba(200, 0, 0, ${opacity})`;
      if (favicon.value) {
        favicon.value.href = createFavicon(color);
      }
    }, 50);
  };
  const completeProcessing = () => {
    if (!favicon.value) return;
    if (blinkInterval) {
      clearInterval(blinkInterval);
      blinkInterval = null;
    }
    favicon.value.href = createFavicon("#00ff00");
    let opacity = 1;
    if (fadeTimeout) clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      const fadeInterval = setInterval(() => {
        opacity -= 0.1;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          if (favicon.value) {
            favicon.value.href = createFavicon("#ffffff");
          }
          return;
        }
        const color = `rgba(0, 255, 0, ${opacity})`;
        if (favicon.value) {
          favicon.value.href = createFavicon(color);
        }
      }, 50);
    }, 500);
  };
  return {
    startProcessing,
    completeProcessing
  };
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class MusicV {
  constructor() {
    __publicField(this, "sampleRate", 44100);
    __publicField(this, "parameters", new Float32Array(1e3));
    __publicField(this, "events", []);
    __publicField(this, "currentTime", 0);
    __publicField(this, "instruments", /* @__PURE__ */ new Map());
    __publicField(this, "functions", /* @__PURE__ */ new Map());
    __publicField(this, "currentInstrument", null);
    __publicField(this, "audioContext", null);
    __publicField(this, "workletNode", null);
    __publicField(this, "consoleOutput", "");
    __publicField(this, "isServer", typeof globalThis.window === "undefined");
    __publicField(this, "activeNotes", /* @__PURE__ */ new Map());
    __publicField(this, "pass2Report", []);
    __publicField(this, "globalVars", /* @__PURE__ */ new Map());
    this.initDefaultFunctionTables();
    if (!this.isServer) {
      this.setupKeyboardShortcuts();
    }
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
  setupKeyboardShortcuts() {
    (void 0).addEventListener("keydown", (event) => {
      const isMac = (void 0).platform.toUpperCase().indexOf("MAC") >= 0;
      const stopKey = isMac ? event.metaKey && event.key === "." : event.ctrlKey && event.key === ".";
      if (stopKey) {
        event.preventDefault();
        this.stopAndReset();
      }
    });
  }
  stopAndReset() {
    try {
      if (this.audioContext) {
        if (this.workletNode) {
          this.workletNode.port.postMessage({ type: "stop" });
          this.workletNode.disconnect();
          this.workletNode = null;
        }
        this.audioContext.suspend().then(() => {
          this.audioContext.close();
          this.audioContext = null;
          this.activeNotes.clear();
          this.events = [];
          this.currentTime = 0;
          this.consoleOutput = "";
          console.clear();
          console.log("MusicV stopped and reset via Command+./Ctrl+.");
          this.consoleOutput += "MusicV stopped and reset\n";
        });
      } else {
        this.activeNotes.clear();
        this.events = [];
        this.currentTime = 0;
        this.consoleOutput = "";
        console.clear();
        console.log("MusicV reset (no audio context active)");
        this.consoleOutput += "MusicV reset\n";
      }
    } catch (error) {
      console.error("Error during stop and reset:", error);
      this.consoleOutput += `Error during stop and reset: ${error.message}
`;
    }
  }
  parseScore(scoreText) {
    this.consoleOutput = "*** MUSIC V SCORE PROCESSING ***\n\n";
    this.events = [];
    this.instruments.clear();
    this.pass2Report = [];
    this.activeNotes.clear();
    this.globalVars.clear();
    const lines = scoreText.split("\n");
    let currentInstrumentId = -1;
    const instrumentUnitCounts = /* @__PURE__ */ new Map();
    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith(";")) continue;
      if (line.trim().startsWith("COM") || line.trim().startsWith("COMMENT")) {
        this.consoleOutput += `Comment: ${line.trim().substring(line.indexOf(" ") + 1)}
`;
        continue;
      }
      const parts = line.trim().split(/\s+/);
      const opcode = parts[0];
      const formattedLine = `${opcode.padEnd(8)}${parts.slice(1).map((p) => p.padEnd(9, " ")).join("")}`;
      this.pass2Report.push(formattedLine);
      switch (opcode) {
        case "INS":
          if (this.currentInstrument) {
            this.consoleOutput += `Instrument ${currentInstrumentId} definition complete

`;
            instrumentUnitCounts.set(currentInstrumentId, this.currentInstrument.units.length);
            this.pass2Report.push(`       ${currentInstrumentId}    ${this.currentInstrument.units.length}.000    0.000`);
          }
          currentInstrumentId = parseInt(parts[1], 10);
          this.currentInstrument = {
            id: currentInstrumentId,
            units: [],
            oscillators: [],
            outputs: []
          };
          this.instruments.set(currentInstrumentId, this.currentInstrument);
          this.consoleOutput += `Defining Instrument ${currentInstrumentId}
`;
          break;
        case "OSC":
          if (this.currentInstrument) {
            const freqParam = parts[1];
            const ampParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            const functionNum2 = parseInt(parts[4].substring(1), 10);
            const phaseParam = parts[5] || "P30";
            const oscId = this.currentInstrument.oscillators.length + 1;
            this.currentInstrument.oscillators.push({
              id: oscId,
              type: 1,
              freqParam,
              ampParam,
              outputBus: outputBlock,
              functionTable: functionNum2,
              phaseParam
            });
            this.currentInstrument.units.push({
              type: "OSC",
              params: { freqParam, ampParam, outputBlock, functionNum: functionNum2, phaseParam }
            });
            this.consoleOutput += `  OSC: Freq=${freqParam}, Amp=${ampParam}, Out=B${outputBlock}, Func=F${functionNum2}, Phase=${phaseParam}
`;
          }
          break;
        case "OUT":
          if (this.currentInstrument) {
            const inputBlock = parseInt(parts[1].substring(1), 10);
            const outputBlock = parseInt(parts[2].substring(1), 10);
            this.currentInstrument.outputs.push({ inputBus: inputBlock, outputBus: outputBlock });
            this.currentInstrument.units.push({
              type: "OUT",
              params: { inputBlock, outputBlock, amplitude: 1 }
            });
            this.consoleOutput += `  OUT: In=B${inputBlock}, Out=B${outputBlock}, Amp=1
`;
          }
          break;
        case "AD2":
          if (this.currentInstrument) {
            const input1 = parts[1].startsWith("P") ? parts[1] : parseInt(parts[1].substring(1), 10);
            const input2 = parts[2].startsWith("P") ? parts[2] : parseInt(parts[2].substring(1), 10);
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: "AD2",
              params: { input1, input2, outputBlock }
            });
            this.consoleOutput += `  AD2: In1=${input1}, In2=${input2}, Out=B${outputBlock}
`;
          }
          break;
        case "SET":
          if (this.currentInstrument) {
            const param = parts[1];
            this.currentInstrument.units.push({
              type: "SET",
              params: { param }
            });
            this.consoleOutput += `  SET: Param=${param}
`;
          }
          break;
        case "MLT":
          if (this.currentInstrument) {
            const input1 = parts[1].startsWith("P") ? parts[1] : parseInt(parts[1].substring(1), 10);
            const input2 = parts[2].startsWith("P") ? parts[2] : parseInt(parts[2].substring(1), 10);
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: "MLT",
              params: { input1, input2, outputBlock }
            });
            this.consoleOutput += `  MLT: In1=${input1}, In2=${input2}, Out=B${outputBlock}
`;
          }
          break;
        case "ENV":
          if (this.currentInstrument) {
            const ampParam = parts[1];
            const durParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            const functionNum2 = parseInt(parts[4].substring(1), 10);
            const phaseParam = parts[5] || "P30";
            this.currentInstrument.units.push({
              type: "ENV",
              params: { ampParam, durParam, outputBlock, functionNum: functionNum2, phaseParam }
            });
            this.consoleOutput += `  ENV: Amp=${ampParam}, Dur=${durParam}, Out=B${outputBlock}, Func=F${functionNum2}, Phase=${phaseParam}
`;
          }
          break;
        case "SIA":
          const siaTime = parseFloat(parts[1]);
          const varNum = parseInt(parts[2], 10);
          const value = parseInt(parts[3], 10);
          this.globalVars.set(varNum, value);
          if (varNum === 4) this.sampleRate = value;
          this.events.push({ type: "sia", time: siaTime, varNum, value });
          this.consoleOutput += `SIA: Time=${siaTime}, Var=${varNum}, Value=${value} (SampleRate=${this.sampleRate})
`;
          break;
        case "SV2":
          const sv2Time = parseFloat(parts[1]);
          const sv2VarNum = parseInt(parts[2], 10);
          const sv2Value = parseFloat(parts[3]);
          this.events.push({ type: "sv2", time: sv2Time, varNum: sv2VarNum, value: sv2Value });
          this.consoleOutput += `SV2: Time=${sv2Time}, Var=P${sv2VarNum}, Value=${sv2Value}
`;
          break;
        case "END":
          if (this.currentInstrument) {
            this.consoleOutput += `Instrument ${currentInstrumentId} definition complete

`;
            instrumentUnitCounts.set(currentInstrumentId, this.currentInstrument.units.length);
            this.currentInstrument = null;
          }
          break;
        case "GEN":
          const functionNum = parseInt(parts[3], 10);
          const params = parts.slice(4).map((p) => parseFloat(p));
          this.handleGenFunction(functionNum, parseInt(parts[1]), parseInt(parts[2]), params);
          this.consoleOutput += `GEN: Function=${functionNum}, Params=${params.length}
`;
          break;
        case "NOT":
          const startTime = parseFloat(parts[1]);
          const insNum = parseInt(parts[2], 10);
          const amplitude = parseFloat(parts[3]);
          const frequency = parseFloat(parts[4]);
          const duration = parseFloat(parts[5]);
          const p6 = parts[6] ? parseFloat(parts[6]) : void 0;
          const p7 = parts[7] ? parseFloat(parts[7]) : void 0;
          const p8 = parts[8] ? parseFloat(parts[8]) : void 0;
          this.events.push({
            type: "note",
            time: startTime,
            insNum,
            frequency,
            amplitude,
            duration,
            p6,
            p7,
            p8
          });
          this.consoleOutput += `Note: Start=${startTime}, Ins=${insNum}, Amp=${amplitude}, Freq=${frequency}, Dur=${duration}${p6 ? `, P6=${p6}` : ""}${p7 ? `, P7=${p7}` : ""}${p8 ? `, P8=${p8}` : ""}
`;
          console.log(`Added note event: Start=${startTime}, Ins=${insNum}, Amp=${amplitude}, Freq=${frequency}, Dur=${duration}`);
          break;
        case "TER":
          const terminationTime = parseFloat(parts[1]);
          this.events.push({ type: "termination", time: terminationTime });
          this.consoleOutput += `Termination time: ${terminationTime}

`;
          console.log(`Added termination event at ${terminationTime}s`);
          break;
        case "SV3":
          this.consoleOutput += `SV3: Set variable in Pass III (not implemented)
`;
          break;
        case "SEC":
          this.consoleOutput += `SEC: End section (not implemented)
`;
          break;
        case "SV1":
          this.consoleOutput += `SV1: Set variable in Pass I (not implemented)
`;
          break;
        case "PLF":
          this.consoleOutput += `PLF: Execute subroutine in Pass I (not implemented)
`;
          break;
        case "PLS":
          this.consoleOutput += `PLS: Execute subroutine in Pass II (not implemented)
`;
          break;
        case "SI3":
          this.consoleOutput += `SI3: Set integer in Pass III (not implemented)
`;
          break;
        case "RAN":
          this.consoleOutput += `RAN: Random generator (not implemented)
`;
          break;
        case "STR":
          this.consoleOutput += `STR: Stereo output (not implemented)
`;
          break;
        case "AD3":
          this.consoleOutput += `AD3: Three-input adder (not implemented)
`;
          break;
        case "AD4":
          this.consoleOutput += `AD4: Four-input adder (not implemented)
`;
          break;
        case "FLT":
          this.consoleOutput += `FLT: Filter (not implemented)
`;
          break;
        case "RAH":
          this.consoleOutput += `RAH: Random and hold (not implemented)
`;
          break;
        case "IOS":
          this.consoleOutput += `IOS: Interpolating oscillator (not implemented)
`;
          break;
        default:
          this.consoleOutput += `Unknown opcode: ${opcode} (skipped)
`;
      }
    }
    this.events.sort((a, b) => a.time - b.time);
    this.processPass2();
  }
  processPass2() {
    this.consoleOutput += "1PASS II REPORT\n0(WORD CNT)\n";
    this.pass2Report.forEach((line) => this.consoleOutput += `${line}
`);
    this.instruments.forEach((instrument, id) => {
      this.consoleOutput += `       ${id.toString().padStart(2)}    ${instrument.units.length.toFixed(3).padStart(6)}    0.000
`;
    });
    for (const event of this.events) {
      if (event.type === "sv2") {
        const { time, varNum, value } = event;
        for (const noteEvent of this.events) {
          if (noteEvent.type === "note" && noteEvent.time >= time) {
            switch (varNum) {
              case 5:
                noteEvent.frequency = value;
                break;
              case 6:
                noteEvent.p6 = value;
                break;
              case 7:
                noteEvent.p7 = value;
                break;
              case 8:
                noteEvent.p8 = value;
                break;
              default:
                this.consoleOutput += `SV2: Unsupported varNum P${varNum}
`;
                break;
            }
            this.consoleOutput += `SV2 applied at ${time}s: P${varNum}=${value} to note at ${noteEvent.time}s
`;
          }
        }
      }
    }
    this.consoleOutput += "END OF PASS II\n\nScore processing complete\n";
  }
  processOscillator(unit, note, blocks, currentTime) {
    var _a, _b;
    const { freqParam, ampParam, outputBlock, functionNum, phaseParam } = unit.params;
    const frequency = freqParam.startsWith("B") ? ((_a = blocks.get(parseInt(freqParam.substring(1)))) == null ? void 0 : _a[0]) || 0 : note[freqParam.toLowerCase()] || note.frequency || 440;
    const amplitude = ampParam.startsWith("B") ? ((_b = blocks.get(parseInt(ampParam.substring(1)))) == null ? void 0 : _b[0]) || 0 : note[ampParam.toLowerCase()] || note.amplitude || 0.5;
    const functionData = this.functions.get(functionNum) || this.functions.get(2);
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    if (!note.oscState) {
      const initialPhase = phaseParam.startsWith("P") ? note[phaseParam.toLowerCase()] || 0 : 0;
      note.oscState = { sum: initialPhase };
    }
    const tableSize = functionData.length;
    const increment = frequency * tableSize / this.sampleRate;
    note.oscState.sum += increment;
    const index = Math.floor(note.oscState.sum % (tableSize - 1));
    const value = functionData[index];
    output[0] = value * amplitude;
    if (freqParam.startsWith("B") && parseInt(freqParam.substring(1)) === outputBlock) {
      output[0] *= 0.9;
    }
    if (currentTime < 0.01 || Math.random() < 0.01) {
      console.log(`OSC at ${currentTime.toFixed(2)}s: Freq=${frequency.toFixed(2)}, Amp=${amplitude.toFixed(2)}, Value=${value.toFixed(6)}, Out=B${outputBlock}=${output[0].toFixed(6)}`);
    }
  }
  processOutput(unit, blocks) {
    var _a;
    const { inputBlock, outputBlock, amplitude } = unit.params;
    const input = ((_a = blocks.get(inputBlock)) == null ? void 0 : _a[0]) || 0;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] += input * amplitude;
  }
  processAd2(unit, note, blocks) {
    var _a, _b;
    const { input1, input2, outputBlock } = unit.params;
    const input1Value = typeof input1 === "string" ? note[input1.toLowerCase()] || 0 : ((_a = blocks.get(input1)) == null ? void 0 : _a[0]) || 0;
    const input2Value = typeof input2 === "string" ? note[input2.toLowerCase()] || 0 : ((_b = blocks.get(input2)) == null ? void 0 : _b[0]) || 0;
    const sum = input1Value + input2Value;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] = sum;
    console.log(`AD2: In1=${input1Value.toFixed(6)}, In2=${input2Value.toFixed(6)}, Sum=${sum.toFixed(6)} -> B${outputBlock}`);
  }
  processSet(unit, note, blocks, instrumentUnits) {
    const { param } = unit.params;
    const paramValue = note[param.toLowerCase()] || 0;
    const currentIndex = instrumentUnits.findIndex((u) => u === unit);
    for (let i = currentIndex + 1; i < instrumentUnits.length; i++) {
      if (instrumentUnits[i].type === "OSC") {
        instrumentUnits[i].params.functionNum = Math.floor(paramValue) || instrumentUnits[i].params.functionNum;
        console.log(`SET: Updated OSC functionNum to ${instrumentUnits[i].params.functionNum} from ${param}`);
        break;
      }
    }
  }
  processMlt(unit, note, blocks) {
    var _a, _b;
    const { input1, input2, outputBlock } = unit.params;
    const input1Value = typeof input1 === "string" ? note[input1.toLowerCase()] || 0 : ((_a = blocks.get(input1)) == null ? void 0 : _a[0]) || 0;
    const input2Value = typeof input2 === "string" ? note[input2.toLowerCase()] || 0 : ((_b = blocks.get(input2)) == null ? void 0 : _b[0]) || 0;
    const product = input1Value * input2Value;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] = product;
    console.log(`MLT: In1=${input1Value.toFixed(6)}, In2=${input2Value.toFixed(6)}, Product=${product.toFixed(6)} -> B${outputBlock}`);
  }
  processEnv(unit, note, blocks, currentTime) {
    var _a, _b;
    const { ampParam, durParam, outputBlock, functionNum, phaseParam } = unit.params;
    const amplitude = ampParam.startsWith("B") ? ((_a = blocks.get(parseInt(ampParam.substring(1)))) == null ? void 0 : _a[0]) || 0 : note[ampParam.toLowerCase()] || note.amplitude || 0.5;
    const duration = durParam.startsWith("P") ? note[durParam.toLowerCase()] || note.duration || 1 : ((_b = blocks.get(parseInt(durParam.substring(1)))) == null ? void 0 : _b[0]) || note.duration || 1;
    const functionData = this.functions.get(functionNum) || this.functions.get(2);
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    if (!note.envState) {
      const initialTime = phaseParam.startsWith("P") ? note[phaseParam.toLowerCase()] || 0 : 0;
      note.envState = { time: initialTime };
    }
    const elapsedTime = currentTime - note.startTime;
    const t = Math.min(elapsedTime / duration, 1);
    const index = Math.floor(t * (functionData.length - 1));
    const value = functionData[index];
    output[0] = value * amplitude;
    if (currentTime < 0.01 || Math.random() < 0.01) {
      console.log(`ENV at ${currentTime.toFixed(2)}s: Amp=${amplitude.toFixed(2)}, Dur=${duration.toFixed(2)}, T=${t.toFixed(2)}, Value=${value.toFixed(6)}, Out=B${outputBlock}=${output[0].toFixed(6)}`);
    }
  }
  generateSample(currentTime, blocks) {
    var _a;
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
              case "OSC":
                this.processOscillator(unit, note, blocks, currentTime);
                break;
              case "OUT":
                this.processOutput(unit, blocks);
                break;
              case "AD2":
                this.processAd2(unit, note, blocks);
                break;
              case "SET":
                this.processSet(unit, note, blocks, instrument.units);
                break;
              case "MLT":
                this.processMlt(unit, note, blocks);
                break;
              case "ENV":
                this.processEnv(unit, note, blocks, currentTime);
                break;
              case "RAN":
                console.log("RAN: Not implemented");
                break;
              case "STR":
                console.log("STR: Not implemented");
                break;
              case "AD3":
                console.log("AD3: Not implemented");
                break;
              case "AD4":
                console.log("AD4: Not implemented");
                break;
              case "FLT":
                console.log("FLT: Not implemented");
                break;
              case "RAH":
                console.log("RAH: Not implemented");
                break;
              case "IOS":
                console.log("IOS: Not implemented");
                break;
            }
          }
        }
      } else if (currentTime > noteEndTime) {
        this.activeNotes.delete(noteNum);
      }
    }
    const rawSample = ((_a = blocks.get(1)) == null ? void 0 : _a[0]) || 0;
    const masterGain = 0.5;
    const finalSample = rawSample * masterGain;
    if (currentTime < 0.01 || Math.random() < 0.01) {
      console.log(`Sample at ${currentTime.toFixed(2)}s: Raw=${rawSample.toFixed(6)}, Gain=${masterGain}, Final=${finalSample.toFixed(6)}`);
    }
    return finalSample;
  }
  async generateSound(duration = 8) {
    try {
      const numSamples = Math.floor(this.sampleRate * duration);
      const outputBuffer = new Float32Array(numSamples);
      this.currentTime = 0;
      const blocks = /* @__PURE__ */ new Map([[1, new Float32Array(1)]]);
      this.activeNotes.clear();
      const eventsCopy = [...this.events];
      for (let i = 0; i < numSamples; i++) {
        const currentTimeInSeconds = i / this.sampleRate;
        while (eventsCopy.length > 0 && eventsCopy[0].time <= currentTimeInSeconds) {
          const event = eventsCopy.shift();
          this.processEvent(event, currentTimeInSeconds);
        }
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
    switch (event.type) {
      case "note":
        const instrument = this.instruments.get(event.insNum);
        if (instrument) {
          const noteNum = Date.now() + Math.random();
          const instrumentCopy = JSON.parse(JSON.stringify(instrument));
          this.activeNotes.set(noteNum, {
            instrument: instrumentCopy,
            startTime: currentTime,
            duration: event.duration,
            frequency: event.frequency,
            amplitude: event.amplitude,
            p6: event.p6,
            p7: event.p7,
            p8: event.p8,
            p29: event.p29,
            p30: event.p30
          });
          console.log(`Note started: Instrument=${event.insNum}, Freq=${event.frequency}, Amp=${event.amplitude}`);
        } else {
          this.consoleOutput += `Error: Instrument ${event.insNum} not found
`;
        }
        break;
      case "sia":
        this.globalVars.set(event.varNum, event.value);
        if (event.varNum === 4) this.sampleRate = event.value;
        break;
      case "sv2":
        break;
      case "termination":
        this.activeNotes.clear();
        break;
    }
  }
  async initAudio() {
    if (!this.audioContext) {
      try {
        console.log("Initializing audio context...");
        if (this.isServer) throw new Error("Cannot initialize audio in server environment");
        this.audioContext = new AudioContext({ sampleRate: this.sampleRate, latencyHint: "interactive" });
        console.log("Audio context created with sample rate:", this.audioContext.sampleRate);
        if (this.audioContext.state === "suspended") {
          console.log("Audio context is suspended, attempting to resume...");
          await this.audioContext.resume();
          console.log("Audio context resumed successfully");
        }
        const workletUrl = "/musicVWorklet.js";
        console.log("Loading worklet from URL:", workletUrl);
        try {
          await this.audioContext.audioWorklet.addModule(workletUrl);
          console.log("Worklet module loaded successfully!");
        } catch (workletError) {
          console.error("Failed to load worklet module:", workletError);
          const fallbackUrl = "./musicVWorklet.js";
          console.log("Trying fallback URL:", fallbackUrl);
          await this.audioContext.audioWorklet.addModule(fallbackUrl);
          console.log("Worklet module loaded successfully from fallback URL!");
        }
        console.log("Creating AudioWorkletNode with processor name: music-v-processor");
        this.workletNode = new AudioWorkletNode(this.audioContext, "music-v-processor", {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          outputChannelCount: [1],
          processorOptions: { sampleRate: this.sampleRate }
        });
        this.workletNode.connect(this.audioContext.destination);
        console.log("AudioWorkletNode connected to destination");
        this.workletNode.onprocessorerror = (error) => {
          console.error("Worklet processor error:", error);
          this.consoleOutput += `Audio processing error: ${error.message || "Unknown error"}
`;
        };
        let terminationTime = 8;
        const terEvent = this.events.find((e) => e.type === "termination");
        if (terEvent) {
          terminationTime = terEvent.time;
          console.log(`Found termination time for init: ${terminationTime}s`);
        }
        console.log("Sending initialization data to worklet...");
        this.workletNode.port.postMessage({
          type: "init",
          events: this.events.map((e) => ({ ...e })),
          instruments: Object.fromEntries(this.instruments),
          functions: Array.from(this.functions).reduce((obj, [key, value]) => {
            obj[key] = Array.from(value);
            return obj;
          }, {}),
          sampleRate: this.sampleRate,
          terminationTime,
          masterGain: 0.5
        });
        console.log("Initialization data sent to worklet");
      } catch (error) {
        console.error("Failed to initialize audio:", error);
        this.consoleOutput += `Failed to initialize audio: ${error.message || "Unknown error"}
`;
        throw new Error(`Failed to initialize audio: ${error.message || "Unknown error"}`);
      }
    } else if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
      console.log("Existing audio context resumed");
    }
  }
  async play() {
    try {
      if (!this.audioContext) await this.initAudio();
      if (!this.audioContext || !this.workletNode) throw new Error("Audio system not properly initialized");
      if (this.audioContext.state === "suspended") {
        console.log("Resuming audio context for playback...");
        await this.audioContext.resume();
        console.log("Audio context resumed:", this.audioContext.state);
      }
      let terminationTime = 8;
      const terEvent = this.events.find((e) => e.type === "termination");
      if (terEvent) {
        terminationTime = terEvent.time;
        console.log(`Found termination time: ${terminationTime}s`);
      }
      console.log(`Sending ${this.events.length} events to worklet:`);
      this.events.forEach((e, i) => {
        console.log(`Event ${i}: ${e.type} at ${e.time}s: ${e.type === "note" ? `ins=${e.insNum}, freq=${e.frequency}, amp=${e.amplitude}, dur=${e.duration}` : ""}`);
      });
      this.workletNode.port.postMessage({
        type: "play",
        events: this.events.map((e) => ({ ...e })),
        currentTime: 0,
        terminationTime
      });
      console.log("Play command sent to audio worklet");
      this.consoleOutput += "Audio playback started\n";
    } catch (error) {
      console.error("Failed to start audio playback:", error);
      this.consoleOutput += `Failed to start audio playback: ${error.message || "Unknown error"}
`;
      throw new Error(`Failed to start audio playback: ${error.message || "Unknown error"}`);
    }
  }
  stop() {
    try {
      if (this.audioContext) {
        if (this.workletNode) {
          this.workletNode.port.postMessage({ type: "stop" });
        }
        this.audioContext.suspend();
        console.log("Audio playback stopped");
        this.consoleOutput += "Audio playback stopped\n";
      }
    } catch (error) {
      console.error("Failed to stop audio playback:", error);
      this.consoleOutput += `Failed to stop audio playback: ${error.message || "Unknown error"}
`;
    }
  }
  handleGenFunction(functionNum, genType, normalization, params) {
    const functionData = new Float32Array(512);
    if (genType === 0 || genType === 1) {
      const points = [];
      for (let i = 0; i < params.length; i += 2) {
        const value = params[i] || 0;
        const position = Math.floor(params[i + 1] || (i === params.length - 1 ? 511 : 0));
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
      this.consoleOutput += `Function table ${functionNum} created with ${points.length} points
`;
      console.log(`F${functionNum} sample values: [0]=${functionData[0]}, [50]=${functionData[50]}, [205]=${functionData[205]}, [306]=${functionData[306]}, [461]=${functionData[461]}, [511]=${functionData[511]}`);
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
    console.log(`Created function table F${functionNum} with ${functionData.length} points`);
  }
  getConsoleOutput() {
    return this.consoleOutput;
  }
  getFunctionTables() {
    return Array.from(this.functions.entries()).map(([functionNum, data]) => ({
      functionNum,
      data: Array.from(data)
    }));
  }
}

export { AceEditor as A, HelpModal as H, MusicV as M, useFavicon as u };
//# sourceMappingURL=musicV.mjs.map
