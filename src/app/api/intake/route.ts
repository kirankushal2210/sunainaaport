import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, service, details } = body;

    // Validate required fields
    if (!name || !email || !service || !details) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Save lead to database
    let lead;
    try {
      lead = await prisma.lead.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          service,
          details: details.trim(),
        },
      });
    } catch (dbError: any) {
      console.error('Database Error:', dbError);
      return NextResponse.json(
        { error: 'Database error: ' + (dbError.message || 'Unknown error') },
        { status: 500 }
      );
    }

    // Send email notification via Resend
    try {
      if (process.env.RESEND_API_KEY && process.env.EMAIL_USER) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Portfolio Intake <onboarding@resend.dev>', // Update this when you have a verified domain on Resend
          to: process.env.EMAIL_USER, // Your personal email to receive leads
          replyTo: email.trim().toLowerCase(),
          subject: `New Project Inquiry: ${service} from ${name}`,
          text: `New Project Inquiry\n\nName: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${details}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">New Project Inquiry</h2>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 0;"><strong>Service:</strong> <span style="background: #e8c9a0; padding: 3px 8px; border-radius: 4px; font-size: 14px;">${service}</span></p>
              </div>
              <h3 style="color: #1a1a1a;">Project Details:</h3>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.5;">${details}</div>
            </div>
          `,
        });
      } else {
        console.warn('Email notification skipped: RESEND_API_KEY or EMAIL_USER not configured in .env');
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We don't fail the request if the email fails, since the lead was already saved in DB
    }

    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Intake API Error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

