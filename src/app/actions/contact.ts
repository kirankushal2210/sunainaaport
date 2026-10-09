"use server";

import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Please enter a valid email address"),
  serviceRequested: z.string().trim().min(1, "Please select or provide a service"),
  budget: z.string().trim().min(1, "Please select or provide a budget"),
  message: z.string().trim().min(10, "Project details must be at least 10 characters long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(rawInput: FormData | ContactFormData) {
  try {
    let data: Record<string, unknown>;

    if (rawInput instanceof FormData) {
      data = {
        name: rawInput.get("name"),
        email: rawInput.get("email"),
        serviceRequested: rawInput.get("serviceRequested"),
        budget: rawInput.get("budget"),
        message: rawInput.get("message"),
      };
    } else {
      data = rawInput;
    }

    const parsedData = contactSchema.parse(data);

    // 1. Persist to Database (Prisma)
    try {
      await prisma.contactMessage.create({
        data: {
          name: parsedData.name,
          email: parsedData.email,
          serviceRequested: parsedData.serviceRequested,
          budget: parsedData.budget,
          message: parsedData.message,
        },
      });

      // Also persist to Lead model for admin dashboard visibility
      await prisma.lead.create({
        data: {
          name: parsedData.name,
          email: parsedData.email,
          service: parsedData.serviceRequested,
          details: `[Budget: ${parsedData.budget}]\n\n${parsedData.message}`,
        },
      });
    } catch (dbError) {
      console.error("Database persistence note (continuing to email):", dbError);
    }

    // 2. Dispatch Emails
    const adminRecipient =
      process.env.ADMIN_EMAIL ||
      process.env.CONTACT_RECEIVER_EMAIL ||
      "hello@example.com";
    const fromSender =
      process.env.RESEND_FROM_EMAIL ||
      "Portfolio Inquiries <onboarding@resend.dev>";

    // Method A: Resend API
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send Admin Notification
      const adminResult = await resend.emails.send({
        from: fromSender,
        to: adminRecipient,
        replyTo: parsedData.email,
        subject: `New Lead: ${parsedData.serviceRequested} Inquiry from ${parsedData.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; padding: 32px 16px; color: #1a1a1a;">
            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5dfd5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="background-color: #1a1a1a; padding: 24px; text-align: center;">
                <span style="font-family: monospace; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #c8956c;">Portfolio Inquiry</span>
                <h1 style="color: #f2ede4; margin: 8px 0 0; font-size: 22px; font-weight: normal;">New Project Lead</h1>
              </div>
              <div style="padding: 32px 28px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 13px; font-family: monospace; text-transform: uppercase; color: #8a8a8a; width: 140px;">Client Name</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 15px; font-weight: 600; color: #1a1a1a;">${parsedData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 13px; font-family: monospace; text-transform: uppercase; color: #8a8a8a;">Email Address</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 15px; color: #1a1a1a;"><a href="mailto:${parsedData.email}" style="color: #c8956c; text-decoration: none;">${parsedData.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 13px; font-family: monospace; text-transform: uppercase; color: #8a8a8a;">Service</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 15px; color: #1a1a1a;"><span style="display: inline-block; padding: 2px 8px; background: #f2ede4; border-radius: 4px; font-size: 13px; font-weight: 500;">${parsedData.serviceRequested}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 13px; font-family: monospace; text-transform: uppercase; color: #8a8a8a;">Budget Tier</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 15px; font-weight: 600; color: #1a1a1a;">${parsedData.budget}</td>
                  </tr>
                </table>
                <div>
                  <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #8a8a8a; margin-bottom: 8px;">Project Details</div>
                  <div style="background-color: #faf8f5; border-left: 3px solid #c8956c; padding: 16px; font-size: 14px; line-height: 1.65; color: #333333; border-radius: 0 4px 4px 0; white-space: pre-wrap;">${parsedData.message}</div>
                </div>
                <div style="margin-top: 28px; text-align: center;">
                  <a href="mailto:${parsedData.email}?subject=Re: Your ${parsedData.serviceRequested} Project Inquiry" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 12px 24px; font-family: monospace; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; border-radius: 4px;">Reply to Client &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        `,
      });

      if (adminResult.error) {
        console.error("Resend admin notification error:", adminResult.error);
        return {
          success: false,
          error: `Email delivery error: ${adminResult.error.message}`,
        };
      }

      // Send Client Confirmation
      try {
        const autoReplyResult = await resend.emails.send({
          from: fromSender,
          to: parsedData.email,
          subject: `Thanks for getting in touch, ${parsedData.name}!`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; padding: 32px 16px; color: #1a1a1a;">
              <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5dfd5; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #1a1a1a; padding: 24px; text-align: center;">
                  <h1 style="color: #f2ede4; margin: 0; font-size: 20px; font-weight: normal;">Inquiry Received</h1>
                </div>
                <div style="padding: 28px 24px; line-height: 1.7; font-size: 14px; color: #333333;">
                  <p>Hi <strong>${parsedData.name}</strong>,</p>
                  <p>Thank you for reaching out regarding your <strong>${parsedData.serviceRequested}</strong> project.</p>
                  <p>I have received your project details and will review them carefully. You can expect a reply within <strong>24 to 48 hours</strong> with next steps.</p>
                  <hr style="border: none; border-top: 1px solid #f0eae1; margin: 24px 0;" />
                  <p style="margin: 0; color: #666;">Warm regards,</p>
                  <p style="margin: 4px 0 0; font-weight: 600; color: #c8956c;">Sunaina</p>
                  <p style="margin: 0; font-size: 12px; color: #999;">Graphic Designer & Brand Strategist</p>
                </div>
              </div>
            </div>
          `,
        });

        if (autoReplyResult.error) {
          console.warn("Auto-reply delivery notice (Resend free tier only sends to registered account email):", autoReplyResult.error.message);
        }
      } catch (autoReplyError) {
        console.warn("Auto-reply delivery exception:", autoReplyError);
      }
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Method B: Nodemailer SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: adminRecipient,
        replyTo: parsedData.email,
        subject: `New Lead: ${parsedData.serviceRequested} Inquiry from ${parsedData.name}`,
        text: `Name: ${parsedData.name}\nEmail: ${parsedData.email}\nService: ${parsedData.serviceRequested}\nBudget: ${parsedData.budget}\n\nMessage:\n${parsedData.message}`,
      });
    } else {
      console.info(
        "Notice: Neither RESEND_API_KEY nor SMTP credentials configured. Stored in database; email delivery simulated for development."
      );
    }

    return {
      success: true,
      message: "Your message has been sent successfully! I will be in touch with you shortly.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: "Something went wrong while sending your inquiry. Please try again later.",
    };
  }
}
