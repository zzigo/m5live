import { mergeProps, useSSRContext, ref } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc, c as useRuntimeConfig } from "../server.mjs";
import "destr";
import "klona";
import "defu";
import { publicAssetsURL } from "#internal/nuxt/paths";
import { A as AceEditor, M as MusicVTest } from "./MusicVTest-BFFyWJuM.js";
import "hookable";
import "ofetch";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "radix3";
import "ufo";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-monokai.js";
import "ace-builds/src-noconflict/mode-text.js";
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
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
    const radius = baseRadius + (1 - opacity) * 1.5;
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
    if (blinkInterval) clearInterval(blinkInterval);
    if (fadeTimeout) clearTimeout(fadeTimeout);
    blinkInterval = setInterval();
  };
  const completeProcessing = () => {
    if (!favicon.value) return;
    if (blinkInterval) {
      clearInterval(blinkInterval);
      blinkInterval = null;
    }
    favicon.value.href = createFavicon("#00ff00");
    if (fadeTimeout) clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      setInterval();
    }, 500);
  };
  return {
    startProcessing,
    completeProcessing
  };
}
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useFavicon();
    const editorRef = ref(null);
    const loading = ref(false);
    const progress = ref(0);
    const error = ref(null);
    const plotImage = ref(null);
    const showCode = ref(true);
    const showHelp = ref(false);
    ref(0);
    const isMobileOrTablet = ref(false);
    const showLightbox = ref(false);
    const config = useRuntimeConfig();
    ref(config.public.apiBase || "https://soog.onrender.com/api");
    const handleEvaluate = async (selectedText) => {
      if (!selectedText.trim()) {
        error.value = "Please select some text to evaluate.";
        return;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-container" }, _attrs))} data-v-3ce6c867><div class="settings" data-v-3ce6c867><button class="icon-button"${ssrRenderAttr("title", showCode.value ? "Hide Code" : "Show Code")} data-v-3ce6c867>`);
      if (showCode.value) {
        _push(`<svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" data-v-3ce6c867></path></svg>`);
      } else {
        _push(`<svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" data-v-3ce6c867></path></svg>`);
      }
      _push(`</button><button class="icon-button" title="Evaluate selected text or all if no selection" data-v-3ce6c867><svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" data-v-3ce6c867></path></svg></button><button class="icon-button" title="Clear Editor (Ctrl+H)" data-v-3ce6c867><svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" data-v-3ce6c867></path></svg></button><button class="icon-button" title="Random Prompt" data-v-3ce6c867><svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" data-v-3ce6c867></path></svg></button><button class="icon-button" title="Help" data-v-3ce6c867><svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" data-v-3ce6c867></path></svg></button><button class="icon-button" title="Go to test" data-v-3ce6c867><svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M3 17.25V21H6.75V17.25H3M3 3V13.5H6.75V3H3M8.25 17.25V21H12V17.25H8.25M8.25 3V13.5H12V3H8.25M13.5 17.25V21H17.25V17.25H13.5M13.5 3V13.5H17.25V3H13.5M18.75 17.25V21H22.5V17.25H18.75M18.75 3V13.5H22.5V3H18.75Z" data-v-3ce6c867></path></svg></button></div>`);
      if (!_ctx.showTestEditor) {
        _push(`<div class="editor-wrapper" data-v-3ce6c867>`);
        _push(ssrRenderComponent(AceEditor, {
          ref_key: "editorRef",
          ref: editorRef,
          onEvaluate: handleEvaluate
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.showTestEditor) {
        _push(`<div class="editor-wrapper" data-v-3ce6c867>`);
        _push(ssrRenderComponent(MusicVTest, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (plotImage.value) {
        _push(`<div class="plot-display" data-v-3ce6c867><img${ssrRenderAttr("src", `data:image/png;base64,${plotImage.value}`)} alt="Plot" class="plot-image" data-v-3ce6c867></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showLightbox.value) {
        _push(`<div class="lightbox" data-v-3ce6c867><button class="close-button" data-v-3ce6c867><svg class="icon" viewBox="0 0 24 24" data-v-3ce6c867><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" data-v-3ce6c867></path></svg></button><img${ssrRenderAttr("src", `data:image/png;base64,${plotImage.value}`)} alt="Plot" class="lightbox-image" data-v-3ce6c867></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="footer" data-v-3ce6c867>`);
      if (loading.value) {
        _push(`<div class="loading" data-v-3ce6c867> Processing... ${ssrInterpolate(Math.round(progress.value))}% </div>`);
      } else {
        _push(`<!---->`);
      }
      if (isMobileOrTablet.value) {
        _push(`<button class="mobile-evaluate-btn" title="Alt+Enter" data-v-3ce6c867> Evaluate </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (error.value) {
        _push(`<div class="error" data-v-3ce6c867>${ssrInterpolate(error.value)}</div>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ce6c867"]]);
export {
  index as default
};
//# sourceMappingURL=index-Iq31sClo.js.map
