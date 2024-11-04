document.addEventListener('DOMContentLoaded', function () {
  const tabList = document.getElementById('tabList')
  const resetButton = document.getElementById('resetButton')

  // Fetch timers from background script
  chrome.runtime.sendMessage({ type: 'getTimers' }, (response) => {
    if (response.timers) {
      for (const tabId in response.timers) {
        const tabData = response.timers[tabId]
        const tabCard = document.createElement('div')
        tabCard.classList.add('tab-info')

        const tabTitle = document.createElement('h5')
        tabTitle.innerText = tabData.title || 'Untitled Tab'
        tabCard.appendChild(tabTitle)

        const timeSpent = document.createElement('p')
        const seconds = Math.floor(tabData.totalTime / 1000)
        timeSpent.innerText = `Time spent: ${seconds} seconds`
        tabCard.appendChild(timeSpent)

        tabList.appendChild(tabCard)
      }
    } else {
      tabList.innerHTML = '<p class="no-timers">No active timers.</p>'
    }
  })

  // Reset timers
  resetButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'resetTimers' }, (response) => {
      if (response.success) {
        tabList.innerHTML = '<p class="no-timers">All timers reset.</p>'
      }
    })
  })
})
