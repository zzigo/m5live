import { ref, mergeProps, useSSRContext, reactive, watch, nextTick } from 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList } from 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './server.mjs';
import { p as publicAssetsURL } from '../_/renderer.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/hookable/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unctx/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/h3/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/radix3/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/defu/dist/defu.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/ufo/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unhead/dist/server.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unhead/dist/utils.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/destr/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/node-mock-http/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/klona/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/scule/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/ohash/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/pathe/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/devalue/index.js';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unhead/dist/plugins.mjs';

const _sfc_main$2 = {
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
      clearEditor: () => false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "ace-editor-container",
        ref_key: "editorContainer",
        ref: editorContainer
      }, _attrs))} data-v-103e6f72><div class="${ssrRenderClass([{ "editor": __props.mode === "editor", "terminal": __props.mode === "terminal" }, "editor"])}" data-v-103e6f72></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AceEditor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AceEditor = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-103e6f72"]]);

const _imports_0 = publicAssetsURL("/hkb.svg");

const _sfc_main$1 = {
  __name: "HelpModal",
  __ssrInlineRender: true,
  props: {
    modelValue: Boolean
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-a3a48482><div class="modal-content" data-v-a3a48482><div class="modal-header" data-v-a3a48482><h2 data-v-a3a48482>Welcome to SOOG</h2><button class="close-button" data-v-a3a48482>×</button></div><div class="modal-body" data-v-a3a48482><h3 data-v-a3a48482>The Speculative Organology Organogram Generator</h3><p data-v-a3a48482> SOOG helps you visualize musical instruments based on the organogram technique from ethnomusicologist Mantle Hood. It can also help create speculative instruments by mixing, morphing, and entangling geometrical and acoustical information. </p><h4 data-v-a3a48482>How it works:</h4><ol data-v-a3a48482><li data-v-a3a48482>Abstract instrument shapes using geometrical figures to represent resonant acoustical spaces</li><li data-v-a3a48482>Abstract interfaces with different colored geometrical figures and indicate movements with arrows</li><li data-v-a3a48482>Mix different acoustical shapes to create new polygons or freehand drawings</li><li data-v-a3a48482>View spectrum simulations of acoustical shapes when available</li><li data-v-a3a48482>Represent measurable components with light-blue numbers (e.g., strings, holes, keys)</li></ol><h4 data-v-a3a48482>Organogram Basics:</h4><ul data-v-a3a48482><li data-v-a3a48482><strong data-v-a3a48482>Instrument Types:</strong><ul data-v-a3a48482><li data-v-a3a48482>Idiophones: squares</li><li data-v-a3a48482>Membranophones: horizontal rectangles</li><li data-v-a3a48482>Chordophones: vertical rectangles</li><li data-v-a3a48482>Aerophones: circles</li><li data-v-a3a48482>Electronophones: rhombus</li></ul></li><li data-v-a3a48482><strong data-v-a3a48482>Special Markings:</strong><ul data-v-a3a48482><li data-v-a3a48482>Genus: marked with semi-circle</li><li data-v-a3a48482>Performer position: little white circle with dotted line</li><li data-v-a3a48482>Electronic components: <ul data-v-a3a48482><li data-v-a3a48482>Microphones: small rhombus</li><li data-v-a3a48482>Speakers: small horizontal cone (rotated to focus on sweet spot)</li></ul></li><li data-v-a3a48482>Arrows: Used for connections/relationships (with proportional heads)</li><li data-v-a3a48482>Aerophone tubes: Parallel lines (straight) or conical lines (conical)</li></ul></li><li data-v-a3a48482><strong data-v-a3a48482>Materials (Colors):</strong><ul data-v-a3a48482><li data-v-a3a48482>Wood: orange</li><li data-v-a3a48482>Bamboo: yellow</li><li data-v-a3a48482>Skin: pink</li><li data-v-a3a48482>Glass: green</li><li data-v-a3a48482>Stone: white</li><li data-v-a3a48482>Water: blue</li><li data-v-a3a48482>Gourd: beige</li><li data-v-a3a48482>Earth: brown</li><li data-v-a3a48482>Plastic: grey</li><li data-v-a3a48482>Bone: light grey</li></ul></li><li data-v-a3a48482><strong data-v-a3a48482>Symbols (Orange):</strong> H=hammer, Y=lacing, P=precise, R=relative, C=cord/string, Ri=ring, M=male, F=female</li></ul><h4 data-v-a3a48482>Commands:</h4><ul data-v-a3a48482><li data-v-a3a48482><kbd data-v-a3a48482>Alt</kbd> + <kbd data-v-a3a48482>Enter</kbd>: Evaluate selected text or all text if nothing is selected</li><li data-v-a3a48482><kbd data-v-a3a48482>Ctrl</kbd> + <kbd data-v-a3a48482>H</kbd>: Clear editor content</li><li data-v-a3a48482><kbd data-v-a3a48482>Ctrl</kbd> + <kbd data-v-a3a48482>↑</kbd>/<kbd data-v-a3a48482>↓</kbd> (<kbd data-v-a3a48482>⌘</kbd> + <kbd data-v-a3a48482>↑</kbd>/<kbd data-v-a3a48482>↓</kbd> on Mac): Navigate command history</li><li data-v-a3a48482>Click the eye icon to show/hide generated code</li><li data-v-a3a48482>Click the trash icon to clear editor content</li><li data-v-a3a48482>On mobile devices, use the &quot;Evaluate&quot; button at the bottom of the screen</li></ul><p class="tip" data-v-a3a48482><strong data-v-a3a48482>Tip:</strong> Start by describing an instrument or a combination of instruments you&#39;d like to visualize. SOOG will help you create an organogram representation. </p><div class="reference" data-v-a3a48482><p data-v-a3a48482> The organogram methodology implemented in SOOG represents an extension of the original visualization technique developed by ethnomusicologist Mantle Hood. For comprehensive information about the foundational organogram system, please refer to: </p><p class="citation" data-v-a3a48482> Hood, Mantle (1982). <em data-v-a3a48482>The ethnomusicologist</em> (2nd ed.). Kent State University Press. </p></div><div class="credits" data-v-a3a48482><h4 data-v-a3a48482>Academic Attribution</h4><p data-v-a3a48482> SOOG is a research project developed by Luciano Azzigotti in conjunction with the doctoral dissertation &quot;<em data-v-a3a48482>Speculative Organology</em>&quot; within the Specialized Master and PhD in Music Performance Research programme at the Hochschule der Künste Bern. </p><div class="supervisors" data-v-a3a48482><p data-v-a3a48482>Under the supervision of:</p><ul data-v-a3a48482><li data-v-a3a48482>Artistic Supervisor: Irene Galindo Quero</li><li data-v-a3a48482>Scientific Supervisor: Prof. Dr. Michael Harenberg</li></ul></div><div class="institution" data-v-a3a48482><img${ssrRenderAttr("src", _imports_0)} alt="Hochschule der Künste Bern" class="hkb-logo" data-v-a3a48482></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HelpModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HelpModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a3a48482"]]);

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

const defaultScore = `
INS 0 1 ;
OSC P5 P6 B2 F2 P30;
OUT B2 B1;
END;
GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;
NOT 0 1 .50 125 8.45;
NOT .75 1 .17 250 8.45;
NOT 4.00 2 .50 500 8.46;
TER 8.00 ;
`;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const logger = {
      debug: (context, message, ...args) => {
        if (debugMode && debugMode.value) {
          console.debug(`[${context}]`, message, ...args);
        }
      },
      info: (context, message, ...args) => {
        console.info(`[${context}]`, message, ...args);
      },
      warn: (context, message, ...args) => {
        console.warn(`[${context}]`, message, ...args);
      },
      error: (context, message, ...args) => {
        console.error(`[${context}]`, message, ...args);
      }
    };
    const musicV = new MusicV();
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
    ref(0);
    const isMobileOrTablet = ref(false);
    const showLightbox = ref(false);
    const audioUrl = ref(null);
    const functionTables = ref([]);
    const canvasRefs = reactive({});
    const currentTitle = ref("");
    const debugMode = ref(false);
    const codes = ref([]);
    const newCode = ref({ title: "", year: (/* @__PURE__ */ new Date()).getFullYear(), composer: "", comments: "", code: "" });
    const selectedCodeIndex = ref(-1);
    const selectedCode = ref(null);
    const formFields = ref({ ...newCode.value });
    ref(false);
    const scoreEditorFlex = ref(0.85);
    const consoleEditorFlex = ref(0.15);
    ref(0);
    ref(0);
    ref(0);
    const handleClear = () => {
      var _a;
      return (_a = scoreEditorRef.value) == null ? void 0 : _a.clearEditor();
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
      var _a, _b, _c;
      const text = (_b = (_a = scoreEditorRef.value) == null ? void 0 : _a.aceEditor()) == null ? void 0 : _b.getValue();
      if (!(text == null ? void 0 : text.trim())) {
        error.value = "Please enter some text to evaluate.";
        return;
      }
      loading.value = true;
      startProcessing();
      (_c = consoleEditorRef.value) == null ? void 0 : _c.addTerminalOutput("musicV fortran binaries original render next");
      loading.value = false;
      completeProcessing();
    };
    const handleEvaluateTS = async (text = null) => {
      var _a, _b, _c, _d, _e, _f;
      const evalText = text ?? ((_b = (_a = scoreEditorRef.value) == null ? void 0 : _a.aceEditor()) == null ? void 0 : _b.getValue());
      if (!evalText || typeof evalText !== "string" || !evalText.trim()) {
        error.value = "Please enter some text to evaluate.";
        return;
      }
      loading.value = true;
      startProcessing();
      const stopProgress = startProgress();
      try {
        (_c = consoleEditorRef.value) == null ? void 0 : _c.addTerminalOutput("");
        resetMusicV();
        clearOscilloscopes();
        await nextTick();
        musicV.value.parseScore(evalText);
        (_d = consoleEditorRef.value) == null ? void 0 : _d.addTerminalOutput(musicV.value.getConsoleOutput());
        await musicV.value.initAudio();
        await musicV.value.play();
        const audioBuffer = await musicV.value.generateSound(10);
        const wavBlob = createWavBlob(audioBuffer, 44100);
        audioUrl.value = URL.createObjectURL(wavBlob);
        (_e = consoleEditorRef.value) == null ? void 0 : _e.addTerminalOutput(`Audio generated: ${audioUrl.value}`);
        const newTables = musicV.value.getFunctionTables();
        if (debugMode.value) {
          logger.debug("App", `Found ${newTables.length} function tables`);
        }
        functionTables.value = newTables;
      } catch (err) {
        (_f = consoleEditorRef.value) == null ? void 0 : _f.addTerminalOutput(`Error: ${err.message}`);
      } finally {
        stopProgress();
        loading.value = false;
        completeProcessing();
      }
    };
    watch(functionTables, (newTables) => {
      Object.keys(canvasRefs).forEach((key) => {
        const canvas = canvasRefs[key];
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
      const currentTableNums = newTables.map((table) => table.functionNum);
      Object.keys(canvasRefs).forEach((key) => {
        if (!currentTableNums.includes(parseInt(key))) {
          delete canvasRefs[key];
        }
      });
      if (debugMode.value) {
        logger.debug("App", `Drawing ${newTables.length} oscilloscopes`);
      }
      setTimeout(() => newTables.forEach(drawOscilloscope), 0);
    }, { deep: true });
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Enter") {
        event.preventDefault();
        handleEvaluateTS();
      } else if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        handleEvaluateBinary();
      } else if (event.ctrlKey && event.key === "h") {
        event.preventDefault();
        handleClear();
      }
    };
    const resetMusicV = () => {
      musicV.value = new MusicV();
      if (debugMode && debugMode.value) {
        console.debug("Reset MusicV instance");
      }
    };
    const createWavBlob = (audioData, sampleRate) => {
      const bufferLength = audioData.length * 2;
      const buffer = new ArrayBuffer(44 + bufferLength);
      const view = new DataView(buffer);
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
      };
      writeString(0, "RIFF");
      view.setUint32(4, 36 + bufferLength, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, bufferLength, true);
      const masterGain = 0.1;
      let index2 = 44;
      for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i] * masterGain));
        const int16Sample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(index2, int16Sample, true);
        index2 += 2;
      }
      return new Blob([buffer], { type: "audio/wav" });
    };
    const updateCodeContent = (value) => {
      if (selectedCode.value) {
        selectedCode.value.code = value;
        formFields.value.code = value;
      }
    };
    const drawOscilloscope = (table) => {
      if (!table || !table.functionNum || !table.data || table.data.length === 0) {
        if (debugMode.value) {
          logger.warn("Oscilloscope", `Invalid function table data for F${(table == null ? void 0 : table.functionNum) || "unknown"}`);
        }
        return;
      }
      const canvas = canvasRefs[table.functionNum];
      if (!canvas) {
        if (debugMode.value) {
          logger.warn("Oscilloscope", `Canvas not found for function table F${table.functionNum}`);
        }
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        if (debugMode.value) {
          logger.warn("Oscilloscope", `Could not get 2D context for canvas F${table.functionNum}`);
        }
        return;
      }
      if (debugMode.value) {
        logger.debug("Oscilloscope", `Drawing function table F${table.functionNum} with ${table.data.length} points`);
      }
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
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      let minVal = Infinity, maxVal = -Infinity;
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
      try {
        for (let i = 0; i < dataLength; i++) {
          const x = i / (dataLength - 1) * width;
          const normalizedValue = (data[i] - minVal) / (maxVal - minVal);
          const y = (1 - normalizedValue) * height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = "#00ff00";
        ctx.font = "9px monospace";
        ctx.fillText(`${maxVal.toFixed(2)}`, 2, 8);
        ctx.fillText(`${minVal.toFixed(2)}`, 2, height - 2);
        ctx.fillText(`${dataLength}p`, width - 25, 8);
      } catch (err) {
        if (debugMode.value) {
          logger.error("Oscilloscope", `Error drawing oscilloscope for F${table.functionNum}:`, err);
        }
      }
    };
    const clearOscilloscopes = () => {
      Object.keys(canvasRefs).forEach((key) => {
        const canvas = canvasRefs[key];
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
      Object.keys(canvasRefs).forEach((key) => {
        delete canvasRefs[key];
      });
      functionTables.value = [];
      if (debugMode.value) {
        logger.debug("App", "Cleared all oscilloscopes");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-container" }, _attrs))} data-v-d9a2155b><div class="settings" data-v-d9a2155b><button class="icon-button"${ssrRenderAttr("title", showCode.value ? "Hide Code" : "Show Code")} data-v-d9a2155b>`);
      if (showCode.value) {
        _push(`<svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" data-v-d9a2155b></path></svg>`);
      } else {
        _push(`<svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" data-v-d9a2155b></path></svg>`);
      }
      if (currentTitle.value) {
        _push(`<span class="current-title" data-v-d9a2155b>${ssrInterpolate(currentTitle.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button class="icon-button" title="Evaluate Binary (Ctrl+Enter)" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" data-v-d9a2155b></path></svg><span class="f-subscript" data-v-d9a2155b>F</span></button><button class="icon-button" title="Evaluate TS (Alt+Enter)" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" data-v-d9a2155b></path></svg><span class="ts-subscript" data-v-d9a2155b>TS</span></button><button class="icon-button" title="Clear Editor (Ctrl+H)" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,21V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" data-v-d9a2155b></path></svg></button><button class="icon-button" title="Random Prompt" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" data-v-d9a2155b></path></svg></button><button class="icon-button" title="Help" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" data-v-d9a2155b></path></svg></button><button class="icon-button" title="Storage Menu (Ctrl+M)" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" data-v-d9a2155b></path></svg></button></div>`);
      if (showCode.value) {
        _push(`<div class="content-wrapper" data-v-d9a2155b><div class="editor-container" data-v-d9a2155b><div class="score-editor" style="${ssrRenderStyle({ flex: scoreEditorFlex.value })}" data-v-d9a2155b>`);
        _push(ssrRenderComponent(AceEditor, {
          ref_key: "scoreEditorRef",
          ref: scoreEditorRef,
          mode: "editor",
          value: defaultScore,
          onEvaluate: handleEvaluateBinary,
          onEvaluateTS: handleEvaluateTS,
          onKeydown: handleKeyDown
        }, null, _parent));
        _push(`<div class="mini-oscilloscopes" data-v-d9a2155b><!--[-->`);
        ssrRenderList(functionTables.value, (table, index2) => {
          _push(`<div class="mini-oscilloscope" data-v-d9a2155b><div class="mini-oscilloscope-label" data-v-d9a2155b>F${ssrInterpolate(table.functionNum)}</div><canvas width="80" height="50" class="mini-oscilloscope-canvas" data-v-d9a2155b></canvas></div>`);
        });
        _push(`<!--]--></div></div><div class="divider" data-v-d9a2155b></div><div class="console-editor" style="${ssrRenderStyle({ flex: consoleEditorFlex.value })}" data-v-d9a2155b><div class="console-header" data-v-d9a2155b><button class="clear-btn" title="Clear console" data-v-d9a2155b>🗑️</button></div>`);
        _push(ssrRenderComponent(AceEditor, {
          ref_key: "consoleEditorRef",
          ref: consoleEditorRef,
          mode: "terminal"
        }, null, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (plotImage.value) {
        _push(`<div class="plot-display" data-v-d9a2155b><img${ssrRenderAttr("src", `data:image/png;base64,${plotImage.value}`)} alt="Plot" class="plot-image" data-v-d9a2155b></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showLightbox.value) {
        _push(`<div class="lightbox" data-v-d9a2155b><button class="close-button" data-v-d9a2155b><svg class="icon" viewBox="0 0 24 24" data-v-d9a2155b><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" data-v-d9a2155b></path></svg></button><img${ssrRenderAttr("src", `data:image/png;base64,${plotImage.value}`)} alt="Plot" class="lightbox-image" data-v-d9a2155b></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showStorageMenu.value) {
        _push(`<div class="storage-menu" data-v-d9a2155b><div class="storage-menu-content" data-v-d9a2155b><div class="left-panel" data-v-d9a2155b><div class="entry-fields" data-v-d9a2155b><form data-v-d9a2155b><input${ssrRenderAttr("value", formFields.value.title)} placeholder="Title" required data-v-d9a2155b><input type="number"${ssrRenderAttr("value", formFields.value.year)} placeholder="Year" required data-v-d9a2155b><input${ssrRenderAttr("value", formFields.value.composer)} placeholder="Composer" required data-v-d9a2155b><textarea placeholder="Comments" rows="3" required data-v-d9a2155b>${ssrInterpolate(formFields.value.comments)}</textarea><button type="submit" data-v-d9a2155b>[ Add ]</button></form></div><div class="code-list" data-v-d9a2155b><!--[-->`);
        ssrRenderList(codes.value, (codeEntry, index2) => {
          _push(`<div class="${ssrRenderClass({ "selected": selectedCodeIndex.value === index2 })}" data-v-d9a2155b>${ssrInterpolate(codeEntry.composer)} - ${ssrInterpolate(codeEntry.year)} - ${ssrInterpolate(codeEntry.title || "Untitled")}</div>`);
        });
        _push(`<!--]--></div></div><div class="right-panel" data-v-d9a2155b>`);
        _push(ssrRenderComponent(AceEditor, {
          ref_key: "codeEditorRef",
          ref: codeEditorRef,
          mode: "editor",
          value: selectedCode.value ? selectedCode.value.code : "",
          onInput: updateCodeContent
        }, null, _parent));
        _push(`<div class="code-actions" data-v-d9a2155b><button data-v-d9a2155b>[ Play TS ]</button><button data-v-d9a2155b>[ To Editor ]</button><button data-v-d9a2155b>[ Update ]</button><button data-v-d9a2155b>[ Delete ]</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="footer" data-v-d9a2155b>`);
      if (loading.value) {
        _push(`<div class="loading" data-v-d9a2155b>Processing...</div>`);
      } else {
        _push(`<!---->`);
      }
      if (isMobileOrTablet.value) {
        _push(`<button class="mobile-evaluate-btn" title="Alt+Enter" data-v-d9a2155b>Evaluate TS</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (error.value) {
        _push(`<div class="error" data-v-d9a2155b>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(HelpModal, {
        modelValue: showHelp.value,
        "onUpdate:modelValue": ($event) => showHelp.value = $event
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d9a2155b"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
