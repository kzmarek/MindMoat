// Views
const normalView = document.getElementById('normalView');
const focusView = document.getElementById('focusView');
const settingsView = document.getElementById('settingsView');

// Elements
const dailyTimeDisplay = document.getElementById('dailyTimeDisplay');
const focusTimeDisplay = document.getElementById('focusTimeDisplay');
const readOnlySiteList = document.getElementById('readOnlySiteList');
const siteListInput = document.getElementById('siteList');
const limitMinutesInput = document.getElementById('limitMinutes');
const enableToggle = document.getElementById('enableToggle');

// Buttons
const startFocusBtn = document.getElementById('startFocusBtn');
const stopFocusBtn = document.getElementById('stopFocusBtn');
const settingsBtn = document.getElementById('settingsBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Helper: Format Seconds to HH:MM:SS
function formatTime(seconds) {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Helper: Switch Views
function showView(viewElement) {
  normalView.classList.remove('active-view');
  focusView.classList.remove('active-view');
  settingsView.classList.remove('active-view');
  viewElement.classList.add('active-view');
}

function initPopup() {
  chrome.storage.local.get(['blockedSites', 'timeAllowed', 'isFocusMode', 'isEnabled'], (data) => {
    // Set the toggle switch (default to true if undefined)
    enableToggle.checked = data.isEnabled !== false;

    // Populate Normal View
    readOnlySiteList.innerHTML = '';
    data.blockedSites.forEach(site => {
      let li = document.createElement('li');
      li.textContent = site;
      readOnlySiteList.appendChild(li);
    });

    // Populate Settings View
    siteListInput.value = data.blockedSites.join('\n');
    limitMinutesInput.value = Math.floor(data.timeAllowed / 60);

    // Show correct view
    if (data.isFocusMode) {
      showView(focusView);
    } else {
      showView(normalView);
    }
  });
}

// Update Timers Every Second
function updateClocks() {
  chrome.storage.local.get(['timeAllowed', 'timeSpent', 'isFocusMode', 'focusStartTime'], (data) => {
    // Daily Timer
    const timeLeft = data.timeAllowed - data.timeSpent;
    dailyTimeDisplay.textContent = formatTime(timeLeft);

    // Focus Timer (Stopwatch)
    if (data.isFocusMode && data.focusStartTime) {
      const focusElapsed = Math.floor((Date.now() - data.focusStartTime) / 1000);
      focusTimeDisplay.textContent = formatTime(focusElapsed);
    }
  });
}

// Event Listeners
settingsBtn.addEventListener('click', () => showView(settingsView));
cancelBtn.addEventListener('click', () => showView(normalView));

startFocusBtn.addEventListener('click', () => {
  chrome.storage.local.set({ isFocusMode: true, focusStartTime: Date.now() }, () => {
    showView(focusView);
    updateClocks();
  });
});

stopFocusBtn.addEventListener('click', () => {
  chrome.storage.local.set({ isFocusMode: false, focusStartTime: null }, () => {
    showView(normalView);
    updateClocks();
  });
});

saveBtn.addEventListener('click', () => {
  const sites = siteListInput.value.split('\n').map(s => s.trim()).filter(s => s !== "");
  const newLimitSeconds = parseInt(limitMinutesInput.value, 10) * 60;

  chrome.storage.local.set({ 
    blockedSites: sites,
    timeAllowed: newLimitSeconds 
  }, () => {
    initPopup(); // Re-render the read-only list
    showView(normalView);
  });
});

enableToggle.addEventListener('change', (e) => {
  chrome.storage.local.set({ isEnabled: e.target.checked });
});

// Boot up
initPopup();
setInterval(updateClocks, 1000);
updateClocks();