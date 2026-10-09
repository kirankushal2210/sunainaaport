import { auth, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // For this portfolio, we only allow a specific admin email or a 'admin' role.
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL || (session?.user as any)?.role === "admin";

  if (!session) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-mono">
        <h1 className="text-2xl mb-8">Admin Access Required</h1>
        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
        >
          <button type="submit" className="px-6 py-3 bg-white text-black rounded uppercase text-xs tracking-widest font-bold">
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-mono gap-4">
        <h1 className="text-2xl text-red-500">Unauthorized</h1>
        <p className="text-sm text-white/50">You do not have permission to view this page.</p>
        <Link href="/" className="px-6 py-3 border border-white/20 hover:bg-white/10 rounded uppercase text-xs tracking-widest mt-4">
          Return Home
        </Link>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button type="submit" className="text-xs text-white/30 hover:text-white mt-4 underline">
            Sign Out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col font-mono text-xs uppercase tracking-widest gap-8">
        <div className="font-display text-2xl normal-case tracking-normal mb-8">Admin Panel</div>
        
        <nav className="flex flex-col gap-4 flex-1">
          <Link href="/admin" className="text-white hover:text-[#c8956c] transition-colors">Projects</Link>
          <Link href="/client-dashboard" className="text-white/50 hover:text-white transition-colors">Client Portal</Link>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <div className="text-white/30 break-all">{session?.user?.email}</div>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit" className="text-white/50 hover:text-red-400 transition-colors flex items-center gap-2">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
