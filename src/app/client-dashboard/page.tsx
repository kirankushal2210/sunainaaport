import { auth, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ViewDraftButton, DownloadReceiptButton } from "./ClientButtons";

export default async function ClientDashboard() {
  const session = await auth();

  if (!session) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-mono">
        <h1 className="text-2xl mb-8">Client Portal Access</h1>
        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
        >
          <button type="submit" className="px-6 py-3 bg-white text-black rounded uppercase text-xs tracking-widest font-bold hover:bg-white/90">
            Sign in securely
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-mono p-8 md:p-16">
      <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-display text-white">Client Portal</h1>
          <p className="text-white/50 text-sm mt-2">Welcome back, {session?.user?.name || session?.user?.email}</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white/50 hover:text-white uppercase text-xs tracking-widest">
            Back to Portfolio
          </Link>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-red-500/20 text-white rounded uppercase text-xs tracking-widest transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mock Private Assets */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
            <span className="text-[#c8956c] mb-4 block">ACTIVE PROJECT</span>
            <h2 className="text-2xl font-display mb-4">Brand Identity Guidelines</h2>
            <p className="text-sm font-body text-white/70 mb-6 leading-relaxed">
              Status: <span className="text-white">In Review</span><br/>
              Latest Update: Today, 2:00 PM
            </p>
            <ViewDraftButton />
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
            <span className="text-white/50 mb-4 block">INVOICE</span>
            <h2 className="text-2xl font-display mb-4">Phase 1 Deposit</h2>
            <p className="text-sm font-body text-white/70 mb-6 leading-relaxed">
              Status: <span className="text-green-400">Paid</span><br/>
              Amount: $2,500
            </p>
            <DownloadReceiptButton />
          </div>
        </div>
      </main>
    </div>
  );
}
