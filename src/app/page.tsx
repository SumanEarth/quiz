export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-5xl">📚</div>
          <h1 className="text-3xl font-bold tracking-tight">
            GK Summary – Exam Prep Key Points
          </h1>
          <p className="text-neutral-400 text-lg">
            Summarize any webpage, extract key points, and generate quizzes —
            all offline, right in your browser.
          </p>
        </div>

        {/* Download Button */}
        <a
          href="/gk-summary-extension.zip"
          download
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download Extension (.zip)
        </a>

        {/* Installation Instructions */}
        <div className="bg-neutral-800 rounded-xl p-6 text-left space-y-4">
          <h2 className="text-lg font-semibold text-neutral-200">
            How to Install
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-300 text-sm leading-relaxed">
            <li>
              Download the ZIP file using the button above.
            </li>
            <li>
              Unzip the downloaded file to a folder on your computer.
            </li>
            <li>
              Open Chrome and go to{" "}
              <code className="bg-neutral-700 px-1.5 py-0.5 rounded text-emerald-400 text-xs">
                chrome://extensions
              </code>
            </li>
            <li>
              Enable <strong>Developer mode</strong> (toggle in the top-right corner).
            </li>
            <li>
              Click <strong>Load unpacked</strong> and select the unzipped folder.
            </li>
            <li>
              The extension icon will appear in your toolbar — you&apos;re all set!
            </li>
          </ol>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-neutral-800/60 rounded-lg p-3">
            <div className="text-lg mb-1">📝</div>
            <div className="text-neutral-300">Extractive Summaries</div>
          </div>
          <div className="bg-neutral-800/60 rounded-lg p-3">
            <div className="text-lg mb-1">🎯</div>
            <div className="text-neutral-300">Key Points</div>
          </div>
          <div className="bg-neutral-800/60 rounded-lg p-3">
            <div className="text-lg mb-1">❓</div>
            <div className="text-neutral-300">Quiz Generation</div>
          </div>
          <div className="bg-neutral-800/60 rounded-lg p-3">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-neutral-300">100% Offline</div>
          </div>
        </div>

        <p className="text-neutral-500 text-xs">
          Supports Bangla &amp; English · BCS, Bank Job, Admission &amp; NTRCA presets
        </p>
      </div>
    </main>
  );
}
