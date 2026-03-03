# 📝 GK Summary - Exam Prep Key Points

A Chrome Extension that summarizes and extracts key points from any website, especially **Bangla and English newspapers**, for competitive exam preparation (BCS, Bank Job, Admission, NTRCA).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## ✨ Features

### 📰 Smart Summarization
- **One-click page summary** - Summarize any webpage instantly
- **Adjustable length** - Short, Medium, or Detailed summaries
- **Selected text summary** - Select any text and get a quick summary
- **Auto-detects Bangla/English** content

### 🎯 Key Points Extraction
- **Exam-focused key points** - Extracts the most important facts
- **Category filtering** - General Knowledge, Current Affairs, History, Geography, Science, Economy, Politics, Sports, International
- **Important facts & figures** - Automatically highlights numbers, dates, and statistics
- **Exam tips** - Category-specific study tips

### 📚 Quiz Generation
- **Auto-generated quizzes** from page content
- **Multiple difficulty levels** - Easy, Medium, Hard
- **Instant feedback** with explanations
- **Score tracking** and review

### 💾 Save & Export
- **Save summaries and key points** for later review
- **Filter saved items** by type
- **Export all notes** as a text file
- **Copy to clipboard** with one click

### 🌐 Bangla & English Support
- **Full Bangla language support** (বাংলা)
- **Auto-detects newspaper language**
- **Supports 20+ Bangla newspapers** including Prothom Alo, Kaler Kantho, Jugantor, etc.
- **Supports English newspapers** including The Daily Star, Dhaka Tribune, etc.

### 🔧 Additional Features
- **Right-click context menu** - Summarize selected text from any page
- **Keyboard shortcut** - `Ctrl+Shift+S` to summarize selection
- **Floating action button** - Appears when you select text
- **Dark mode** support
- **Exam type presets** - BCS, Bank Job, Admission, NTRCA, General

---

## 📋 Supported Newspapers

### Bangla Newspapers (বাংলা পত্রিকা)
| Newspaper | Domain |
|-----------|--------|
| প্রথম আলো | prothomalo.com |
| কালের কণ্ঠ | kalerkantho.com |
| যুগান্তর | jugantor.com |
| ইত্তেফাক | ittefaq.com.bd |
| সমকাল | samakal.com |
| বাংলানিউজ২৪ | banglanews24.com |
| নয়া দিগন্ত | dailynayadiganta.com |
| মানবজমিন | manabzamin.com |
| বাংলাদেশ প্রতিদিন | bd-pratidin.com |
| বাংলা ট্রিবিউন | banglatribune.com |

### English Newspapers
| Newspaper | Domain |
|-----------|--------|
| The Daily Star | thedailystar.net |
| Dhaka Tribune | dhakatribune.com |
| New Age | newagebd.net |
| The Business Standard | tbsnews.net |
| The Financial Express | thefinancialexpress.com.bd |

---

## 🚀 Installation (Developer Mode)

### Step 1: Download
```bash
git clone <repository-url>
# or download and extract the ZIP file
```

### Step 2: Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder
5. The extension icon will appear in your toolbar! 🎉

### Step 3: Pin the Extension
1. Click the puzzle piece icon (🧩) in Chrome toolbar
2. Find "GK Summary" and click the pin icon (📌)

---

## 📦 Publishing to Chrome Web Store

### Prerequisites
1. A [Google Developer Account](https://chrome.google.com/webstore/devconsole/) ($5 one-time fee)
2. The extension files packaged as a ZIP

### Step 1: Prepare for Publishing

#### Create Store Assets
You'll need:
- **Icon**: 128x128 PNG (already included)
- **Screenshots**: At least 1 screenshot (1280x800 or 640x400)
- **Promotional images** (optional):
  - Small: 440x280
  - Large: 920x680
  - Marquee: 1400x560

#### Create ZIP Package
```bash
cd chrome-extension
# Remove development files
rm -f icons/generate-icons.html
# Create ZIP (exclude README and dev files)
zip -r gk-summary-extension.zip . -x "*.md" "*.html" -x "icons/generate-icons.html"
```

Or manually:
1. Select all files inside `chrome-extension/` folder
2. Right-click → "Compress" / "Send to ZIP"
3. Make sure `manifest.json` is at the root of the ZIP

### Step 2: Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click **"New Item"**
3. Upload your ZIP file
4. Fill in the listing details:

#### Store Listing Details

**Name:** GK Summary - Exam Prep Key Points

**Summary (132 chars max):**
```
Summarize & extract key points from newspapers for BCS, Bank Job & Admission exam prep. Supports Bangla & English.
```

**Description:**
```
📝 GK Summary - Your Ultimate Exam Preparation Companion

Instantly summarize any webpage and extract key points for competitive exam preparation. Perfect for BCS, Bank Job, University Admission, and NTRCA exam candidates.

🌟 KEY FEATURES:

✅ Smart Summarization
• One-click page summary with adjustable length
• Selected text summarization
• Auto-detects Bangla and English content

✅ Key Points Extraction
• Exam-focused key points with category filtering
• Highlights important facts, figures, and dates
• Category-specific exam tips

✅ Quiz Generation
• Auto-generated quizzes from page content
• Multiple difficulty levels
• Instant feedback with explanations

✅ Save & Export
• Save summaries for later review
• Export notes as text file
• One-click copy to clipboard

✅ Bangla & English Support
• Full বাংলা language support
• Supports 20+ Bangla newspapers
• Supports major English newspapers

✅ Exam Presets
• BCS Exam preparation
• Bank Job preparation
• University Admission preparation
• NTRCA preparation
• General competitive exam preparation

📰 SUPPORTED NEWSPAPERS:
Prothom Alo, Kaler Kantho, Jugantor, Ittefaq, Samakal, The Daily Star, Dhaka Tribune, and many more!

🔧 ADDITIONAL FEATURES:
• Right-click context menu for quick summarization
• Keyboard shortcut (Ctrl+Shift+S)
• Floating action button on text selection
• Dark mode support
• No data sent to external servers - 100% privacy

Perfect for students and professionals preparing for competitive exams in Bangladesh and beyond!
```

**Category:** Productivity

**Language:** English, Bengali

### Step 3: Privacy Practices

When filling out the privacy section:
- **Single Purpose:** Summarize web content and extract key points for exam preparation
- **Permissions Justification:**
  - `activeTab`: To read the current page content for summarization
  - `storage`: To save user preferences and bookmarked summaries
  - `scripting`: To extract text content from web pages
  - `contextMenus`: To provide right-click summarization options
- **Data Usage:** No data is collected or transmitted. All processing happens locally.
- **Remote Code:** No remote code is used.

### Step 4: Submit for Review

1. Click **"Submit for Review"**
2. Review typically takes 1-3 business days
3. You'll receive an email when approved

---

## 🛠️ Development

### Project Structure
```
chrome-extension/
├── manifest.json              # Extension manifest (v3)
├── background/
│   └── service-worker.js      # Background service worker
├── content/
│   ├── content-script.js      # Content script (runs on pages)
│   └── content-style.css      # Content script styles
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Popup styles
│   └── popup.js               # Popup logic
├── icons/
│   ├── icon16.png             # 16x16 icon
│   ├── icon32.png             # 32x32 icon
│   ├── icon48.png             # 48x48 icon
│   └── icon128.png            # 128x128 icon
└── README.md                  # This file
```

### How It Works

1. **Content Script** runs on every page, enabling text selection features and the floating action button
2. **Popup** provides the main UI with tabs for Summary, Key Points, Quiz, and Saved items
3. **Background Service Worker** handles context menus and cross-component communication
4. **Summarization Engine** uses extractive summarization with sentence scoring based on:
   - Position in text (first sentences weighted higher)
   - Title relevance
   - Word frequency
   - Important keyword matching (GK-specific)
   - Number/date presence
   - Proper noun density

### Key Technologies
- **Manifest V3** - Latest Chrome extension standard
- **Extractive Summarization** - No external API needed
- **Chrome Storage API** - For saving preferences and bookmarks
- **Chrome Scripting API** - For content extraction

---

## 🔒 Privacy

- **No data collection** - All processing happens locally in your browser
- **No external APIs** - No data is sent to any server
- **No tracking** - No analytics or telemetry
- **Local storage only** - Saved items are stored in Chrome's local storage

---

## 📄 License

MIT License - Feel free to modify and distribute.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Email: support@gksummary.com

---

Made with ❤️ for exam preparation 🎓
