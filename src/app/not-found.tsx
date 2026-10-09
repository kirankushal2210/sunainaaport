import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-mono">
      <h2 className="text-9xl font-display mb-4 text-[#c8956c]">404</h2>
      <p className="text-2xl mb-8">Page Not Found</p>
      <p className="text-white/50 mb-12 max-w-md text-center">
        The project or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-white text-black text-xs uppercase tracking-widest font-bold rounded-lg hover:scale-105 transition-transform"
      >
        Return to Portfolio
      </Link>
    </div>
  );
}
