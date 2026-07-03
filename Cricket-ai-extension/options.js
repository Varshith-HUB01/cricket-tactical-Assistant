// options.js
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);

function saveOptions() {
  const apiKey = document.getElementById('apiKey').value;
  
  chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
    const status = document.getElementById('status');
    status.textContent = 'API Key saved successfully.';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
}

function restoreOptions() {
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      document.getElementById('apiKey').value = result.geminiApiKey;
    }
  });
}
