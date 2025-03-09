<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Welcome to M5LIVE</h2>
          <button class="close-button" @click="$emit('update:modelValue', false)">×</button>
        </div>
        <div class="modal-body">
          <h3>A LiveCoding Revival of MUSIC V</h3>
          <p>
            M5LIVE is a modern reinterpretation of Max Mathews' pioneering MUSIC V system, enabling live coding of musical scores in the MUSIC V syntax. Built on Nuxt 3, it bridges vintage computer music with contemporary web technologies, offering a platform to explore sound synthesis and speculative instrument design.
          </p>

          <h4>Historical Context: Max Mathews and MUSIC I-VI</h4>
          <p>
            Max Mathews, often called the "father of computer music," invented the MUSIC series (I-VI) starting in 1957 at Bell Labs. MUSIC I was the first program to synthesize sound on a computer (an IBM 704), famously rendering "Daisy Bell" in 1961—later immortalized in *2001: A Space Odyssey*. By MUSIC V (1968), Mathews introduced a modular, score-based system that abstracted sound generation into "instruments" (unit generators) and "notes," laying the groundwork for modern digital audio workstations. Through a media archaeology lens, MUSIC V reveals deep patterns in computational design—modularity, abstraction, and human-machine collaboration—that resonate with philosophical questions about creativity and interface incentives. M5LIVE recovers these patterns, extending them into a web-based, interactive environment.
          </p>

          <h4>How It Works:</h4>
          <ol>
            <li>Write MUSIC V scores in the editor (e.g., <code>INS 0 1; OSC P5 P6 B2 F2 P30;</code>).</li>
            <li>Use shortcuts to evaluate code live or send it to the console.</li>
            <li>Explore stored scores via the storage menu, updating or playing them as TypeScript audio.</li>
            <li>Leverage media archaeology to rediscover design paradigms from Mathews' era, inspiring new interfaces.</li>
          </ol>

          <h4>Activated Commands:</h4>
          <ul>
            <li><strong>Evaluate/Stop TS</strong>: <kbd>Alt + Enter</kbd> - Runs the selected or full score as TypeScript audio. When playing, changes to a stop button. Syntax: <code>INS &lt;time&gt; &lt;duration&gt;; OSC &lt;params&gt;; OUT &lt;buffer&gt;; END;</code></li>
            <li><strong>Stop Playback</strong>: <kbd>Cmd + .</kbd> or <kbd>Ctrl + .</kbd> - Stops audio playback.</li>
            <li><strong>Evaluate Binary</strong>: <kbd>Ctrl + Enter</kbd> - Will execute the score using original Fortran MUSIC V binary compilation (future implementation).</li>
            <li><strong>Clear Editor</strong>: <kbd>Ctrl + H</kbd> - Wipes the editor content.</li>
            <li><strong>Clear Console</strong>: <kbd>Ctrl + P</kbd> - Clears the console output.</li>
            <li><strong>Storage Menu</strong>: <kbd>Ctrl + M</kbd> - Opens the storage menu for saved codes.</li>
            <li><strong>Navigate Codes</strong>: <kbd>Alt + Shift + ←/→</kbd> - Navigate between saved codes.</li>
            <li><strong>Show/Hide Code</strong>: Click the eye icon - Toggles visibility of generated code.</li>
            <li><strong>Mobile Evaluate</strong>: Tap "Evaluate" button - Triggers evaluation on mobile devices.</li>
          </ul>

          <h4>Future Implementations:</h4>
          <ul>
            <li><strong>Save Session</strong>: <kbd>Ctrl + S</kbd> - Save current session to local storage.</li>
            <li><strong>Load Preset</strong>: <kbd>Ctrl + L</kbd> - Load predefined MUSIC V presets.</li>
            <li><strong>Visualize Waveform</strong>: <kbd>Ctrl + W</kbd> - Display real-time waveform of generated audio.</li>
            <li><strong>Export WAV</strong>: <kbd>Ctrl + E</kbd> - Export audio as a WAV file.</li>
            <li><strong>Speculative Synth</strong>: Combine MUSIC V with organogram-style instrument design for hybrid sound generation.</li>
          </ul>

          <h4>Operation Codes (Future Implementation):</h4>
          <ul>
            <li><strong>INS</strong> - Define an instrument</li>
            <li><strong>OSC</strong> - Create an oscillator</li>
            <li><strong>OUT</strong> - Define output routing</li>
            <li><strong>END</strong> - End instrument definition</li>
            <li><strong>GEN</strong> - Generate function table</li>
            <li><strong>NOT</strong> - Define a note event</li>
            <li><strong>TER</strong> - Terminate score</li>
            <li><strong>ADD</strong> - Add signals</li>
            <li><strong>MUL</strong> - Multiply signals</li>
            <li><strong>ENV</strong> - Create envelope</li>
            <li><strong>FLT</strong> - Apply filter</li>
            <li><strong>DEL</strong> - Create delay</li>
            <li><strong>REV</strong> - Apply reverb</li>
            <li><strong>COM</strong> - Add comment</li>
          </ul>

          <h4>Shortcuts:</h4>
          <ul>
            <li><kbd>Alt + Enter</kbd>: Evaluate TypeScript audio / Start playback</li>
            <li><kbd>Cmd + .</kbd> or <kbd>Ctrl + .</kbd>: Stop playback</li>
            <li><kbd>Ctrl + Enter</kbd>: Evaluate binary audio</li>
            <li><kbd>Ctrl + H</kbd>: Clear editor</li>
            <li><kbd>Ctrl + P</kbd>: Clear console</li>
            <li><kbd>Ctrl + M</kbd>: Open storage menu</li>
            <li><kbd>Alt + Shift + ←/→</kbd>: Navigate between saved codes</li>
            <li><kbd>Ctrl + S</kbd>: Save session (future)</li>
            <li><kbd>Ctrl + L</kbd>: Load preset (future)</li>
            <li><kbd>Ctrl + W</kbd>: Show waveform (future)</li>
            <li><kbd>Ctrl + E</kbd>: Export WAV (future)</li>
          </ul>

          <p class="tip">
            <strong>Tip:</strong> Start with a simple score like <code>INS 0 1; OSC P5 P6 B2 F2 P30; OUT B2 B1; END;</code> to hear a basic oscillator output, then experiment with parameters.
          </p>

          <div class="reference">
            <h4>Media Archaeology & Design Insights</h4>
            <p>
              Mathews' MUSIC V series, explored through media archaeology, uncovers a philosophical shift: music as code, not just sound. Its unit-generator model prefigures modular synths and DAWs, offering interface-design incentives—intuitive control over abstract processes. M5LIVE extends this legacy, merging historical patterns with modern web interactivity to inspire new sonic explorations.
            </p>
          </div>

          <div class="credits">
            <h4>Academic Attribution</h4>
            <p>
              M5LIVE is a research project by Luciano Azzigotti, inspired by Max Mathews' MUSIC V and media archaeological principles, developed within a broader study of speculative sound design.
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
