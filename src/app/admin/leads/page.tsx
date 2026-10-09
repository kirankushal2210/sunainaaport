import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/navigation"; // Not used but imported if needed

export default async function LeadsAdminPage() {
  const session = await auth();

  // Basic route protection - ensure user is authenticated
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Ensure this route is dynamic
  const leads = await prisma.lead.findMany();

  return (
    <div className="min-h-screen bg-[#f2ede4] text-[#1a1a1a] p-8 md:p-16" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-[#1a1a1a]/20 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Client Leads
            </h1>
            <p className="text-[#1a1a1a]/60 text-sm mt-2 font-mono uppercase tracking-[0.2em]">
              Project Inquiries & Contact Forms
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tracking-wider text-[#1a1a1a]/40 uppercase">Total Captured</p>
            <p className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{leads.length}</p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white/40 border border-[#1a1a1a]/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 bg-[#1a1a1a]/5">
                  <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/60 font-semibold whitespace-nowrap">Date</th>
                  <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/60 font-semibold">Client</th>
                  <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/60 font-semibold">Service</th>
                  <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/60 font-semibold w-2/5">Requirements</th>
                  <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/60 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/10">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#1a1a1a]/40 font-mono text-sm uppercase tracking-wider">
                      No leads captured yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/60 transition-colors group">
                      {/* Date */}
                      <td className="py-5 px-6 whitespace-nowrap align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{new Date(lead.created_at).toLocaleDateString()}</span>
                          <span className="text-xs text-[#1a1a1a]/40 mt-0.5">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      
                      {/* Client Info */}
                      <td className="py-5 px-6 align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold tracking-tight">{lead.name}</span>
                          <span className="text-xs text-[#c8956c] font-mono mt-0.5 break-all">{lead.email}</span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-5 px-6 align-top">
                        <span className="inline-block px-2.5 py-1 bg-[#1a1a1a]/5 text-[#1a1a1a] text-[10px] font-mono uppercase tracking-wider">
                          {lead.service}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-5 px-6 align-top">
                        <p className="text-sm text-[#1a1a1a]/80 leading-relaxed whitespace-pre-wrap line-clamp-4 group-hover:line-clamp-none transition-all">
                          {lead.details}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-5 px-6 align-top text-right whitespace-nowrap">
                        <a 
                          href={`mailto:${lead.email}?subject=Re: Your ${lead.service} Project Inquiry`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#f2ede4] hover:bg-[#c8956c] transition-colors font-mono text-[10px] uppercase tracking-[0.2em] shadow-sm"
                        >
                          Reply &rarr;
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
