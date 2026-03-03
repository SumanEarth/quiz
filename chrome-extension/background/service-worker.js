/**
 * GK Summary - Background Service Worker
 * Handles context menus, badge updates, and cross-component communication
 */

// ===== Context Menu Setup =====
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items
  chrome.contextMenus.create({
    id: 'gk-summarize-selection',
    title: '📝 Summarize Selected Text',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'gk-keypoints-selection',
    title: '🎯 Extract Key Points',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'gk-separator',
    type: 'separator',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'gk-copy-summary',
    title: '📋 Copy Summary',
    contexts: ['selection']
  });

  // Set default badge
  chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });

  console.log('GK Summary: Extension installed ✅');
});

// ===== Context Menu Click Handler =====
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  const selectedText = info.selectionText || '';

  if (info.menuItemId === 'gk-summarize-selection') {
    // Inject and execute summarization
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: summarizeText,
        args: [selectedText]
      });

      if (results && results[0]?.result) {
        // Copy to clipboard via content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            navigator.clipboard.writeText(text);
            // Show notification
            showNotification('📝 Summary copied to clipboard!');
          },
          args: [results[0].result]
        });
      }
    } catch (error) {
      console.error('Summarize error:', error);
    }
  }

  if (info.menuItemId === 'gk-keypoints-selection') {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractKeyPointsFromText,
        args: [selectedText]
      });

      if (results && results[0]?.result) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            navigator.clipboard.writeText(text);
            showNotification('🎯 Key points copied to clipboard!');
          },
          args: [results[0].result]
        });
      }
    } catch (error) {
      console.error('Key points error:', error);
    }
  }

  if (info.menuItemId === 'gk-copy-summary') {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: summarizeText,
        args: [selectedText]
      });

      if (results && results[0]?.result) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            navigator.clipboard.writeText(text);
          },
          args: [results[0].result]
        });
      }
    } catch (error) {
      console.error('Copy summary error:', error);
    }
  }
});

// ===== Summarization Function (injected into page) =====
function summarizeText(text) {
  if (!text || text.length < 20) return text;

  const hasBangla = /[\u0980-\u09FF]/.test(text);
  const lang = hasBangla ? 'bn' : 'en';

  let sentences;
  if (lang === 'bn') {
    sentences = text.split(/[।|!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  } else {
    sentences = (text.match(/[^.!?]+[.!?]+/g) || text.split(/\n+/))
      .map(s => s.trim())
      .filter(s => s.length > 20);
  }

  if (sentences.length <= 3) return text;

  // Score sentences
  const scored = sentences.map((s, i) => {
    let score = 0;
    if (i === 0) score += 3;
    if (i === 1) score += 1;
    score += (s.match(/\d+/g) || []).length * 0.5;
    const words = s.split(/\s+/).length;
    if (words > 5 && words < 40) score += 1;
    return { text: s, score, index: i };
  });

  const count = Math.min(4, scored.length);
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index);

  return top.map(s => s.text).join(lang === 'bn' ? '। ' : '. ');
}

// ===== Key Points Extraction (injected into page) =====
function extractKeyPointsFromText(text) {
  if (!text || text.length < 20) return text;

  const hasBangla = /[\u0980-\u09FF]/.test(text);
  const lang = hasBangla ? 'bn' : 'en';

  let sentences;
  if (lang === 'bn') {
    sentences = text.split(/[।|!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  } else {
    sentences = (text.match(/[^.!?]+[.!?]+/g) || text.split(/\n+/))
      .map(s => s.trim())
      .filter(s => s.length > 20);
  }

  const points = sentences.slice(0, 7).map((s, i) => {
    if (s.length > 150) s = s.substring(0, 147) + '...';
    return `${i + 1}. ${s}`;
  });

  return '🎯 Key Points:\n\n' + points.join('\n');
}

// ===== Notification Helper (injected into page) =====
function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: gkSlideIn 0.3s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gkSlideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes gkSlideOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(20px); }
    }
  `;
  document.head.appendChild(style);

  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'gkSlideOut 0.3s ease';
    setTimeout(() => {
      notif.remove();
      style.remove();
    }, 300);
  }, 2500);
}

// ===== Message Handler =====
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateBadge') {
    chrome.action.setBadgeText({ text: message.text || '' });
  }

  if (message.action === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          url: tabs[0].url,
          title: tabs[0].title,
          id: tabs[0].id
        });
      }
    });
    return true; // Keep message channel open for async response
  }
});

// ===== Tab Update Handler =====
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if it's a newspaper site
    const isNewspaper = checkIfNewspaper(tab.url);
    if (isNewspaper) {
      chrome.action.setBadgeText({ tabId, text: '📰' });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  }
});

function checkIfNewspaper(url) {
  const newspaperDomains = [
    'prothomalo.com', 'kalerkantho.com', 'jugantor.com', 'ittefaq.com.bd',
    'samakal.com', 'banglanews24.com', 'dailynayadiganta.com', 'manabzamin.com',
    'bd-pratidin.com', 'thedailystar.net', 'dhakatribune.com', 'newagebd.net',
    'tbsnews.net', 'observerbd.com', 'thefinancialexpress.com.bd',
    'bbc.com', 'cnn.com', 'reuters.com', 'aljazeera.com',
    'nytimes.com', 'theguardian.com', 'washingtonpost.com'
  ];

  return newspaperDomains.some(domain => url.includes(domain));
}

console.log('GK Summary: Service worker started ✅');
