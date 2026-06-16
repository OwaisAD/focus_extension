// background.js
// Listens for storage changes and manages the blocked sites list.

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.sync.set({ blockedSites: [] });
    }
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_BLOCKED_SITES') {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      sendResponse({ sites: result.blockedSites || [] });
    });
    return true; // async
  }

  if (message.type === 'ADD_SITE') {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const sites = result.blockedSites || [];
      const normalized = normalizeDomain(message.site);
      if (normalized && !sites.includes(normalized)) {
        sites.push(normalized);
        chrome.storage.sync.set({ blockedSites: sites }, () => {
          sendResponse({ success: true, sites });
        });
      } else {
        sendResponse({ success: false, reason: 'Already exists or invalid', sites });
      }
    });
    return true;
  }

  if (message.type === 'REMOVE_SITE') {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const sites = (result.blockedSites || []).filter(s => s !== message.site);
      chrome.storage.sync.set({ blockedSites: sites }, () => {
        sendResponse({ success: true, sites });
      });
    });
    return true;
  }
});

function normalizeDomain(input) {
  try {
    let str = input.trim().toLowerCase();
    if (!str.startsWith('http')) str = 'https://' + str;
    const url = new URL(str);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
