'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-mono">
      <h2 className="text-4xl font-display mb-4">Something went wrong!</h2>
      <p className="text-white/50 mb-8 max-w-md text-center">
        We encountered an unexpected error. Please try again or return to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-bold rounded"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-white/20 text-white text-xs uppercase tracking-widest rounded hover:bg-white/10 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
