import { $fetch } from "ofetch";
import { baseURL } from "#internal/nuxt/paths";
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
//# sourceMappingURL=virtual_nuxt__Users_zztt_projects_22-m5live_25-m5live-nuxt_.nuxt_fetch.mjs.map
