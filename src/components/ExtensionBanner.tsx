import Link from 'next/link';

const ExtensionBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#2563EB] py-3 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
              NEW
            </span>
            <span className="text-lg">
              AlgoMeter AI: Chrome Extension available. Currently supporting LeetCode.
            </span>
          </div>
          <Link 
            href="https://chromewebstore.google.com/detail/algometer-ai-big-o-insigh/gakkdbdlgmgalfaemjhjeejlmpddhkjk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium text-sm"
          >
            Click here to download
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExtensionBanner; 