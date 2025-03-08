<template>
  <div class="container">
    <h1>About M5Live</h1>
    
    <section class="about-section">
      <h2>What is M5Live?</h2>
      <p>
        M5Live is a modern web-based implementation of the classic MUSIC V language, 
        designed for live coding and audio synthesis directly in your browser. 
        It combines the power of the original MUSIC V language with modern web technologies 
        to create an accessible and powerful environment for music creation.
      </p>
    </section>
    
    <section class="about-section">
      <h2>History of MUSIC V</h2>
      <p>
        MUSIC V was developed by Max Mathews at Bell Labs in the 1960s and was one of the 
        first computer programs for digital sound synthesis. It introduced many concepts 
        that are still fundamental to computer music today, including the unit generator 
        concept and score-based composition.
      </p>
      <p>
        The original MUSIC V was written in FORTRAN and ran on mainframe computers. 
        M5Live brings this historic language to the modern web, making it accessible 
        to anyone with a browser.
      </p>
    </section>
    
    <section class="about-section">
      <h2>Features</h2>
      <ul class="feature-list">
        <li>
          <strong>Live Coding</strong> - Write and execute code in real-time with immediate audio feedback
        </li>
        <li>
          <strong>Modern Syntax</strong> - JavaScript-based syntax that preserves the power of MUSIC V
        </li>
        <li>
          <strong>Web Audio Integration</strong> - Uses the Web Audio API for high-quality, low-latency sound
        </li>
        <li>
          <strong>Integrated Editor</strong> - Powerful code editor with syntax highlighting and autocompletion
        </li>
        <li>
          <strong>Open Source</strong> - Free and open source, built with modern web technologies
        </li>
      </ul>
    </section>
    
    <section class="about-section">
      <h2>Getting Started</h2>
      <p>
        To get started with M5Live, head to the <NuxtLink to="/editor" class="text-link">Editor</NuxtLink> 
        and try out some of the example code. The editor includes basic examples to help you 
        understand the syntax and capabilities of the system.
      </p>
      <p>
        For more detailed documentation and tutorials, check out the 
        <a href="https://github.com/yourusername/m5live" target="_blank" class="text-link">GitHub repository</a>.
      </p>
    </section>
  </div>
</template>

<script setup>
// No special logic needed for the about page
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.about-section {
  margin-bottom: 3rem;
}

h2 {
  color: #ffb000;
  margin-bottom: 1rem;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-list {
  list-style-type: none;
  padding: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #333;
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list strong {
  color: #ffb000;
  margin-right: 0.5rem;
}

.text-link {
  color: #ffb000;
  text-decoration: none;
  border-bottom: 1px dotted #ffb000;
  transition: all 0.2s;
}

.text-link:hover {
  color: #ffc033;
  border-bottom: 1px solid #ffc033;
}
</style> 