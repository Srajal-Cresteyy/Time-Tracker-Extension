// Initialize an object to hold tab timers
let tabTimers = {}

// Function to start or update the timer for a tab
function startTimer(tabId) {
  if (!tabTimers[tabId]) {
    tabTimers[tabId] = {
      totalTime: 0,
      title: '',
      intervalId: null,
    }
  }
  // Set an interval to count the time for the tab
  tabTimers[tabId].intervalId = setInterval(() => {
    tabTimers[tabId].totalTime += 1000 // Increment time by 1000 ms (1 second)
  }, 1000)
}

// Listen for new tab openings
chrome.tabs.onCreated.addListener((tab) => {
  startTimer(tab.id)
})

// Listen for tab removal to clear the timer
chrome.tabs.onRemoved.addListener((tabId) => {
  clearInterval(tabTimers[tabId]?.intervalId)
  delete tabTimers[tabId] // Remove the timer for this tab
})

// Listen for tab updates (URL change, title change, etc.)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Start timer if the tab is active
  if (changeInfo.status === 'complete') {
    if (!tabTimers[tabId]) {
      startTimer(tabId)
    }
    // Update the title in the timer object if the tab's title changes
    if (changeInfo.title) {
      tabTimers[tabId].title = changeInfo.title // Update the title
    } else {
      tabTimers[tabId].title = tab.title || 'Untitled Tab' // Fallback to tab title
    }
  }
})

// Message listener to get timers or reset timers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getTimers') {
    sendResponse({ timers: tabTimers })
  } else if (request.type === 'resetTimers') {
    for (const tabId in tabTimers) {
      clearInterval(tabTimers[tabId]?.intervalId)
      delete tabTimers[tabId]
    }
    sendResponse({ success: true })
  }
})
