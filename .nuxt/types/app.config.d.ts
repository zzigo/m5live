
import type { CustomAppConfig } from 'nuxt/schema'
import type { Defu } from 'defu'


declare const inlineConfig = {
  "name": "M5LIVE",
  "description": "LiveCoding version of Pioneer MusicV",
  "theme": {
    "dark": true,
    "colors": {
      "primary": "#4CAF50",
      "background": "#1a1a1a"
    }
  },
  "nuxt": {}
}
type ResolvedAppConfig = Defu<typeof inlineConfig, []>
type IsAny<T> = 0 extends 1 & T ? true : false

type MergedAppConfig<Resolved extends Record<string, unknown>, Custom extends Record<string, unknown>> = {
  [K in keyof (Resolved & Custom)]: K extends keyof Custom
    ? unknown extends Custom[K]
      ? Resolved[K]
      : IsAny<Custom[K]> extends true
        ? Resolved[K]
        : Custom[K] extends Record<string, any>
            ? Resolved[K] extends Record<string, any>
              ? MergedAppConfig<Resolved[K], Custom[K]>
              : Exclude<Custom[K], undefined>
            : Exclude<Custom[K], undefined>
    : Resolved[K]
}

declare module 'nuxt/schema' {
  interface AppConfig extends MergedAppConfig<ResolvedAppConfig, CustomAppConfig> { }
}
declare module '@nuxt/schema' {
  interface AppConfig extends MergedAppConfig<ResolvedAppConfig, CustomAppConfig> { }
}
