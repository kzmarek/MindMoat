let activeTabId = null;
let lastActiveTime = Date.now();
let currentUrl = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: ["youtube.com", "reddit.com", "facebook.com"],
    timeAllowed: 3600,
    timeSpent: 0,
    isEnabled: true,
    lastDate: new Date().toDateString(),
    isFocusMode: false,
    focusStartTime: null
  });
});

function isBlockedSite(url, blockedSites) {
  if (!url) return false;
  return blockedSites.some(site => url.includes(site) && site.trim() !== "");
}

async function handleDailyReset() {
  const data = await chrome.storage.local.get(['lastDate']);
  const today = new Date().toDateString();
  if (data.lastDate !== today) {
    await chrome.storage.local.set({ lastDate: today, timeSpent: 0 });
  }
}

async function updateTimeAndCheckBlock() {
  await handleDailyReset();
  const data = await chrome.storage.local.get(['blockedSites', 'timeAllowed', 'timeSpent', 'isEnabled', 'isFocusMode']);
  
  // 1. ALWAYS calculate time difference and update lastActiveTime first
  const now = Date.now();
  const timeDiff = Math.floor((now - lastActiveTime) / 1000);
  lastActiveTime = now;

  // 2. NOW check if the tracker is disabled. If it is, stop here.
  if (!data.isEnabled) return;

  // 3. If tracker is active, apply the time diff to the site
  if (isBlockedSite(currentUrl, data.blockedSites)) {
    let newTimeSpent = data.timeSpent + timeDiff;
    
    if (!data.isFocusMode) {
      await chrome.storage.local.set({ timeSpent: newTimeSpent });
    }

    if (data.isFocusMode) {
      chrome.tabs.update(activeTabId, { url: chrome.runtime.getURL("blocked.html?reason=focus") });
    } else if (newTimeSpent >= data.timeAllowed) {
      chrome.tabs.update(activeTabId, { url: chrome.runtime.getURL("blocked.html?reason=limit") });
    }
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTimeAndCheckBlock();
  activeTabId = activeInfo.tabId;
  const tab = await chrome.tabs.get(activeTabId);
  currentUrl = tab.url;
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    await updateTimeAndCheckBlock();
    currentUrl = changeInfo.url;
  }
});

setInterval(() => {
  updateTimeAndCheckBlock();
}, 1000);