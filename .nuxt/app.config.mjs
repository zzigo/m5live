
import { _replaceAppConfig } from '#app/config'
import { defuFn } from 'defu'

const inlineConfig = {
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

// Vite - webpack is handled directly in #app/config
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    _replaceAppConfig(newModule.default)
  })
}



export default /*@__PURE__*/ defuFn(inlineConfig)
