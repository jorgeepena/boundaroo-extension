chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ token: null });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SET_TOKEN") {
        chrome.storage.sync.set({ token: request.token });
        sendResponse({ status: "Token saved" });
    }
});
