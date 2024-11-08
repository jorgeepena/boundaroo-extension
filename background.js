chrome.runtime.onInstalled.addListener(() => {
    console.log('Content Discovery Extension installed');
});

// Escucha el evento cuando se hace clic en el botón "Bound" en popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openBound') {
        chrome.tabs.create({ url: message.url });
    }
});
