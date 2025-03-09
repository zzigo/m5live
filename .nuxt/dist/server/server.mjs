import { createApp } from "vue";
import "./_virtual/virtual_nuxt__Users_zztt_projects_22-m5live_25-m5live-nuxt_.nuxt_fetch.mjs";
import { createNuxtApp, applyPlugins } from "./node_modules/nuxt/dist/app/nuxt.mjs";
import { createError } from "./node_modules/nuxt/dist/app/composables/error.mjs";
import plugins from "./_virtual/virtual_nuxt__Users_zztt_projects_22-m5live_25-m5live-nuxt_.nuxt_plugins.server.mjs";
import _sfc_main from "./node_modules/nuxt/dist/app/components/nuxt-root.vue.mjs";
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);
export {
  entry$1 as default
};
//# sourceMappingURL=server.mjs.map
