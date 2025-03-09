<template>
  <div class="musicv-test-page">
    <h1>MUSIC V Test Environment</h1>
    <MusicVTest />
  </div>
</template>

<script setup>
import MusicVTest from '~/components/MusicVTest.vue.toGarbage';
</script>

<style scoped>
.musicv-test-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
}

h1 {
  margin: 1rem;
  color: #ffb000;
}
</style> 