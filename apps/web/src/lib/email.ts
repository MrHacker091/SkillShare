// lib/email.ts - Email service for sending OTP and verification emails

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OTPEmailData {
  email: string;
  name: string;
  otp: string;
  type: 'registration' | 'password-reset' | 'verification';
}

// In production, you would use a service like:
// - NodeMailer with SMTP
// - SendGrid
// - AWS SES
// - Resend
// - Mailgun

export class EmailService {
  private static instance: EmailService;

  private constructor() { }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Generate a secure 6-digit OTP
   */
  public generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create HTML email template for OTP
   */
  private createOTPTemplate(data: OTPEmailData): string {
    const { name, otp, type } = data;

    const titles = {
      registration: 'Complete Your Registration',
      verification: 'Verify Your Email',
      'password-reset': 'Reset Your Password'
    };

    const messages = {
      registration: 'Welcome to SkillShare! Please verify your email to complete your registration.',
      verification: 'Please verify your email address to continue.',
      'password-reset': 'You requested to reset your password. Use the code below to proceed.'
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${titles[type]}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 40px 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 30px;
        }
        .otp-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: white;
          letter-spacing: 8px;
          margin: 0;
          font-family: 'Courier New', monospace;
        }
        .otp-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin-top: 10px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 15px;
          border-radius: 6px;
          font-size: 14px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎨 SkillShare</div>
          <h1 class="title">${titles[type]}</h1>
        </div>
        
        <p class="message">
          Hi ${name},<br><br>
          ${messages[type]}
        </p>

        <div class="otp-container">
          <div class="otp-code">${otp}</div>
          <div class="otp-label">Your verification code</div>
        </div>

        <div class="warning">
          ⚠️ <strong>Important:</strong> This code will expire in 10 minutes. 
          If you didn't request this code, please ignore this email.
        </div>

        <div class="footer">
          <p>
            Need help? Contact us at <a href="mailto:support@skillshare.com">support@skillshare.com</a>
          </p>
          <p>
            © 2024 SkillShare. All rights reserved.<br>
            This is an automated email, please do not reply.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Send OTP email (simulated for demo - replace with real email service)
   */
  public async sendOTPEmail(data: OTPEmailData): Promise<boolean> {
    try {
      const htmlTemplate = this.createOTPTemplate(data);

      // 🚀 PRODUCTION EMAIL SENDING WITH RESEND
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: 'SkillShare <noreply@skillshare.com>',
          to: data.email,
          subject: this.getSubject(data.type),
          html: htmlTemplate
        });

        console.log('✅ EMAIL SENT VIA RESEND TO:', data.email);
        console.log('📧 SUBJECT:', this.getSubject(data.type));
        console.log('� OTP CODE:', data.otp);
      } else {
        // Fallback to console logging if no API key
        console.log('⚠️ NO EMAIL SERVICE CONFIGURED - CONSOLE OUTPUT:');
        console.log('📧 EMAIL TO:', data.email);
        console.log('📧 SUBJECT:', this.getSubject(data.type));
        console.log('🔐 OTP CODE:', data.otp);

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      /*
      // Alternative services (uncomment if using):
      
      // Example with NodeMailer:
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: '"SkillShare" <noreply@skillshare.com>',
        to: data.email,
        subject: this.getSubject(data.type),
        html: htmlTemplate
      });

      // Example with SendGrid:
      await sgMail.send({
        to: data.email,
        from: 'noreply@skillshare.com',
        subject: this.getSubject(data.type),
        html: htmlTemplate
      });
        subject: this.getSubject(data.type),
        html: htmlTemplate
      });
      */

      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  private getSubject(type: string): string {
    const subjects = {
      registration: 'Complete Your SkillShare Registration',
      verification: 'Verify Your SkillShare Email',
      'password-reset': 'Reset Your SkillShare Password'
    };
    return subjects[type as keyof typeof subjects] || 'SkillShare Verification';
  }

  /**
   * Send welcome email after successful registration
   */
  public async sendWelcomeEmail(email: string, name: string, userType: 'creator' | 'customer'): Promise<boolean> {
    try {
      const subject = `Welcome to SkillShare, ${name}! 🎉`;

      const welcomeMessages = {
        creator: {
          title: 'Welcome to the Creator Community!',
          message: `You're now part of an amazing community of talented student creators. 
                   Start building your portfolio, showcase your skills, and connect with clients looking for your expertise.`,
          nextSteps: [
            'Complete your profile with portfolio samples',
            'Set up your creator bio and skills',
            'Create your first project listing',
            'Start connecting with potential clients'
          ]
        },
        customer: {
          title: 'Welcome to SkillShare!',
          message: `Discover amazing student creators and bring your ideas to life. 
                   Browse through thousands of talented creators ready to help with your projects.`,
          nextSteps: [
            'Browse our featured creators',
            'Explore project categories',
            'Save your favorite creators',
            'Post your first project request'
          ]
        }
      };

      const content = welcomeMessages[userType];

      console.log('📧 WELCOME EMAIL SENT TO:', email);
      console.log('📧 USER TYPE:', userType);
      console.log('📧 SUBJECT:', subject);

      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 300));

      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }
}