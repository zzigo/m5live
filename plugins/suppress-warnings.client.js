// Suppress specific Vue warnings
export default defineNuxtPlugin(() => {
  // Store the original console.warn function
  const originalWarn = console.warn;
  
  // Override console.warn to filter out specific warnings
  console.warn = (...args) => {
    // Check if this is the Suspense warning
    if (args[0] && typeof args[0] === 'string' && args[0].includes('<Suspense> is an experimental feature')) {
      // Ignore this specific warning
      return;
    }
    
    // Pass other warnings through to the original function
    originalWarn.apply(console, args);
  };
}); 