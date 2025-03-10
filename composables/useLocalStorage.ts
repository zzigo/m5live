import { ref, watch } from 'vue';

export interface CodeEntry {
  code: string;
  year: number;
  composer: string;
  comments: string;
  title: string;
}

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
      const response = await fetch('/data/codes.json');
      if (response.ok) {
        const data = await response.json();
        codes.value = data;
        saveCodes(); // Save to localStorage
      }
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
        } else {
          throw new Error('Imported data is not an array');
        }
      } catch (error) {
        console.error('Error importing codes:', error);
        alert('Invalid JSON file. Please select a valid M5LIVE codes file.');
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