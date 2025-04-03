// This is a simple browser-compatible bundle of all calculations modules

// Create a namespace for all calculations
window.FinanzplanerModules = {};

// Function to initialize all modules after they're loaded
function initializeModules() {
  // Initialize UI
  if (typeof initializeUI === 'function') {
    initializeUI();
  }
}

// Load the script files in sequence
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing Finanzplaner');
  
  // Call the initialization function
  initializeModules();
});