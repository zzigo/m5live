
import { updateAppConfig } from '#app/config'
import { defuFn } from 'defu'

const inlineConfig = {
  "name": "SOOG",
  "description": "Speculative Organology Organogram Generator",
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
    updateAppConfig(newModule.default)
  })
}



export default /*@__PURE__*/ defuFn(inlineConfig)
