import { ref, reactive, watch, mergeProps, nextTick, useSSRContext } from 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue/server-renderer/index.mjs';
import { M as MusicV, u as useFavicon, A as AceEditor, H as HelpModal } from './musicV.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/hookable/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/unctx/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/h3/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/radix3/dist/index.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/defu/dist/defu.mjs';
import 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/ufo/dist/index.mjs';

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
const _sfc_main = {
  __name: "indextorefact",
  __ssrInlineRender: true,
  setup(__props) {
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
      var _a, _b;
      const text = (_b = (_a = scoreEditorRef.value) == null ? void 0 : _a.aceEditor()) == null ? void 0 : _b.getValue();
      if (!(text == null ? void 0 : text.trim())) {
        error.value = "Please enter some text to evaluate.";
        return;
      }
      loading.value = true;
      startProcessing();
      const stopProgress = startProgress();
      setTimeout(() => {
        var _a2;
        (_a2 = consoleEditorRef.value) == null ? void 0 : _a2.addTerminalOutput("Binary evaluation not implemented yet.");
        stopProgress();
        loading.value = false;
        completeProcessing();
      }, 1e3);
    };
    const handleEvaluateTS = async (text = null) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      let evalText = text ?? ((_b = (_a = scoreEditorRef.value) == null ? void 0 : _a.aceEditor()) == null ? void 0 : _b.getValue());
      if (!evalText || typeof evalText !== "string" || !evalText.trim()) {
        evalText = defaultScore;
      }
      loading.value = true;
      startProcessing();
      const stopProgress = startProgress();
      try {
        (_c = consoleEditorRef.value) == null ? void 0 : _c.addTerminalOutput("");
        functionTables.value = [];
        Object.keys(canvasRefs).forEach((key) => delete canvasRefs[key]);
        await nextTick();
        const lines = evalText.split("\n");
        let genTable = [];
        let modifiedLines = [];
        let hasConvt = false;
        for (const line of lines) {
          if (line.trim().startsWith("COMMENT: CONVT") || line.trim().startsWith("CONVT")) {
            hasConvt = true;
            (_d = consoleEditorRef.value) == null ? void 0 : _d.addTerminalOutput("Detected CONVT directive - applying frequency conversion", "info");
            continue;
          }
          if (line.trim().startsWith("GEN")) {
            genTable = line.split(/\s+/).map((val) => parseFloat(val) || val);
          } else if (line.trim().startsWith("NOT")) {
            const params = line.split(/\s+/).map((val) => parseFloat(val) || val);
            const time = params[1];
            const insNum = params[2];
            let freq = params[5];
            if (hasConvt && time === 1 && insNum >= 1 && insNum <= 6) {
              const g4 = genTable[4] || 512;
              const f = 511 / g4;
              const originalFreq = freq;
              freq *= f;
              (_e = consoleEditorRef.value) == null ? void 0 : _e.addTerminalOutput(`CONVT: Scaled freq ${originalFreq} to ${freq.toFixed(2)} for ins ${insNum} at time ${time}`, "info");
            }
            modifiedLines.push(`NOT ${time} ${insNum} ${params[3]} ${params[4]} ${freq}${params[6] ? ` ${params[6]}` : ""}${params[7] ? ` ${params[7]}` : ""}${params[8] ? ` ${params[8]}` : ""}`);
          } else {
            modifiedLines.push(line);
          }
        }
        const modifiedScore = modifiedLines.join("\n");
        evalText = modifiedScore;
        musicV.parseScore(evalText);
        (_f = consoleEditorRef.value) == null ? void 0 : _f.addTerminalOutput(musicV.getConsoleOutput());
        await musicV.initAudio();
        await musicV.play();
        const audioBuffer = await musicV.generateSound(10);
        const wavBlob = createWavBlob(audioBuffer, 44100);
        if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
        audioUrl.value = URL.createObjectURL(wavBlob);
        (_g = consoleEditorRef.value) == null ? void 0 : _g.addTerminalOutput(`Audio generated: ${audioUrl.value}`);
        functionTables.value = musicV.getFunctionTables();
        const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
        const filename = `musicv-output-${timestamp}.wav`;
        (_h = consoleEditorRef.value) == null ? void 0 : _h.addTerminalOutput(`<a href="${audioUrl.value}" download="${filename}" style="color:#ffb000;">Download ${filename}</a>`, "html");
      } catch (err) {
        (_i = consoleEditorRef.value) == null ? void 0 : _i.addTerminalOutput(`Error: ${err.message}`);
      } finally {
        stopProgress();
        loading.value = false;
        completeProcessing();
      }
    };
    watch(functionTables, (newTables) => {
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
      let index = 44;
      for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i] * masterGain));
        const int16Sample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(index, int16Sample, true);
        index += 2;
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
      const canvas = canvasRefs[table.functionNum];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
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
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-container" }, _attrs))} data-v-fab1b029><div class="settings" data-v-fab1b029><button class="icon-button"${ssrRenderAttr("title", showCode.value ? "Hide Code" : "Show Code")} data-v-fab1b029>`);
      if (showCode.value) {
        _push(`<svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" data-v-fab1b029></path></svg>`);
      } else {
        _push(`<svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" data-v-fab1b029></path></svg>`);
      }
      if (currentTitle.value) {
        _push(`<span class="current-title" data-v-fab1b029>${ssrInterpolate(currentTitle.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button class="icon-button" title="Evaluate Binary (Ctrl+Enter)" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" data-v-fab1b029></path></svg></button><button class="icon-button" title="Evaluate TS (Alt+Enter)" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" data-v-fab1b029></path></svg><span class="ts-subscript" data-v-fab1b029>TS</span></button><button class="icon-button" title="Clear Editor (Ctrl+H)" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,21V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" data-v-fab1b029></path></svg></button><button class="icon-button" title="Random Prompt" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" data-v-fab1b029></path></svg></button><button class="icon-button" title="Help" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" data-v-fab1b029></path></svg></button><button class="icon-button" title="Storage Menu (Ctrl+M)" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" data-v-fab1b029></path></svg></button></div>`);
      if (showCode.value) {
        _push(`<div class="content-wrapper" data-v-fab1b029><div class="editor-container" data-v-fab1b029><div class="score-editor" style="${ssrRenderStyle({ flex: scoreEditorFlex.value })}" data-v-fab1b029>`);
        _push(ssrRenderComponent(AceEditor, {
          ref_key: "scoreEditorRef",
          ref: scoreEditorRef,
          mode: "editor",
          value: defaultScore,
          onEvaluate: handleEvaluateBinary,
          onEvaluateTS: handleEvaluateTS,
          onKeydown: handleKeyDown
        }, null, _parent));
        _push(`<div class="mini-oscilloscopes" data-v-fab1b029><!--[-->`);
        ssrRenderList(functionTables.value, (table, index) => {
          _push(`<div class="mini-oscilloscope" data-v-fab1b029><div class="mini-oscilloscope-label" data-v-fab1b029>F${ssrInterpolate(table.functionNum)}</div><canvas width="80" height="50" class="mini-oscilloscope-canvas" data-v-fab1b029></canvas></div>`);
        });
        _push(`<!--]--></div></div><div class="divider" data-v-fab1b029></div><div class="console-editor" style="${ssrRenderStyle({ flex: consoleEditorFlex.value })}" data-v-fab1b029><div class="console-header" data-v-fab1b029><button class="clear-btn" title="Clear console" data-v-fab1b029>🗑️</button></div>`);
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
        _push(`<div class="plot-display" data-v-fab1b029><img${ssrRenderAttr("src", `data:image/png;base64,${plotImage.value}`)} alt="Plot" class="plot-image" data-v-fab1b029></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showLightbox.value) {
        _push(`<div class="lightbox" data-v-fab1b029><button class="close-button" data-v-fab1b029><svg class="icon" viewBox="0 0 24 24" data-v-fab1b029><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" data-v-fab1b029></path></svg></button><img${ssrRenderAttr("src", `data:image/png;base64,${plotImage.value}`)} alt="Plot" class="lightbox-image" data-v-fab1b029></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showStorageMenu.value) {
        _push(`<div class="storage-menu" data-v-fab1b029><div class="storage-menu-content" data-v-fab1b029><div class="left-panel" data-v-fab1b029><div class="entry-fields" data-v-fab1b029><form data-v-fab1b029><input${ssrRenderAttr("value", formFields.value.title)} placeholder="Title" required data-v-fab1b029><input type="number"${ssrRenderAttr("value", formFields.value.year)} placeholder="Year" required data-v-fab1b029><input${ssrRenderAttr("value", formFields.value.composer)} placeholder="Composer" required data-v-fab1b029><textarea placeholder="Comments" rows="3" required data-v-fab1b029>${ssrInterpolate(formFields.value.comments)}</textarea><button type="submit" data-v-fab1b029>[ Add ]</button></form></div><div class="code-list" data-v-fab1b029><!--[-->`);
        ssrRenderList(codes.value, (codeEntry, index) => {
          _push(`<div class="${ssrRenderClass({ "selected": selectedCodeIndex.value === index })}" data-v-fab1b029>${ssrInterpolate(codeEntry.composer)} - ${ssrInterpolate(codeEntry.year)} - ${ssrInterpolate(codeEntry.title || "Untitled")}</div>`);
        });
        _push(`<!--]--></div></div><div class="right-panel" data-v-fab1b029>`);
        _push(ssrRenderComponent(AceEditor, {
          ref_key: "codeEditorRef",
          ref: codeEditorRef,
          mode: "editor",
          value: selectedCode.value ? selectedCode.value.code : "",
          onInput: updateCodeContent
        }, null, _parent));
        _push(`<div class="code-actions" data-v-fab1b029><button data-v-fab1b029>[ Play TS ]</button><button data-v-fab1b029>[ To Editor ]</button><button data-v-fab1b029>[ Update ]</button><button data-v-fab1b029>[ Delete ]</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="footer" data-v-fab1b029>`);
      if (loading.value) {
        _push(`<div class="loading" data-v-fab1b029>Processing... ${ssrInterpolate(Math.round(progress.value))}%</div>`);
      } else {
        _push(`<!---->`);
      }
      if (isMobileOrTablet.value) {
        _push(`<button class="mobile-evaluate-btn" title="Alt+Enter" data-v-fab1b029>Evaluate TS</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (error.value) {
        _push(`<div class="error" data-v-fab1b029>${ssrInterpolate(error.value)}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/indextorefact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const indextorefact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fab1b029"]]);

export { indextorefact as default };
//# sourceMappingURL=indextorefact.vue.mjs.map
