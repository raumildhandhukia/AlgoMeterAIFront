"use client";

import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged cookies
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    // Save consent to localStorage
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-white mb-4 md:mb-0">
          <p className="text-sm md:text-base">
            This website uses cookies to enhance your experience.
            By clicking "Acknowledge", you consent to our use of cookies.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
