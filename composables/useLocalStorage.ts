import { ref, watch } from 'vue';

export interface CodeEntry {
  code: string;
  year: number;
  composer: string;
  comments: string;
  title: string;
}

// Add a simple event bus for notifications
const emitEvent = (name: string, data?: any) => {
  window.dispatchEvent(new CustomEvent(name, { detail: data }));
};

export function useLocalStorage() {
  const codes = ref<CodeEntry[]>([]);
  const isLoaded = ref(false);

  // Load codes from localStorage
  const loadCodes = () => {
    try {
      const storedCodes = localStorage.getItem('m5live_codes');
      if (storedCodes) {
        codes.value = JSON.parse(storedCodes);
      } else {
        // If no codes in localStorage, try to load from the static JSON file
        loadDefaultCodes();
      }
      isLoaded.value = true;
    } catch (error) {
      console.error('Error loading codes from localStorage:', error);
      codes.value = [];
      isLoaded.value = true;
    }
  };

  // Load default codes from the static JSON file
  const loadDefaultCodes = async () => {
    try {
      // Try to load the full collection first
      const response = await fetch('/data/codes.json');
      if (response.ok) {
        const data = await response.json();
        codes.value = data;
        saveCodes(); // Save to localStorage
        return;
      }
      
      // If that fails, try the simpler version
      const fallbackResponse = await fetch('/data/code.json');
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        codes.value = fallbackData;
        saveCodes(); // Save to localStorage
        return;
      }
      
      // If both fail, create some basic examples
      codes.value = [
        {
          title: "Simple Example",
          code: "INS 0 1;\nOSC P5 P6 B2 F2 P30;\nOUT B2 B1;\nEND;\nGEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;\nNOT 0 1 .50 125 8.45;\nNOT .75 1 .17 250 8.45;\nNOT 4.00 2 .50 500 8.46;\nTER 8.00 ;",
          year: 2025,
          composer: "M5LIVE",
          comments: "A basic example to get started"
        }
      ];
      saveCodes();
    } catch (error) {
      console.error('Error loading default codes:', error);
    }
  };

  // Save codes to localStorage
  const saveCodes = () => {
    try {
      localStorage.setItem('m5live_codes', JSON.stringify(codes.value));
    } catch (error) {
      console.error('Error saving codes to localStorage:', error);
    }
  };

  // Watch for changes and save to localStorage
  watch(codes, () => {
    if (isLoaded.value) {
      saveCodes();
    }
  }, { deep: true });

  // Export codes to a JSON file
  const exportCodes = () => {
    const dataStr = JSON.stringify(codes.value, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `m5live_codes_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import codes from a JSON file
  const importCodes = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const importedCodes = JSON.parse(result);
        
        if (Array.isArray(importedCodes)) {
          codes.value = importedCodes;
          saveCodes();
          // Emit success event
          emitEvent('m5live:import-success', { count: importedCodes.length });
        } else {
          throw new Error('Imported data is not an array');
        }
      } catch (error) {
        console.error('Error importing codes:', error);
        alert('Invalid JSON file. Please select a valid M5LIVE codes file.');
        // Emit error event
        emitEvent('m5live:import-error', { error: 'Invalid JSON file' });
      }
    };
    
    reader.readAsText(file);
  };

  // Create a file input element for importing
  const createImportInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.style.display = 'none';
    input.addEventListener('change', importCodes);
    document.body.appendChild(input);
    input.click();
    
    // Clean up after selection
    input.addEventListener('change', () => {
      document.body.removeChild(input);
    });
  };

  return {
    codes,
    loadCodes,
    saveCodes,
    exportCodes,
    importCodes: createImportInput,
    isLoaded
  };
} 