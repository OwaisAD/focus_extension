// content.js — runs at document_start on every page
(function () {
  // Don't run on the blocked page itself
  if (location.href.includes('blocked.html')) return;

  const currentHost = location.hostname.replace(/^www\./, '');

  chrome.storage.sync.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || [];
    const isBlocked = sites.some(site => {
      return currentHost === site || currentHost.endsWith('.' + site);
    });

    if (isBlocked) {
      const blockedUrl = chrome.runtime.getURL('blocked.html') +
        '?site=' + encodeURIComponent(currentHost);
      location.replace(blockedUrl);
    }
  });
})();
