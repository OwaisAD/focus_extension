// Show blocked site name
const params = new URLSearchParams(location.search);
const site = params.get('site');
if (site) document.getElementById('siteLabel').textContent = site;

// Live clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// Settings btn — just opens the extension popup page directly
document.getElementById('settingsBtn').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = chrome.runtime.getURL('settings.html');
});
