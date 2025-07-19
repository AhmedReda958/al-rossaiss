import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const getPasswordResetEmailTemplate = (resetUrl: string, locale: string = 'en') => {
  const isArabic = locale === 'ar';
  
  if (isArabic) {
    return {
      subject: 'إعادة تعيين كلمة المرور - الرصيص',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إعادة تعيين كلمة المرور</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { max-width: 150px; height: auto; }
                .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .button:hover { background: #0056b3; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>إعادة تعيين كلمة المرور</h1>
                    <p>لوحة تحكم الرصيص الإدارية</p>
                </div>
                
                <p>مرحباً،</p>
                
                <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في لوحة تحكم الرصيص الإدارية.</p>
                
                <p>انقر على الزر أدناه لإعادة تعيين كلمة المرور:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
                </div>
                
                <div class="warning">
                    <strong>مهم:</strong>
                    <ul>
                        <li>هذا الرابط صالح لمدة ساعة واحدة فقط</li>
                        <li>يمكن استخدام هذا الرابط مرة واحدة فقط</li>
                        <li>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني</li>
                    </ul>
                </div>
                
                <p>إذا كان لديك أي مشاكل مع الزر أعلاه، يمكنك نسخ ولصق الرابط التالي في متصفحك:</p>
                <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">${resetUrl}</p>
                
                <div class="footer">
                    <p>شكراً لك،<br>فريق الرصيص</p>
                    <p style="font-size: 12px;">هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
إعادة تعيين كلمة المرور - الرصيص

مرحباً،

لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في لوحة تحكم الرصيص الإدارية.

انقر على الرابط التالي لإعادة تعيين كلمة المرور:
${resetUrl}

مهم:
- هذا الرابط صالح لمدة ساعة واحدة فقط
- يمكن استخدام هذا الرابط مرة واحدة فقط
- إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني

شكراً لك،
فريق الرصيص
      `
    };
  }

  // English template
  return {
    subject: 'Password Reset - Al Rossais',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { max-width: 150px; height: auto; }
              .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .button:hover { background: #0056b3; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Password Reset</h1>
                  <p>Al Rossais Admin Dashboard</p>
              </div>
              
              <p>Hello,</p>
              
              <p>We received a request to reset the password for your Al Rossais admin account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <div class="warning">
                  <strong>Important:</strong>
                  <ul>
                      <li>This link is valid for 1 hour only</li>
                      <li>This link can only be used once</li>
                      <li>If you didn't request a password reset, please ignore this email</li>
                  </ul>
              </div>
              
              <p>If you're having trouble with the button above, copy and paste the following link into your browser:</p>
              <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              
              <div class="footer">
                  <p>Thank you,<br>The Al Rossais Team</p>
                  <p style="font-size: 12px;">This is an automated email, please do not reply.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    text: `
Password Reset - Al Rossais

Hello,

We received a request to reset the password for your Al Rossais admin account.

Click the following link to reset your password:
${resetUrl}

Important:
- This link is valid for 1 hour only
- This link can only be used once
- If you didn't request a password reset, please ignore this email

Thank you,
The Al Rossais Team
    `
  };
};

// Send password reset email
export async function sendPasswordResetEmail(
  email: string, 
  resetToken: string, 
  locale: string = 'en'
): Promise<boolean> {
  try {
    // Validate environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return false;
    }

    // Create reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/${locale}/reset-password?token=${resetToken}`;

    // Get email template
    const template = getPasswordResetEmailTemplate(resetUrl, locale);

    // Email options
    const mailOptions = {
      from: {
        name: locale === 'ar' ? 'الرصيص' : 'Al Rossais',
        address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return true;

  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}
