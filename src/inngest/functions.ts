import { inngest } from "./client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export const processLeadEvent = inngest.createFunction(
  { 
    id: "process-lead-submission",
    triggers: [{ event: "contact/lead.submitted" }]
  },
  async ({ event, step }) => {
    const { parsedData } = event.data;

    // Step 1: Send notification email to admin
    await step.run("send-admin-notification", async () => {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: "hello@yourdomain.com", // Adjust accordingly
          subject: `New Lead: ${parsedData.serviceRequested} from ${parsedData.name}`,
          html: `
            <h1>New Lead Details</h1>
            <p><strong>Name:</strong> ${parsedData.name}</p>
            <p><strong>Email:</strong> ${parsedData.email}</p>
            <p><strong>Service Requested:</strong> ${parsedData.serviceRequested}</p>
            <p><strong>Budget:</strong> ${parsedData.budget}</p>
            <p><strong>Message:</strong></p>
            <p>${parsedData.message}</p>
          `,
        });
      }
      return { success: true };
    });

    // Step 2: Send auto-responder to user
    await step.run("send-auto-responder", async () => {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: parsedData.email,
          subject: "Thanks for reaching out!",
          html: `
            <h2>Hi ${parsedData.name},</h2>
            <p>Thanks for getting in touch about your ${parsedData.serviceRequested} project!</p>
            <p>I have received your message and will get back to you within 24-48 hours to discuss next steps.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>Sunaina</strong></p>
          `,
        });
      }
      return { success: true };
    });

    return { message: "Lead processed successfully" };
  }
);
