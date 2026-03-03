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

        {/* Support */}
        <div className="pt-2">
          <p className="text-neutral-500 text-sm mb-3">
            Enjoying the extension? Support its development!
          </p>
          <a
            href="https://buymeacoffee.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 transition-colors text-neutral-900 font-semibold px-6 py-2.5 rounded-lg"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M2.004 21.547c-.199 0-.398-.06-.567-.178a.816.816 0 01-.257-.432l-.38-2.53c-.235-1.453.03-2.688.747-3.473a5.49 5.49 0 012.62-1.49c.65-.18 1.41-.18 2.28 0 .87.18 1.803.52 2.8 1.02l2.14 1.07c.38.19.79.19 1.17 0l2.14-1.07c.997-.5 1.93-.84 2.8-1.02.87-.18 1.63-.18 2.28 0a5.49 5.49 0 012.62 1.49c.716.785.98 2.02.746 3.473l-.38 2.53a.816.816 0 01-.257.432.719.719 0 01-.567.178h-1.155a.73.73 0 01-.528-.22l-.424-.424a.73.73 0 00-.528-.22h-1.192a.73.73 0 00-.528.22l-.53.53a.73.73 0 01-.528.22H8.458a.73.73 0 01-.528-.22l-.53-.53a.73.73 0 00-.528-.22H5.67a.73.73 0 00-.528.22l-.424.424a.73.73 0 01-.528.22H2.004zm10.348-2.194c-.652 0-1.18-.453-1.18-1.012 0-.56.528-1.013 1.18-1.013.652 0 1.18.453 1.18 1.013 0 .559-.528 1.012-1.18 1.012zm4.708 0c-.652 0-1.18-.453-1.18-1.012 0-.56.528-1.013 1.18-1.013.652 0 1.18.453 1.18 1.013 0 .559-.528 1.012-1.18 1.012z"/>
            </svg>
            Buy Me a Coffee
          </a>
        </div>

        <p className="text-neutral-500 text-xs">
          Supports Bangla &amp; English · BCS, Bank Job, Admission &amp; NTRCA presets
        </p>
      </div>
    </main>
  );
}
