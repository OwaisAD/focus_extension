const input = document.getElementById('siteInput');
const addBtn = document.getElementById('addBtn');
const listEl = document.getElementById('siteList');
const emptyState = document.getElementById('emptyState');
const countLabel = document.getElementById('countLabel');
const errorMsg = document.getElementById('errorMsg');

let sites = [];

function normalizeDomain(raw) {
  try {
    let str = raw.trim().toLowerCase();
    if (!str.startsWith('http')) str = 'https://' + str;
    const url = new URL(str);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('show');
  setTimeout(() => errorMsg.classList.remove('show'), 2500);
}

function renderList() {
  listEl.querySelectorAll('.site-item').forEach(el => el.remove());
  countLabel.textContent = `${sites.length} site${sites.length !== 1 ? 's' : ''}`;

  if (sites.length === 0) {
    emptyState.style.display = '';
    return;
  }

  emptyState.style.display = 'none';

  sites.forEach(site => {
    const item = document.createElement('div');
    item.className = 'site-item';
    item.dataset.site = site;

    const dot = document.createElement('div');
    dot.className = 'site-dot';

    const name = document.createElement('span');
    name.className = 'site-name';
    name.title = site;
    name.textContent = site;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.title = 'Remove';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => removeSite(site));

    item.appendChild(dot);
    item.appendChild(name);
    item.appendChild(removeBtn);
    listEl.appendChild(item);
  });
}

function loadSites() {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    sites = result.blockedSites || [];
    renderList();
  });
}

function addSite() {
  const val = input.value.trim();
  if (!val) return;

  const normalized = normalizeDomain(val);
  if (!normalized) {
    showError('Invalid URL.');
    return;
  }
  if (sites.includes(normalized)) {
    showError('Already on the list.');
    return;
  }

  sites = [...sites, normalized];
  chrome.storage.sync.set({ blockedSites: sites }, () => {
    input.value = '';
    renderList();
  });
}

function removeSite(site) {
  sites = sites.filter(s => s !== site);
  chrome.storage.sync.set({ blockedSites: sites }, () => {
    renderList();
  });
}

addBtn.addEventListener('click', addSite);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addSite();
});

loadSites();
