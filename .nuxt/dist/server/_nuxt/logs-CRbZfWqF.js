import { ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import "hookable";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "radix3";
import "defu";
import "ufo";
const _sfc_main = {
  __name: "logs",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref(null);
    const logs2 = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "logs-container" }, _attrs))} data-v-12810711>`);
      if (unref(loading)) {
        _push(`<div class="loading" data-v-12810711>Loading logs...</div>`);
      } else if (unref(error)) {
        _push(`<div class="error" data-v-12810711>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div class="logs-content" data-v-12810711>${unref(logs2) ?? ""}</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/logs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const logs = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-12810711"]]);
export {
  logs as default
};
//# sourceMappingURL=logs-CRbZfWqF.js.map
