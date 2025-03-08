import type { ComputedRef, MaybeRef } from 'vue'
declare module "../../node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    viewTransition?: boolean | 'always'
  }
}