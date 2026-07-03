// background.js
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Automatically open the options page when the extension is first installed
    chrome.runtime.openOptionsPage();
  }
});