<template>
  <div class="app-container">
    <div class="settings">
      <button @click="toggleShowCode" class="icon-button" :title="showCode ? 'Hide Code' : 'Show Code'">
        <svg v-if="showCode" class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
        </svg>
      </button>
      <a href="/musicv-test" class="nav-button" title="MusicV Test">
        MusicV Test
      </a>
      <button @click="handleMobileEvaluate" class="icon-button" title="Evaluate selected text or all if no selection">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
      </button>
      <button @click="handleClear" class="icon-button" title="Clear Editor (Ctrl+H)">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7,6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
        </svg>
      </button>
      <button @click="handleRandomPrompt" class="icon-button" title="Random Prompt">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
        </svg>
      </button>
      <button @click="showHelp = true" class="icon-button" title="Help">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
        </svg>
      </button>
    </div>
    <div class="editor-wrapper">
      <AceEditor 
        ref="editorRef" 
        @evaluate="handleEvaluate"
      />
    </div>
    <div class="footer">
      <div v-if="loading" class="loading">
        Processing...
      </div>
      <button 
        v-if="isMobileOrTablet" 
        @click="handleMobileEvaluate"
        class="mobile-evaluate-btn"
        title="Alt+Enter"
      >
        Evaluate
      </button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <HelpModal v-model="showHelp" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onErrorCaptured } from 'vue';
import AceEditor from '~/components/AceEditor.vue';
import HelpModal from '~/components/HelpModal.vue';
import { useRandomPrompt } from '~/composables/useRandomPrompt';

// State variables
const editorRef = ref(null);
const loading = ref(false);
const error = ref(null);
const isMobileOrTablet = ref(false);
const showCode = ref(true);
const showHelp = ref(false);
const renderError = ref(null);

// Capture any errors during rendering
onErrorCaptured((err, instance, info) => {
  console.error('Error captured in index.vue:', err);
  renderError.value = { err, info };
  return false; // prevent error from propagating further
});

const checkDevice = () => {
  isMobileOrTablet.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

onMounted(() => {
  console.log('Index page mounted');
  checkDevice();
  window.addEventListener('resize', checkDevice);
  
  // Ensure the editor is initialized after a small delay
  setTimeout(() => {
    if (editorRef.value && editorRef.value.aceEditor) {
      console.log('Editor initialized successfully');
    } else {
      console.error('Editor failed to initialize');
    }
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice);
});

const handleClear = () => {
  if (editorRef.value) {
    editorRef.value.clearEditor();
  }
};

const toggleShowCode = () => {
  showCode.value = !showCode.value;
};

const handleRandomPrompt = async () => {
  if (editorRef.value) {
    const { getRandomPrompt } = useRandomPrompt();
    const prompt = await getRandomPrompt();
    editorRef.value.clearEditor();
    editorRef.value.addToEditor(prompt);
    editorRef.value.addToHistory(prompt);
  }
};

const handleMobileEvaluate = () => {
  if (editorRef.value) {
    const editor = editorRef.value.aceEditor();
    if (editor) {
      const selectedText = editor.getSelectedText();
      const textToEvaluate = selectedText || editor.getValue();
      if (textToEvaluate.trim()) {
        handleEvaluate(textToEvaluate);
      } else {
        error.value = 'Please enter some text to evaluate.';
      }
    }
  }
};

const handleEvaluate = async (selectedText) => {
  if (!selectedText.trim()) {
    error.value = 'Please select some text to evaluate.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: selectedText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process request');
    }

    // Create audio blob from response
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create and play audio
    const audio = new Audio(audioUrl);
    audio.play();

    // Clean up the URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.settings {
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 8px;
}

.icon-button {
  background: transparent;
  border: none;
  color: white;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon {
  width: 24px;
  height: 24px;
}

.editor-wrapper {
  flex: 1;
  padding: 20px;
  padding-top: 60px;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  background: black !important;
  z-index: 1000;
}

.loading {
  margin-right: auto;
}

.mobile-evaluate-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: background-color 0.3s;
}

.mobile-evaluate-btn:hover {
  background: #45a049;
}

.mobile-evaluate-btn:active {
  background: #3d8b40;
  transform: translateY(1px);
}

.error {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff5252;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 1000;
}

.nav-button {
  background: #4CAF50;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background: #45a049;
}
</style>
