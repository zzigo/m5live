import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { M as MusicVTest } from "./MusicVTest-BFFyWJuM.js";
import { _ as _export_sfc } from "../server.mjs";
import "hookable";
import "destr";
import "klona";
import "defu";
import "#internal/nuxt/paths";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-monokai.js";
import "ace-builds/src-noconflict/mode-text.js";
import "ofetch";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "radix3";
import "ufo";
const _sfc_main = {
  __name: "musicv-test",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "musicv-test-page" }, _attrs))} data-v-c93b7afd><h1 data-v-c93b7afd>MUSIC V Test Environment</h1>`);
      _push(ssrRenderComponent(MusicVTest, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/musicv-test.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const musicvTest = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c93b7afd"]]);
export {
  musicvTest as default
};
//# sourceMappingURL=musicv-test-BMOa0H_9.js.map
