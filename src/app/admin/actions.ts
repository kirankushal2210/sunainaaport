'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id }
    });
    revalidatePath('/admin');
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
}
