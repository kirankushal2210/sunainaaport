'use client';

export function ViewDraftButton() {
  return (
    <button 
      onClick={() => alert('Opening draft viewer... (Mock functionality)')} 
      className="w-full py-3 bg-white text-black rounded-lg uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition-colors"
    >
      View Draft
    </button>
  );
}

export function DownloadReceiptButton() {
  return (
    <button 
      onClick={() => alert('Downloading receipt... (Mock functionality)')} 
      className="w-full py-3 border border-white/20 text-white rounded-lg uppercase text-xs tracking-widest font-bold hover:bg-white/10 transition-colors"
    >
      Download Receipt
    </button>
  );
}
