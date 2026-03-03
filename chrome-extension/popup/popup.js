/**
 * GK Summary - Exam Prep Key Points
 * Main Popup Script
 */

// ===== State Management =====
const state = {
  currentTab: 'summary',
  language: 'en',
  settings: {
    language: 'en',
    summaryLength: 'medium',
    examType: 'general',
    autoDetect: true,
    darkMode: false
  },
  pageContent: null,
  currentQuiz: null,
  quizIndex: 0,
  quizAnswers: [],
  savedItems: []
};

// ===== Bangla Newspaper Domains =====
const BANGLA_NEWSPAPERS = [
  'prothomalo.com', 'kalerkantho.com', 'jugantor.com', 'ittefaq.com.bd',
  'samakal.com', 'banglanews24.com', 'dailynayadiganta.com', 'manabzamin.com',
  'bd-pratidin.com', 'amadershomoy.com', 'dailyjanakantha.com', 'dailyinqilab.com',
  'bonikbarta.net', 'sangbad.net.bd', 'dainikamadershomoy.com', 'jaijaidin.com',
  'banglatribune.com', 'risingbd.com', 'jagonews24.com', 'thedailycampus.com'
];

const ENGLISH_NEWSPAPERS = [
  'thedailystar.net', 'dhakatribune.com', 'newagebd.net', 'tbsnews.net',
  'observerbd.com', 'thefinancialexpress.com.bd', 'theindependentbd.com',
  'bssnews.net', 'unb.com.bd'
];

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadSavedItems();
  initTabs();
  initButtons();
  initSettings();
  applyTheme();
  checkForSelectedText();
});

// ===== Settings Management =====
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get('settings');
    if (result.settings) {
      state.settings = { ...state.settings, ...result.settings };
      state.language = state.settings.language;
    }
  } catch (e) {
    console.log('Using default settings');
  }
}

async function saveSettings() {
  try {
    await chrome.storage.local.set({ settings: state.settings });
  } catch (e) {
    console.log('Could not save settings');
  }
}

async function loadSavedItems() {
  try {
    const result = await chrome.storage.local.get('savedItems');
    if (result.savedItems) {
      state.savedItems = result.savedItems;
    }
  } catch (e) {
    console.log('Could not load saved items');
  }
  renderSavedItems();
}

async function saveSavedItems() {
  try {
    await chrome.storage.local.set({ savedItems: state.savedItems });
  } catch (e) {
    console.log('Could not save items');
  }
}

// ===== Tab Navigation =====
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  state.currentTab = tabName;
  
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ===== Button Handlers =====
function initButtons() {
  // Summary
  document.getElementById('btn-summarize').addEventListener('click', handleSummarize);
  document.getElementById('btn-summarize-selected')?.addEventListener('click', handleSummarizeSelected);
  
  // Key Points
  document.getElementById('btn-keypoints').addEventListener('click', handleKeyPoints);
  
  // Quiz
  document.getElementById('btn-generate-quiz').addEventListener('click', handleGenerateQuiz);
  document.getElementById('btn-prev-question').addEventListener('click', () => navigateQuiz(-1));
  document.getElementById('btn-next-question').addEventListener('click', () => navigateQuiz(1));
  document.getElementById('btn-retry-quiz').addEventListener('click', handleGenerateQuiz);
  
  // Saved
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSavedItems(btn.dataset.filter);
    });
  });
  document.getElementById('btn-export').addEventListener('click', handleExport);
  document.getElementById('btn-clear-saved').addEventListener('click', handleClearSaved);
  
  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId).innerText;
      copyToClipboard(text);
    });
  });
  
  // Save buttons
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', () => handleSave(btn.dataset.type));
  });
  
  // Language toggle
  document.getElementById('btn-language').addEventListener('click', toggleLanguage);
  
  // Settings
  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.remove('hidden');
  });
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.add('hidden');
  });
}

// ===== Settings UI =====
function initSettings() {
  const langSelect = document.getElementById('setting-language');
  const lengthSelect = document.getElementById('setting-summary-length');
  const examSelect = document.getElementById('setting-exam-type');
  const autoDetect = document.getElementById('setting-auto-detect');
  const darkMode = document.getElementById('setting-dark-mode');
  
  langSelect.value = state.settings.language;
  lengthSelect.value = state.settings.summaryLength;
  examSelect.value = state.settings.examType;
  autoDetect.checked = state.settings.autoDetect;
  darkMode.checked = state.settings.darkMode;
  
  langSelect.addEventListener('change', (e) => {
    state.settings.language = e.target.value;
    state.language = e.target.value;
    updateLanguageLabel();
    saveSettings();
  });
  
  lengthSelect.addEventListener('change', (e) => {
    state.settings.summaryLength = e.target.value;
    document.getElementById('summary-length').value = e.target.value;
    saveSettings();
  });
  
  examSelect.addEventListener('change', (e) => {
    state.settings.examType = e.target.value;
    saveSettings();
  });
  
  autoDetect.addEventListener('change', (e) => {
    state.settings.autoDetect = e.target.checked;
    saveSettings();
  });
  
  darkMode.addEventListener('change', (e) => {
    state.settings.darkMode = e.target.checked;
    applyTheme();
    saveSettings();
  });
  
  updateLanguageLabel();
}

function updateLanguageLabel() {
  const label = document.getElementById('lang-label');
  const langMap = { en: 'EN', bn: 'বাং', both: 'EN/বাং' };
  label.textContent = langMap[state.language] || 'EN';
}

function toggleLanguage() {
  const langs = ['en', 'bn', 'both'];
  const idx = langs.indexOf(state.language);
  state.language = langs[(idx + 1) % langs.length];
  state.settings.language = state.language;
  updateLanguageLabel();
  saveSettings();
  showToast(`Language: ${state.language === 'en' ? 'English' : state.language === 'bn' ? 'বাংলা' : 'Both'}`);
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.settings.darkMode ? 'dark' : 'light');
}

// ===== Page Content Extraction =====
async function getPageContent() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent
    });
    
    if (results && results[0] && results[0].result) {
      state.pageContent = results[0].result;
      return state.pageContent;
    }
    
    throw new Error('Could not extract content');
  } catch (error) {
    console.error('Content extraction error:', error);
    showToast('❌ Could not read page content');
    return null;
  }
}

function extractPageContent() {
  // Remove unwanted elements
  const unwantedSelectors = [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    '.advertisement', '.ad', '.ads', '.sidebar', '.menu',
    '.nav', '.navigation', '.social-share', '.comments',
    '#comments', '.related-posts', '.cookie-notice'
  ];
  
  // Try to find main content area
  const mainSelectors = [
    'article', 'main', '[role="main"]', '.article-body',
    '.post-content', '.entry-content', '.story-body',
    '.article-content', '.news-content', '.content-area',
    // Bangla newspaper specific selectors
    '.story-element', '.article-detail', '.news-detail',
    '.content-details', '.story-content'
  ];
  
  let contentElement = null;
  
  for (const selector of mainSelectors) {
    contentElement = document.querySelector(selector);
    if (contentElement) break;
  }
  
  if (!contentElement) {
    contentElement = document.body;
  }
  
  // Clone to avoid modifying the page
  const clone = contentElement.cloneNode(true);
  
  // Remove unwanted elements from clone
  unwantedSelectors.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  // Get text content
  const text = clone.innerText || clone.textContent || '';
  
  // Clean up text
  const cleanText = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  // Get metadata
  const title = document.title || '';
  const url = window.location.href;
  const domain = window.location.hostname;
  const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
  const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
  const publishDate = document.querySelector('time')?.getAttribute('datetime') ||
    document.querySelector('[class*="date"]')?.textContent?.trim() || '';
  
  // Detect language
  const htmlLang = document.documentElement.lang || '';
  const hasBangla = /[\u0980-\u09FF]/.test(cleanText.substring(0, 500));
  const detectedLang = hasBangla ? 'bn' : 'en';
  
  return {
    text: cleanText.substring(0, 15000), // Limit text length
    title: ogTitle || title,
    url,
    domain,
    description: metaDescription,
    publishDate,
    detectedLang,
    wordCount: cleanText.split(/\s+/).length
  };
}

// ===== Check for Selected Text =====
async function checkForSelectedText() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString()?.trim() || ''
    });
    
    if (results && results[0] && results[0].result) {
      const selectedText = results[0].result;
      if (selectedText.length > 10) {
        const section = document.getElementById('selected-text-section');
        const preview = document.getElementById('selected-text-preview');
        section.classList.remove('hidden');
        preview.textContent = selectedText.substring(0, 300) + (selectedText.length > 300 ? '...' : '');
        state.selectedText = selectedText;
      }
    }
  } catch (e) {
    // Ignore - selected text is optional
  }
}

// ===== Summarization Engine =====
async function handleSummarize() {
  const loading = document.getElementById('summary-loading');
  const result = document.getElementById('summary-result');
  
  loading.classList.remove('hidden');
  result.classList.add('hidden');
  
  const content = await getPageContent();
  if (!content) {
    loading.classList.add('hidden');
    return;
  }
  
  const length = document.getElementById('summary-length').value;
  const summary = generateSummary(content.text, content.title, length, content.detectedLang);
  
  // Display results
  document.getElementById('summary-text').innerHTML = formatText(summary, content.detectedLang);
  document.getElementById('summary-source').textContent = `📰 ${content.domain}`;
  document.getElementById('summary-date').textContent = content.publishDate ? `📅 ${content.publishDate}` : '';
  document.getElementById('summary-words').textContent = `📝 ${content.wordCount} words`;
  
  loading.classList.add('hidden');
  result.classList.remove('hidden');
}

async function handleSummarizeSelected() {
  if (!state.selectedText) return;
  
  const loading = document.getElementById('summary-loading');
  const result = document.getElementById('summary-result');
  
  loading.classList.remove('hidden');
  result.classList.add('hidden');
  
  const hasBangla = /[\u0980-\u09FF]/.test(state.selectedText);
  const lang = hasBangla ? 'bn' : 'en';
  const summary = generateSummary(state.selectedText, '', 'medium', lang);
  
  document.getElementById('summary-text').innerHTML = formatText(summary, lang);
  document.getElementById('summary-source').textContent = '✂️ Selected Text';
  document.getElementById('summary-date').textContent = '';
  document.getElementById('summary-words').textContent = `📝 ${state.selectedText.split(/\s+/).length} words`;
  
  loading.classList.add('hidden');
  result.classList.remove('hidden');
}

function generateSummary(text, title, length, lang) {
  const sentences = extractSentences(text, lang);
  
  if (sentences.length === 0) {
    return lang === 'bn' 
      ? 'পৃষ্ঠা থেকে পর্যাপ্ত বিষয়বস্তু বের করা যায়নি।'
      : 'Could not extract enough content from the page.';
  }
  
  // Score sentences by importance
  const scored = scoreSentences(sentences, title, lang);
  
  // Select top sentences based on length preference
  const countMap = { short: 4, medium: 7, detailed: 12 };
  const count = Math.min(countMap[length] || 7, scored.length);
  
  // Get top scored sentences, maintaining original order
  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map(s => s.text);
  
  return topSentences.join(' ');
}

function extractSentences(text, lang) {
  let sentences;
  
  if (lang === 'bn') {
    // Bangla sentence splitting (uses | and ।)
    sentences = text.split(/[।|!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  } else {
    // English sentence splitting
    sentences = text.match(/[^.!?]+[.!?]+/g) || text.split(/\n+/);
    sentences = sentences.map(s => s.trim()).filter(s => s.length > 20 && s.split(' ').length > 4);
  }
  
  return sentences;
}

function scoreSentences(sentences, title, lang) {
  const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordFreq = {};
  
  // Calculate word frequency
  sentences.forEach(s => {
    const words = s.toLowerCase().split(/\s+/);
    words.forEach(w => {
      if (w.length > 3) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });
  });
  
  // Important keywords for GK/exam content
  const importantKeywords = lang === 'bn' 
    ? ['সরকার', 'বাংলাদেশ', 'মন্ত্রী', 'প্রধানমন্ত্রী', 'রাষ্ট্রপতি', 'জাতীয়', 'আন্তর্জাতিক',
       'অর্থনীতি', 'শিক্ষা', 'স্বাস্থ্য', 'প্রযুক্তি', 'বিজ্ঞান', 'ইতিহাস', 'সংস্কৃতি',
       'নির্বাচন', 'সংসদ', 'আইন', 'বিচার', 'উন্নয়ন', 'পরিকল্পনা', 'বাজেট',
       'কোটি', 'লক্ষ', 'শতাংশ', 'প্রথম', 'সর্বোচ্চ', 'সর্বনিম্ন']
    : ['government', 'minister', 'president', 'prime', 'national', 'international',
       'economy', 'education', 'health', 'technology', 'science', 'history', 'culture',
       'election', 'parliament', 'law', 'development', 'budget', 'policy',
       'billion', 'million', 'percent', 'first', 'highest', 'largest', 'important',
       'announced', 'launched', 'established', 'signed', 'agreement', 'treaty'];
  
  return sentences.map((text, index) => {
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    // Position score (first and last sentences are important)
    if (index === 0) score += 3;
    if (index === 1) score += 2;
    if (index === sentences.length - 1) score += 1;
    
    // Title relevance
    titleWords.forEach(tw => {
      if (text.toLowerCase().includes(tw)) score += 2;
    });
    
    // Word frequency score
    words.forEach(w => {
      if (wordFreq[w] && wordFreq[w] > 1) score += 0.5;
    });
    
    // Important keywords
    importantKeywords.forEach(kw => {
      if (text.toLowerCase().includes(kw)) score += 1.5;
    });
    
    // Numbers and dates (important for GK)
    const numberCount = (text.match(/\d+/g) || []).length;
    score += numberCount * 0.8;
    
    // Proper nouns (capitalized words in English)
    if (lang === 'en') {
      const properNouns = (text.match(/[A-Z][a-z]+/g) || []).length;
      score += properNouns * 0.3;
    }
    
    // Sentence length penalty (too short or too long)
    if (words.length < 5) score -= 2;
    if (words.length > 50) score -= 1;
    
    // Quotes are often important
    if (text.includes('"') || text.includes('"') || text.includes('"')) score += 1;
    
    return { text, index, score };
  });
}

// ===== Key Points Extraction =====
async function handleKeyPoints() {
  const loading = document.getElementById('keypoints-loading');
  const result = document.getElementById('keypoints-result');
  
  loading.classList.remove('hidden');
  result.classList.add('hidden');
  
  const content = await getPageContent();
  if (!content) {
    loading.classList.add('hidden');
    return;
  }
  
  const category = document.getElementById('keypoints-category').value;
  const keypoints = extractKeyPoints(content.text, content.title, category, content.detectedLang);
  const facts = extractFacts(content.text, content.detectedLang);
  const tips = generateExamTips(category, content.detectedLang);
  
  // Render key points
  const container = document.getElementById('keypoints-list');
  container.innerHTML = keypoints.map((kp, i) => `
    <div class="keypoint-item ${content.detectedLang === 'bn' ? 'bangla-text' : ''}">
      <span class="keypoint-number">${i + 1}</span>
      <span class="keypoint-text">${kp}</span>
      <button class="keypoint-copy" onclick="copyToClipboard('${escapeForAttr(kp)}')">📋</button>
    </div>
  `).join('');
  
  // Render facts
  if (facts.length > 0) {
    const factsSection = document.getElementById('important-facts');
    const factsList = document.getElementById('facts-list');
    factsSection.classList.remove('hidden');
    factsList.innerHTML = facts.map(f => `
      <div class="fact-item ${content.detectedLang === 'bn' ? 'bangla-text' : ''}">
        <span>📌</span>
        <span>${f}</span>
      </div>
    `).join('');
  }
  
  // Render tips
  if (tips.length > 0) {
    const tipsSection = document.getElementById('exam-tips');
    const tipsList = document.getElementById('tips-list');
    tipsSection.classList.remove('hidden');
    tipsList.innerHTML = tips.map(t => `
      <div class="tip-item">
        <span>💡</span>
        <span>${t}</span>
      </div>
    `).join('');
  }
  
  loading.classList.add('hidden');
  result.classList.remove('hidden');
}

function extractKeyPoints(text, title, category, lang) {
  const sentences = extractSentences(text, lang);
  const scored = scoreSentences(sentences, title, lang);
  
  // Category-specific keywords boost
  const categoryKeywords = getCategoryKeywords(category, lang);
  
  scored.forEach(item => {
    categoryKeywords.forEach(kw => {
      if (item.text.toLowerCase().includes(kw.toLowerCase())) {
        item.score += 2;
      }
    });
  });
  
  // Get top key points
  const topPoints = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .sort((a, b) => a.index - b.index);
  
  // Format as concise key points
  return topPoints.map(p => {
    let text = p.text.trim();
    // Truncate very long sentences
    if (text.length > 200) {
      text = text.substring(0, 197) + '...';
    }
    return text;
  });
}

function getCategoryKeywords(category, lang) {
  const keywords = {
    'general': lang === 'bn' 
      ? ['বাংলাদেশ', 'জাতীয়', 'সরকার', 'প্রধানমন্ত্রী', 'গুরুত্বপূর্ণ']
      : ['important', 'national', 'government', 'significant', 'major'],
    'current-affairs': lang === 'bn'
      ? ['সাম্প্রতিক', 'নতুন', 'ঘোষণা', 'চুক্তি', 'সম্মেলন']
      : ['recent', 'new', 'announced', 'agreement', 'summit', 'conference'],
    'history': lang === 'bn'
      ? ['ইতিহাস', 'সাল', 'যুদ্ধ', 'স্বাধীনতা', 'আন্দোলন', 'মুক্তিযুদ্ধ']
      : ['history', 'year', 'war', 'independence', 'movement', 'founded'],
    'geography': lang === 'bn'
      ? ['ভূগোল', 'নদী', 'পাহাড়', 'জেলা', 'আয়তন', 'জনসংখ্যা']
      : ['geography', 'river', 'mountain', 'area', 'population', 'region'],
    'science': lang === 'bn'
      ? ['বিজ্ঞান', 'প্রযুক্তি', 'গবেষণা', 'আবিষ্কার', 'চিকিৎসা']
      : ['science', 'technology', 'research', 'discovery', 'medical'],
    'economy': lang === 'bn'
      ? ['অর্থনীতি', 'বাজেট', 'রপ্তানি', 'আমদানি', 'জিডিপি', 'প্রবৃদ্ধি']
      : ['economy', 'budget', 'export', 'import', 'GDP', 'growth', 'trade'],
    'politics': lang === 'bn'
      ? ['রাজনীতি', 'নির্বাচন', 'সংসদ', 'দল', 'ভোট', 'আইন']
      : ['politics', 'election', 'parliament', 'party', 'vote', 'law'],
    'sports': lang === 'bn'
      ? ['খেলা', 'ক্রিকেট', 'ফুটবল', 'বিশ্বকাপ', 'চ্যাম্পিয়ন', 'পদক']
      : ['sports', 'cricket', 'football', 'world cup', 'champion', 'medal'],
    'international': lang === 'bn'
      ? ['আন্তর্জাতিক', 'জাতিসংঘ', 'বিশ্ব', 'দেশ', 'চুক্তি']
      : ['international', 'united nations', 'world', 'global', 'treaty']
  };
  
  return keywords[category] || keywords['general'];
}

function extractFacts(text, lang) {
  const facts = [];
  
  // Extract sentences with numbers, dates, and specific data
  const sentences = extractSentences(text, lang);
  
  sentences.forEach(s => {
    // Contains specific numbers/statistics
    if (/\d+[\.,]?\d*\s*(percent|%|কোটি|লক্ষ|billion|million|crore|lakh)/i.test(s)) {
      if (s.length < 200) facts.push(s.trim());
    }
    // Contains dates
    if (/\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\b/i.test(s) && s.length < 200) {
      if (!facts.includes(s.trim()) && facts.length < 5) {
        facts.push(s.trim());
      }
    }
    // Contains "first", "largest", "highest" etc.
    if (/(first|largest|highest|lowest|biggest|smallest|প্রথম|সর্বোচ্চ|সর্বনিম্ন|সবচেয়ে)/i.test(s)) {
      if (s.length < 200 && !facts.includes(s.trim()) && facts.length < 5) {
        facts.push(s.trim());
      }
    }
  });
  
  return facts.slice(0, 5);
}

function generateExamTips(category, lang) {
  const tips = {
    'general': [
      '🎯 Focus on names, dates, and places mentioned in the article',
      '📊 Note any statistics or numerical data - these are common in MCQs',
      '🔗 Connect this information with related topics you already know'
    ],
    'current-affairs': [
      '📅 Remember the exact dates and timeline of events',
      '👤 Note the key people involved and their designations',
      '🌍 Understand the international context and implications'
    ],
    'history': [
      '📅 Create a timeline of events mentioned',
      '👥 Remember key figures and their contributions',
      '🔄 Understand cause and effect relationships'
    ],
    'geography': [
      '🗺️ Visualize locations on a map',
      '📊 Remember area, population, and other statistics',
      '🌊 Note geographical features and their significance'
    ],
    'science': [
      '🔬 Focus on scientific terms and their definitions',
      '🧪 Understand the process or mechanism described',
      '📱 Note practical applications mentioned'
    ],
    'economy': [
      '📈 Remember key economic indicators and figures',
      '💰 Note budget allocations and financial data',
      '📊 Understand trends and comparisons'
    ],
    'politics': [
      '🏛️ Note constitutional references and legal frameworks',
      '👥 Remember political figures and their roles',
      '📋 Understand policy implications'
    ],
    'sports': [
      '🏆 Remember tournament names, venues, and dates',
      '🥇 Note records, achievements, and milestones',
      '👤 Remember player names and their achievements'
    ],
    'international': [
      '🌍 Note country names and their leaders',
      '🤝 Remember international agreements and organizations',
      '📊 Understand global rankings and indices'
    ]
  };
  
  return tips[category] || tips['general'];
}

// ===== Quiz Generation =====
async function handleGenerateQuiz() {
  const loading = document.getElementById('quiz-loading');
  const container = document.getElementById('quiz-container');
  const resultDiv = document.getElementById('quiz-result');
  
  loading.classList.remove('hidden');
  container.classList.add('hidden');
  resultDiv.classList.add('hidden');
  
  const content = state.pageContent || await getPageContent();
  if (!content) {
    loading.classList.add('hidden');
    return;
  }
  
  const difficulty = document.getElementById('quiz-difficulty').value;
  const quiz = generateQuiz(content.text, content.title, difficulty, content.detectedLang);
  
  state.currentQuiz = quiz;
  state.quizIndex = 0;
  state.quizAnswers = new Array(quiz.length).fill(null);
  
  loading.classList.add('hidden');
  container.classList.remove('hidden');
  
  renderQuizQuestion();
}

function generateQuiz(text, title, difficulty, lang) {
  const sentences = extractSentences(text, lang);
  const scored = scoreSentences(sentences, title, lang);
  
  // Get the most important sentences for quiz generation
  const important = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
  
  const questions = [];
  
  important.forEach((item, idx) => {
    if (questions.length >= 5) return;
    
    const sentence = item.text;
    const question = createQuestion(sentence, lang, difficulty, idx);
    if (question) {
      questions.push(question);
    }
  });
  
  // If we couldn't generate enough questions, add fill-in-the-blank
  while (questions.length < 3 && important.length > questions.length) {
    const item = important[questions.length];
    const q = createFillBlankQuestion(item.text, lang);
    if (q) questions.push(q);
  }
  
  return questions.slice(0, 5);
}

function createQuestion(sentence, lang, difficulty, index) {
  // Extract key information from sentence
  const numbers = sentence.match(/\d+[\.,]?\d*/g);
  const properNouns = lang === 'en' 
    ? (sentence.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g) || [])
    : [];
  
  // Strategy 1: Number-based question
  if (numbers && numbers.length > 0) {
    const num = numbers[0];
    const questionText = lang === 'bn'
      ? `নিচের কোনটি সঠিক? "${sentence.substring(0, 100)}..."`
      : `According to the article, which is correct about: "${sentence.substring(0, 80)}..."?`;
    
    const correctAnswer = sentence.trim();
    if (correctAnswer.length > 150) return null;
    
    const wrongAnswers = generateWrongAnswers(correctAnswer, sentence, lang);
    
    if (wrongAnswers.length < 3) return null;
    
    const options = shuffleArray([correctAnswer, ...wrongAnswers.slice(0, 3)]);
    
    return {
      question: questionText,
      options,
      correct: options.indexOf(correctAnswer),
      explanation: lang === 'bn' 
        ? `সঠিক উত্তর: ${correctAnswer}`
        : `The correct answer is based on: ${correctAnswer}`
    };
  }
  
  // Strategy 2: True/False style
  if (sentence.length > 30 && sentence.length < 200) {
    const isTrue = index % 2 === 0;
    const displaySentence = isTrue ? sentence : modifySentence(sentence, lang);
    
    const questionText = lang === 'bn'
      ? `নিচের তথ্যটি কি সঠিক?\n"${displaySentence.substring(0, 150)}"`
      : `Is the following statement correct?\n"${displaySentence.substring(0, 150)}"`;
    
    const options = lang === 'bn'
      ? ['সঠিক (True)', 'ভুল (False)', 'আংশিক সঠিক', 'তথ্য অপর্যাপ্ত']
      : ['True', 'False', 'Partially True', 'Not enough information'];
    
    return {
      question: questionText,
      options,
      correct: isTrue ? 0 : 1,
      explanation: lang === 'bn'
        ? `মূল তথ্য: ${sentence.substring(0, 150)}`
        : `Original text: ${sentence.substring(0, 150)}`
    };
  }
  
  return null;
}

function createFillBlankQuestion(sentence, lang) {
  const words = sentence.split(/\s+/);
  if (words.length < 6) return null;
  
  // Pick a word to blank out (prefer longer, more meaningful words)
  const candidates = words.filter(w => w.length > 4 && !/^\d+$/.test(w));
  if (candidates.length === 0) return null;
  
  const blankWord = candidates[Math.floor(Math.random() * candidates.length)];
  const blankedSentence = sentence.replace(blankWord, '________');
  
  const questionText = lang === 'bn'
    ? `শূন্যস্থান পূরণ করুন:\n"${blankedSentence.substring(0, 150)}"`
    : `Fill in the blank:\n"${blankedSentence.substring(0, 150)}"`;
  
  const wrongWords = generateWrongWords(blankWord, lang);
  const options = shuffleArray([blankWord, ...wrongWords]);
  
  return {
    question: questionText,
    options,
    correct: options.indexOf(blankWord),
    explanation: lang === 'bn'
      ? `সঠিক শব্দ: ${blankWord}\nপূর্ণ বাক্য: ${sentence.substring(0, 150)}`
      : `Correct word: ${blankWord}\nFull sentence: ${sentence.substring(0, 150)}`
  };
}

function generateWrongAnswers(correct, context, lang) {
  const wrongs = [];
  const words = correct.split(/\s+/);
  
  // Modify numbers
  const modified1 = correct.replace(/\d+/, (match) => {
    const num = parseInt(match);
    return String(num + Math.floor(Math.random() * 10) + 1);
  });
  if (modified1 !== correct) wrongs.push(modified1);
  
  // Swap words
  if (words.length > 3) {
    const swapped = [...words];
    const i = Math.floor(Math.random() * (swapped.length - 1));
    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
    wrongs.push(swapped.join(' '));
  }
  
  // Add negation
  const negated = lang === 'bn'
    ? correct.replace(/হয়/, 'হয় না').replace(/আছে/, 'নেই')
    : correct.replace(/is /i, 'is not ').replace(/was /i, 'was not ');
  if (negated !== correct) wrongs.push(negated);
  
  // Truncate
  if (correct.length > 30) {
    wrongs.push(correct.substring(0, Math.floor(correct.length * 0.6)) + '...');
  }
  
  return wrongs.filter(w => w !== correct).slice(0, 3);
}

function generateWrongWords(correctWord, lang) {
  const wrongs = [];
  
  // Similar length words
  const commonWords = lang === 'bn'
    ? ['বাংলাদেশ', 'সরকার', 'প্রধান', 'জাতীয়', 'আন্তর্জাতিক', 'উন্নয়ন', 'শিক্ষা', 'অর্থনীতি']
    : ['government', 'national', 'international', 'development', 'education', 'economic', 'political', 'important'];
  
  const filtered = commonWords.filter(w => w !== correctWord);
  
  while (wrongs.length < 3 && filtered.length > 0) {
    const idx = Math.floor(Math.random() * filtered.length);
    wrongs.push(filtered.splice(idx, 1)[0]);
  }
  
  return wrongs;
}

function modifySentence(sentence, lang) {
  // Slightly modify the sentence to make it false
  return sentence
    .replace(/\d+/, (match) => String(parseInt(match) + Math.floor(Math.random() * 5) + 1))
    .replace(/(first|largest|highest)/i, 'second')
    .replace(/(প্রথম|সর্বোচ্চ)/i, 'দ্বিতীয়');
}

function renderQuizQuestion() {
  const quiz = state.currentQuiz;
  const idx = state.quizIndex;
  
  if (!quiz || idx >= quiz.length) return;
  
  const q = quiz[idx];
  
  // Update progress
  const progress = ((idx + 1) / quiz.length) * 100;
  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
  document.getElementById('quiz-progress-text').textContent = `Question ${idx + 1} of ${quiz.length}`;
  
  // Render question
  document.getElementById('quiz-question').textContent = q.question;
  
  // Render options
  const optionsContainer = document.getElementById('quiz-options');
  const labels = ['A', 'B', 'C', 'D'];
  
  optionsContainer.innerHTML = q.options.map((opt, i) => {
    let classes = 'quiz-option';
    if (state.quizAnswers[idx] !== null) {
      if (i === q.correct) classes += ' correct';
      else if (i === state.quizAnswers[idx] && i !== q.correct) classes += ' incorrect';
    } else if (i === state.quizAnswers[idx]) {
      classes += ' selected';
    }
    
    return `
      <div class="${classes}" data-option="${i}" onclick="selectQuizOption(${i})">
        <span class="quiz-option-label">${labels[i]}</span>
        <span>${opt}</span>
      </div>
    `;
  }).join('');
  
  // Show/hide explanation and update visual feedback
  const explanationDiv = document.getElementById('quiz-explanation');
  
  if (state.quizAnswers[idx] !== null) {
    const isCorrect = state.quizAnswers[idx] === q.correct;
    const selectedLabel = labels[state.quizAnswers[idx]];
    const correctLabel = labels[q.correct];
    
    let feedbackHTML = '';
    if (isCorrect) {
      feedbackHTML = `<div class="quiz-feedback correct">✅ <strong>Correct!</strong> You selected ${selectedLabel}</div>`;
    } else {
      feedbackHTML = `<div class="quiz-feedback incorrect">❌ <strong>Incorrect!</strong> You selected ${selectedLabel}, but correct answer is ${correctLabel}</div>`;
    }
    
    explanationDiv.innerHTML = `${feedbackHTML}<div class="quiz-explanation-text"><strong>Explanation:</strong> ${q.explanation}</div>`;
    explanationDiv.classList.remove('hidden');
  } else {
    explanationDiv.classList.add('hidden');
  }
  
  // Update navigation
  document.getElementById('btn-prev-question').disabled = idx === 0;
  document.getElementById('btn-next-question').textContent = idx === quiz.length - 1 ? 'Finish' : 'Next →';
}

// Make selectQuizOption globally accessible
window.selectQuizOption = function(optionIdx) {
  // Allow changing answer until they move to next question
  state.quizAnswers[state.quizIndex] = optionIdx;
  renderQuizQuestion();
};

function navigateQuiz(direction) {
  const newIdx = state.quizIndex + direction;
  
  if (newIdx < 0) return;
  
  if (newIdx >= state.currentQuiz.length) {
    // Show results
    showQuizResults();
    return;
  }
  
  state.quizIndex = newIdx;
  renderQuizQuestion();
}

function showQuizResults() {
  const quiz = state.currentQuiz;
  let correct = 0;
  
  state.quizAnswers.forEach((answer, idx) => {
    if (answer === quiz[idx].correct) correct++;
  });
  
  const percentage = Math.round((correct / quiz.length) * 100);
  
  document.getElementById('quiz-container').classList.add('hidden');
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.classList.remove('hidden');
  
  document.getElementById('quiz-score').textContent = `${correct}/${quiz.length} (${percentage}%)`;
  
  // Review
  const reviewHtml = quiz.map((q, idx) => {
    const isCorrect = state.quizAnswers[idx] === q.correct;
    return `
      <div class="review-item ${isCorrect ? 'review-correct' : 'review-incorrect'}">
        <span>${isCorrect ? '✅' : '❌'}</span>
        <span>Q${idx + 1}: ${q.question.substring(0, 60)}...</span>
      </div>
    `;
  }).join('');
  
  document.getElementById('quiz-review').innerHTML = reviewHtml;
}

// ===== Save & Export =====
function handleSave(type) {
  let content = '';
  let title = '';
  
  if (type === 'summary') {
    content = document.getElementById('summary-text').innerText;
    title = state.pageContent?.title || 'Summary';
  } else if (type === 'keypoints') {
    content = document.getElementById('keypoints-list').innerText;
    title = state.pageContent?.title || 'Key Points';
  }
  
  if (!content) {
    showToast('❌ Nothing to save');
    return;
  }
  
  const item = {
    id: Date.now(),
    type,
    title: title.substring(0, 100),
    content,
    url: state.pageContent?.url || '',
    domain: state.pageContent?.domain || '',
    date: new Date().toISOString(),
    lang: state.pageContent?.detectedLang || 'en'
  };
  
  state.savedItems.unshift(item);
  saveSavedItems();
  showToast('✅ Saved successfully!');
}

function renderSavedItems(filter = 'all') {
  const container = document.getElementById('saved-list');
  
  const items = filter === 'all' 
    ? state.savedItems 
    : state.savedItems.filter(i => i.type === filter);
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📂</span>
        <p>No saved items yet</p>
        <p class="empty-hint">Summarize pages and save them for later review</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="saved-item" data-id="${item.id}">
      <div class="saved-item-header">
        <span class="saved-item-title">${escapeHtml(item.title)}</span>
        <span class="saved-item-type">${item.type}</span>
      </div>
      <div class="saved-item-preview ${item.lang === 'bn' ? 'bangla-text' : ''}">${escapeHtml(item.content.substring(0, 100))}...</div>
      <div class="saved-item-footer">
        <span class="saved-item-date">${formatDate(item.date)}</span>
        <div class="saved-item-actions">
          <button class="icon-btn" onclick="copySavedItem(${item.id})" title="Copy">📋</button>
          <button class="icon-btn" onclick="deleteSavedItem(${item.id})" title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.copySavedItem = function(id) {
  const item = state.savedItems.find(i => i.id === id);
  if (item) {
    copyToClipboard(item.content);
  }
};

window.deleteSavedItem = function(id) {
  state.savedItems = state.savedItems.filter(i => i.id !== id);
  saveSavedItems();
  renderSavedItems();
  showToast('🗑️ Item deleted');
};

function handleExport() {
  if (state.savedItems.length === 0) {
    showToast('❌ No items to export');
    return;
  }
  
  let exportText = '=== GK Summary - Exported Notes ===\n';
  exportText += `Exported on: ${new Date().toLocaleDateString()}\n`;
  exportText += `Total items: ${state.savedItems.length}\n`;
  exportText += '='.repeat(40) + '\n\n';
  
  state.savedItems.forEach((item, idx) => {
    exportText += `--- ${idx + 1}. ${item.title} ---\n`;
    exportText += `Type: ${item.type}\n`;
    exportText += `Source: ${item.domain}\n`;
    exportText += `Date: ${formatDate(item.date)}\n\n`;
    exportText += item.content + '\n\n';
    exportText += '-'.repeat(40) + '\n\n';
  });
  
  // Create and download file
  const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gk-summary-notes-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('📤 Notes exported!');
}

function handleClearSaved() {
  if (state.savedItems.length === 0) return;
  
  if (confirm('Are you sure you want to delete all saved items?')) {
    state.savedItems = [];
    saveSavedItems();
    renderSavedItems();
    showToast('🗑️ All items cleared');
  }
}

// ===== Utility Functions =====
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied to clipboard!');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('📋 Copied to clipboard!');
  });
}

// Make copyToClipboard globally accessible
window.copyToClipboard = copyToClipboard;

function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  msgEl.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}

function formatText(text, lang) {
  const className = lang === 'bn' ? ' class="bangla-text"' : '';
  return `<p${className}>${escapeHtml(text)}</p>`;
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeForAttr(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
