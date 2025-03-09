import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import _imports_0 from "../_virtual/virtual_public.mjs";
/* empty css                */
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
const _sfc_main = {
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HelpModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HelpModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a3a48482"]]);
export {
  HelpModal as default
};
//# sourceMappingURL=HelpModal.vue.mjs.map
