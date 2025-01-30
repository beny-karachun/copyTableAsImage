// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Copy Table as Image extension installed.");
  });
  
  // Example: Listen for messages from content scripts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "log") {
      console.log("Message from content script:", message.data);
      sendResponse({ status: "success" });
    }
  });