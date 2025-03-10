<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Welcome to M5LIVE</h2>
          <button class="close-button" @click="$emit('update:modelValue', false)">×</button>
        </div>
        <div class="modal-body">
          <h3>A LiveCoding Implementation of MUSIC V</h3>
          <p>
            M5LIVE is a modern implementation of the MUSIC V system, enabling live coding of musical scores in the MUSIC V syntax. Built on Nuxt 3, it provides a web-based platform for sound synthesis and instrument design through code.
          </p>

          <h4>Technical Overview</h4>
          <p>
            MUSIC V represents a significant milestone in computer music synthesis, introducing a modular, score-based system that abstracts sound generation into unit generators and note events. This implementation translates the original MUSIC V architecture into a modern web context, preserving its core computational principles while enabling real-time interaction.
          </p>

          <h4>How It Works:</h4>
          <ol>
            <li>Write MUSIC V scores in the editor using the available operation codes.</li>
            <li>Use shortcuts to evaluate code and generate audio in real-time.</li>
            <li>Access stored scores via the storage menu for reuse and modification.</li>
            <li>Export generated audio as WAV files for external use.</li>
          </ol>

          <h4>Activated Commands:</h4>
          <ul>
            <li><strong>Evaluate/Stop TS</strong>: <kbd>Alt + Enter</kbd> - Runs the selected or full score as TypeScript audio. When playing, changes to a stop button. Syntax: <code>INS &lt;time&gt; &lt;duration&gt;; OSC &lt;params&gt;; OUT &lt;buffer&gt;; END;</code></li>
            <li><strong>Stop Playback</strong>: <kbd>Cmd + .</kbd> or <kbd>Ctrl + .</kbd> - Stops audio playback.</li>
            <li><strong>Export WAV</strong>: <kbd>Ctrl + E</kbd> - Export audio as a WAV file.</li>
            <li><strong>Clear Editor</strong>: <kbd>Ctrl + H</kbd> - Wipes the editor content.</li>
            <li><strong>Clear Console</strong>: <kbd>Ctrl + P</kbd> - Clears the console output.</li>
            <li><strong>Storage Menu</strong>: <kbd>Ctrl + M</kbd> - Opens the storage menu for saved codes.</li>
            <li><strong>Navigate Codes</strong>: <kbd>Alt + Shift + ←/→</kbd> - Navigate between saved codes.</li>
            <li><strong>Show/Hide Code</strong>: Click the eye icon - Toggles visibility of generated code.</li>
            <li><strong>Mobile Evaluate</strong>: Tap "Evaluate" button - Triggers evaluation on mobile devices.</li>
          </ul>

          <h4>Operation Codes (Currently Active):</h4>
          <ul>
            <li><strong>INS</strong> - Define instrument (Syntax: INS time duration)</li>
            <li><strong>OSC</strong> - Create oscillator (Syntax: OSC amplitude frequency buffer function phase)</li>
            <li><strong>OUT</strong> - Define output routing (Syntax: OUT input output)</li>
            <li><strong>END</strong> - End instrument definition</li>
            <li><strong>GEN</strong> - Generate function table (Syntax: GEN function_number size values...)</li>
            <li><strong>TER</strong> - Terminate score</li>
            <li><strong>AD2</strong> - Two-stage envelope generator</li>
            <li><strong>PLF</strong> - Piecewise linear function generator</li>
          </ul>

          <h4>Future Implementations:</h4>
          <ul>
            <li><strong>Save Session</strong>: <kbd>Ctrl + S</kbd> - Save current session to local storage.</li>
            <li><strong>Load Preset</strong>: <kbd>Ctrl + L</kbd> - Load predefined MUSIC V presets.</li>
            <li><strong>Visualize Waveform</strong>: <kbd>Ctrl + W</kbd> - Display real-time waveform of generated audio.</li>
            <li><strong>Additional Unit Generators</strong>: Implementation of more MUSIC V operators including ADD (signal addition), MUL (signal multiplication), and ENV (envelope generation).</li>
          </ul>

          <p class="tip">
            <strong>Tip:</strong> Start with a simple score like <code>INS 0 1; OSC P5 P6 B2 F2 P30; OUT B2 B1; END;</code> to hear a basic oscillator output, then experiment with parameters.
          </p>

          <div class="reference">
            <h4>Technical Implementation</h4>
            <p>
              M5LIVE implements the core MUSIC V architecture in a modern web context, translating the original unit generator model into a real-time, browser-based synthesis engine. The implementation preserves the modular approach to sound synthesis while adding contemporary features like live coding and immediate audio feedback.
            </p>
          </div>

          <div class="credits">
            <h4>Academic Attribution</h4>
            <p>
              M5LIVE is a research project exploring the implementation of historical computer music systems in modern web environments, developed as part of ongoing research in computer music and digital instrument design.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
  font-family: 'IBM Plex Mono', monospace;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0.5rem;
}

.close-button:hover {
  color: #ccc;
}

h2, h3, h4 {
  margin-top: 0;
  color: #fff;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

h4 {
  margin-top: 1.5rem;
  color: #4CAF50;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul, ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.5rem;
}

kbd {
  background: #333;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.9em;
}

.tip {
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
  padding: 1rem;
  margin-top: 1.5rem;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.reference {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.citation {
  font-style: normal;
  padding-left: 2rem;
  text-indent: -2rem;
  color: #ccc;
}

.citation em {
  font-style: italic;
}

.credits {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.supervisors {
  margin-top: 1rem;
}

.supervisors ul {
  list-style: none;
  padding-left: 1rem;
}

.supervisors li {
  color: #ccc;
}

.institution {
  margin-top: 1.5rem;
  text-align: center;
}

.hkb-logo {
  height: 60px;
  margin: 1rem 0;
  filter: brightness(0) invert(1);
}
</style>
