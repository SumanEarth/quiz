/**
 * GK Summary - Content Script
 * Runs on every page to enable text selection and context features
 */

(function() {
  'use strict';

  // ===== Floating Action Button =====
  let fab = null;
  let tooltip = null;

  function createFAB() {
    if (fab) return;

    fab = document.createElement('div');
    fab.id = 'gk-summary-fab';
    fab.innerHTML = '📝';
    fab.title = 'Summarize selected text';
    fab.style.cssText = `
      display: none;
      position: fixed;
      z-index: 999999;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: white;
      font-size: 18px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
      transition: all 0.2s ease;
      user-select: none;
    `;

    fab.addEventListener('mouseenter', () => {
      fab.style.transform = 'scale(1.1)';
      fab.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.5)';
    });

    fab.addEventListener('mouseleave', () => {
      fab.style.transform = 'scale(1)';
      fab.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
    });

    fab.addEventListener('click', handleFABClick);

    document.body.appendChild(fab);
  }

  // ===== Selection Handler =====
  let selectionTimeout = null;

  document.addEventListener('mouseup', (e) => {
    clearTimeout(selectionTimeout);
    selectionTimeout = setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString()?.trim();

      if (text && text.length > 20) {
        showFAB(e.clientX, e.clientY);
      } else {
        hideFAB();
      }
    }, 300);
  });

  document.addEventListener('mousedown', (e) => {
    if (fab && !fab.contains(e.target) && !tooltip?.contains(e.target)) {
      hideFAB();
      hideTooltip();
    }
  });

  function showFAB(x, y) {
    createFAB();
    fab.style.display = 'block';
    fab.style.left = `${Math.min(x + 10, window.innerWidth - 50)}px`;
    fab.style.top = `${Math.min(y - 50, window.innerHeight - 50)}px`;
  }

  function hideFAB() {
    if (fab) {
      fab.style.display = 'none';
    }
  }

  // ===== FAB Click - Show Quick Summary =====
  function handleFABClick(e) {
    e.stopPropagation();
    const selection = window.getSelection();
    const text = selection?.toString()?.trim();

    if (!text || text.length < 20) {
      hideFAB();
      return;
    }

    // Detect language
    const hasBangla = /[\u0980-\u09FF]/.test(text);
    const lang = hasBangla ? 'bn' : 'en';

    // Generate quick summary
    const summary = quickSummarize(text, lang);
    const keyPoints = quickKeyPoints(text, lang);

    showTooltip(summary, keyPoints, lang);
    hideFAB();
  }

  // ===== Quick Summarize =====
  function quickSummarize(text, lang) {
    const sentences = lang === 'bn'
      ? text.split(/[।|!?]+/).map(s => s.trim()).filter(s => s.length > 15)
      : (text.match(/[^.!?]+[.!?]+/g) || text.split(/\n+/)).map(s => s.trim()).filter(s => s.length > 20);

    if (sentences.length <= 3) return text;

    // Score and pick top sentences
    const scored = sentences.map((s, i) => {
      let score = 0;
      if (i === 0) score += 3;
      if (i === 1) score += 1;
      
      // Numbers boost
      score += (s.match(/\d+/g) || []).length * 0.5;
      
      // Length preference
      const words = s.split(/\s+/).length;
      if (words > 5 && words < 40) score += 1;
      
      return { text: s, score, index: i };
    });

    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .sort((a, b) => a.index - b.index);

    return top.map(s => s.text).join(lang === 'bn' ? '। ' : '. ');
  }

  function quickKeyPoints(text, lang) {
    const sentences = lang === 'bn'
      ? text.split(/[।|!?]+/).map(s => s.trim()).filter(s => s.length > 15)
      : (text.match(/[^.!?]+[.!?]+/g) || text.split(/\n+/)).map(s => s.trim()).filter(s => s.length > 20);

    return sentences.slice(0, 5).map(s => {
      if (s.length > 120) return s.substring(0, 117) + '...';
      return s;
    });
  }

  // ===== Tooltip =====
  function showTooltip(summary, keyPoints, lang) {
    hideTooltip();

    tooltip = document.createElement('div');
    tooltip.id = 'gk-summary-tooltip';
    
    const fontFamily = lang === 'bn' 
      ? "'Noto Sans Bengali', 'Kalpurush', 'SolaimanLipi', sans-serif"
      : "'Segoe UI', -apple-system, sans-serif";

    tooltip.style.cssText = `
      position: fixed;
      z-index: 999999;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 380px;
      max-height: 450px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      font-family: ${fontFamily};
      overflow: hidden;
      animation: gkFadeIn 0.2s ease;
    `;

    tooltip.innerHTML = `
      <style>
        @keyframes gkFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        #gk-summary-tooltip * { box-sizing: border-box; margin: 0; padding: 0; }
        .gk-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 16px; background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
        }
        .gk-header h3 { font-size: 14px; font-weight: 600; }
        .gk-close {
          background: rgba(255,255,255,0.2); border: none; color: white;
          width: 24px; height: 24px; border-radius: 50%; cursor: pointer;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
        }
        .gk-close:hover { background: rgba(255,255,255,0.3); }
        .gk-tabs {
          display: flex; border-bottom: 1px solid #e2e8f0; background: #f8fafc;
        }
        .gk-tab {
          flex: 1; padding: 8px; border: none; background: none;
          font-size: 12px; cursor: pointer; color: #64748b;
          border-bottom: 2px solid transparent;
        }
        .gk-tab.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }
        .gk-body {
          padding: 14px 16px; max-height: 300px; overflow-y: auto;
          font-size: 13px; line-height: 1.7; color: #1e293b;
        }
        .gk-keypoint {
          display: flex; gap: 8px; padding: 6px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .gk-keypoint:last-child { border-bottom: none; }
        .gk-num {
          min-width: 20px; height: 20px; background: #2563eb; color: white;
          border-radius: 50%; font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .gk-actions {
          display: flex; gap: 8px; padding: 10px 16px;
          border-top: 1px solid #e2e8f0; background: #f8fafc;
        }
        .gk-btn {
          flex: 1; padding: 7px 12px; border: 1px solid #e2e8f0;
          border-radius: 6px; background: white; font-size: 12px;
          cursor: pointer; text-align: center; transition: all 0.2s;
        }
        .gk-btn:hover { border-color: #2563eb; color: #2563eb; }
        .gk-btn-primary {
          background: #2563eb; color: white; border-color: #2563eb;
        }
        .gk-btn-primary:hover { background: #1d4ed8; }
        .gk-hidden { display: none; }
      </style>
      
      <div class="gk-header">
        <h3>📝 GK Summary</h3>
        <button class="gk-close" id="gk-close">✕</button>
      </div>
      
      <div class="gk-tabs">
        <button class="gk-tab active" data-gktab="summary">Summary</button>
        <button class="gk-tab" data-gktab="keypoints">Key Points</button>
      </div>
      
      <div class="gk-body" id="gk-body-summary">
        ${summary}
      </div>
      
      <div class="gk-body gk-hidden" id="gk-body-keypoints">
        ${keyPoints.map((kp, i) => `
          <div class="gk-keypoint">
            <span class="gk-num">${i + 1}</span>
            <span>${kp}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="gk-actions">
        <button class="gk-btn" id="gk-copy-summary">📋 Copy</button>
        <button class="gk-btn gk-btn-primary" id="gk-open-extension">🔍 Full Analysis</button>
      </div>
    `;

    document.body.appendChild(tooltip);

    // Event listeners
    tooltip.querySelector('#gk-close').addEventListener('click', hideTooltip);
    
    tooltip.querySelectorAll('.gk-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tooltip.querySelectorAll('.gk-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.dataset.gktab;
        document.getElementById('gk-body-summary').classList.toggle('gk-hidden', tabName !== 'summary');
        document.getElementById('gk-body-keypoints').classList.toggle('gk-hidden', tabName !== 'keypoints');
      });
    });

    tooltip.querySelector('#gk-copy-summary').addEventListener('click', () => {
      const activeTab = tooltip.querySelector('.gk-tab.active').dataset.gktab;
      const text = activeTab === 'summary' ? summary : keyPoints.join('\n');
      
      navigator.clipboard.writeText(text).then(() => {
        tooltip.querySelector('#gk-copy-summary').textContent = '✅ Copied!';
        setTimeout(() => {
          if (tooltip) tooltip.querySelector('#gk-copy-summary').textContent = '📋 Copy';
        }, 2000);
      });
    });

    tooltip.querySelector('#gk-open-extension').addEventListener('click', () => {
      // This will trigger the extension popup
      hideTooltip();
    });

    // Close on Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        hideTooltip();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  // ===== Keyboard Shortcut =====
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+S to summarize selected text
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      const selection = window.getSelection();
      const text = selection?.toString()?.trim();
      
      if (text && text.length > 20) {
        const hasBangla = /[\u0980-\u09FF]/.test(text);
        const lang = hasBangla ? 'bn' : 'en';
        const summary = quickSummarize(text, lang);
        const keyPoints = quickKeyPoints(text, lang);
        showTooltip(summary, keyPoints, lang);
      }
    }
  });

  // ===== Message Handler =====
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getPageContent') {
      const content = extractFullContent();
      sendResponse(content);
    }
    
    if (message.action === 'getSelectedText') {
      const text = window.getSelection()?.toString()?.trim() || '';
      sendResponse({ text });
    }
    
    return true;
  });

  function extractFullContent() {
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', 'aside',
      '.advertisement', '.ad', '.ads', '.sidebar', '.menu',
      '.nav', '.navigation', '.social-share', '.comments'
    ];

    const mainSelectors = [
      'article', 'main', '[role="main"]', '.article-body',
      '.post-content', '.entry-content', '.story-body',
      '.article-content', '.news-content', '.content-area',
      '.story-element', '.article-detail', '.news-detail'
    ];

    let contentElement = null;
    for (const selector of mainSelectors) {
      contentElement = document.querySelector(selector);
      if (contentElement) break;
    }
    if (!contentElement) contentElement = document.body;

    const clone = contentElement.cloneNode(true);
    unwantedSelectors.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    const text = (clone.innerText || clone.textContent || '')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return {
      text: text.substring(0, 15000),
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname
    };
  }

  console.log('GK Summary: Content script loaded ✅');
})();
