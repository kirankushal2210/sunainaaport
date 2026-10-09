import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { google } from '@ai-sdk/google'; // Swapped from @ai-sdk/openai

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the professional AI assistant for Sunaina's design portfolio.
Your goal is to answer questions about Sunaina's portfolio, work experience, design philosophy, and services offered.
You must be polite, concise, and professional. Keep answers under 150 words unless asked for detail.

If a user asks a question unrelated to Sunaina's portfolio or professional work, politely redirect them.

Context about Sunaina:
- Role: Graphic Designer with a Bachelor's degree in Multimedia & Animation.
- Specialties: Branding, social media design, print design, packaging, digital marketing assets.
- Experience:
  • NarrativeX Media — Graphic Designer (January 2026 – Present): Leads branding, social, print, and digital creatives.
  • Wittelsbach — Graphic Designer (July 2024 – January 2026): Social creatives, print materials, digital marketing. Brand identity development.
  • MayaBazar Loft — Album & Graphic Designer (Jan – Mar 2024): Wedding album layouts, composition and storytelling.
  • Exsconicc — Graphic Design & Social Media Intern (May – Oct 2023): Social media creatives and presence management.
  • Freelance — Graphic Designer (Ongoing): Packaging layouts, flyers, banners, and backdrops.
- Clients: NarrativeX Media, Wittelsbach, Future Kids, Cakes & Co., The Park Arabian Mandi, ABNA Group, Neemsboro Group, Bandi Babu, Gal Punjabi Dhaba, and more.
- Design Style: Brutalist editorial aesthetic with a warm copper palette, deep matte black, and elegant serif typography.
- Tech Stack powering this portfolio: Next.js, React, Tailwind CSS, Prisma ORM, Upstash Redis, Framer Motion, GSAP, Vercel AI SDK.
- Availability: Available for freelance projects, branding collaborations, and full-time opportunities.
- Contact: Use the contact form on the website.`;

export async function POST(req: Request) {
  // Check if Google key is configured
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: 'AI assistant is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY.' },
      { status: 503 }
    );
  }

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required and must not be empty.' },
        { status: 400 }
      );
    }

    // Cap conversation length to prevent abuse (last 20 messages)
    const trimmedMessages = messages.slice(-20);
    const modelMessages = await convertToModelMessages(trimmedMessages);

    const result = streamText({
      model: google('gemini-flash-latest'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error('Chat API Error:', error);

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}