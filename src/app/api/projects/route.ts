import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Check for authenticated session
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse JSON body
    const body = await req.json();
    
    // Note: The fields requested (techStack, githubUrl, liveUrl) do not exist in the 
    // current Prisma schema. Adapting this to match the actual Project model fields.
    const { title, category, client, year, posterAsset, aspectRatio, metrics, content } = body;

    // 3. Validate required fields
    if (!title || !category || !client || !year || !posterAsset || !aspectRatio || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 4. Store project in DB
    const newProject = await prisma.project.create({
      data: {
        title,
        category,
        client,
        year,
        posterAsset,
        aspectRatio,
        metrics: metrics || [], // Optional array
        content,
      },
    });

    // 5. Return success response
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Project creation failed:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
