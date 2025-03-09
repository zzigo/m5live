import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass } from "vue/server-renderer";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/mode-python.js";
import "ace-builds/src-noconflict/mode-text.js";
import "ace-builds/src-noconflict/theme-monokai.js";
/* empty css                */
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
const _sfc_main = {
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AceEditor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AceEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-103e6f72"]]);
export {
  AceEditor as default
};
//# sourceMappingURL=AceEditor.vue.mjs.map
