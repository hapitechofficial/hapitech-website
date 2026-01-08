import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (to: string, name: string, resetUrl: string) => {
  const subject = 'Reset Your hApItech Password';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #FF6B35, #9B1C31); color: white; padding: 20px; border-radius: 5px; }
          .content { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(to right, #FF6B35, #9B1C31); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your hApItech account. Click the button below to reset it.</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link in your browser:</p>
            <p><code>${resetUrl}</code></p>
            <p>If you didn't request a password reset, please ignore this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 hApItech. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return sendEmail(to, subject, html);
};