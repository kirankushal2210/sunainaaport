import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProject } from "./actions";

export const revalidate = 0; // Ensure admin page is always fresh

export default async function AdminDashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-display">Manage Projects</h1>
        <Link href="/admin/new" className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors inline-block text-center">
          + New Project
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-normal">Project Title</th>
              <th className="px-6 py-4 font-normal">Category</th>
              <th className="px-6 py-4 font-normal">Client</th>
              <th className="px-6 py-4 font-normal">Year</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-white/10 overflow-hidden flex-shrink-0">
                    {project.posterAsset && (
                      <img src={project.posterAsset} alt={project.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="font-bold text-white">{project.title}</span>
                </td>
                <td className="px-6 py-4 text-white/70">{project.category}</td>
                <td className="px-6 py-4 text-white/70">{project.client}</td>
                <td className="px-6 py-4 text-white/70">{project.year}</td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <Link href={`/admin/edit/${project.id}`} className="text-white/50 hover:text-white px-2 transition-colors">Edit</Link>
                  <form action={deleteProject.bind(null, project.id)}>
                    <button type="submit" className="text-white/50 hover:text-red-400 px-2 transition-colors">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
