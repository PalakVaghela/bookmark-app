import nodemailer from "nodemailer";

type SendSignupSuccessEmailParams = {
  to: string;
  handle: string;
};

export async function sendSignupSuccessEmail({
  to,
  handle,
}: SendSignupSuccessEmailParams) {
  const from = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!from || !pass) {
    return { error: "Email configuration environment variables are missing." };
  }

  try {
    // 1. Initialize the Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: from,
        pass: pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Bookmark App" <${from}>`,
      to: to,
      subject: "Welcome to bookmark-app",
      html: `
        <h1>Account created successfully</h1>
        <p>Hi @${handle},</p>
        <p>Your Bookmark account is ready. You can sign in and start saving your bookmarks.</p>
      `,
    });

    return { data: info };
  } catch (error: any) {
    return { error: error.message || "Failed to send email." };
  }
}
