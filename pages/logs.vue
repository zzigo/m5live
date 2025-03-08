<template>
  <div class="logs-container">
    <div v-if="loading" class="loading">Loading logs...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else v-html="logs" class="logs-content"></div>
  </div>
</template>

<script setup>
const loading = ref(true);
const error = ref(null);
const logs = ref("");

const config = useRuntimeConfig();

onMounted(async () => {
  try {
    const response = await fetch(
      `${config.public.apiBase.replace("/api", "")}/log`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    logs.value = await response.text();
  } catch (e) {
    error.value = `Failed to load logs: ${e.message}`;
    console.error("Error loading logs:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.logs-container {
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.error {
  color: red;
  padding: 20px;
  text-align: center;
}

.logs-content {
  /* Styles will come from the HTML returned by the backend */
}
</style>
