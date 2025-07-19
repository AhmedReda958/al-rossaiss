/**
 * Email Templates for Al Rossais
 */

export interface PasswordResetEmailData {
  email: string;
  resetToken: string;
  userName?: string;
  locale?: string;
}

export function getPasswordResetEmailTemplate(data: PasswordResetEmailData) {
  const { resetToken, userName, locale = "en" } = data;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/${locale}/reset-password?token=${resetToken}`;

  const isArabic = locale === "ar";

  // Email content based on locale
  const content = isArabic
    ? {
        subject: "إعادة تعيين كلمة المرور - الرصيص",
        greeting: userName ? `مرحباً ${userName}،` : "مرحباً،",
        title: "طلب إعادة تعيين كلمة المرور",
        message: "لقد طلبت إعادة تعيين كلمة المرور لحسابك في لوحة تحكم الرصيص.",
        instruction: "اضغط على الرابط أدناه لإعادة تعيين كلمة المرور:",
        buttonText: "إعادة تعيين كلمة المرور",
        expiry: "ستنتهي صلاحية هذا الرابط خلال ساعة واحدة.",
        ignore:
          "إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.",
        footer: "تحياتنا،<br/>فريق الرصيص",
      }
    : {
        subject: "Password Reset - Al Rossais",
        greeting: userName ? `Hello ${userName},` : "Hello,",
        title: "Password Reset Request",
        message:
          "You requested a password reset for your Al Rossais admin account.",
        instruction: "Click the link below to reset your password:",
        buttonText: "Reset Password",
        expiry: "This link will expire in 1 hour.",
        ignore: "If you didn't request this reset, please ignore this email.",
        footer: "Best regards,<br/>Al Rossais Team",
      };

  const direction = isArabic ? "rtl" : "ltr";
  const fontFamily = isArabic
    ? "'Segoe UI', Tahoma, Arial, sans-serif"
    : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  return {
    subject: content.subject,
    html: `
<!DOCTYPE html>
<html dir="${direction}" lang="${locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.subject}</title>
    <style>
        body {
            font-family: ${fontFamily};
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            direction: ${direction};
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo img {
            max-width: 120px;
            height: auto;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
            font-size: 16px;
        }
        .reset-button {
            display: block;
            width: 200px;
            margin: 30px auto;
            padding: 15px 30px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .expiry-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
            text-align: center;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .security-note {
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-size: 14px;
            color: #666;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .email-container {
                padding: 20px;
            }
            h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo">
            <img src="${baseUrl}/logo.svg" alt="Al Rossais Logo" />
        </div>
        
        <h1>${content.title}</h1>
        
        <div class="content">
            <p>${content.greeting}</p>
            <p>${content.message}</p>
            <p>${content.instruction}</p>
        </div>
        
        <a href="${resetUrl}" class="reset-button">${content.buttonText}</a>
        
        <div class="expiry-notice">
            ⏰ ${content.expiry}
        </div>
        
        <div class="security-note">
            <strong>Security Note:</strong> ${content.ignore}
            <br><br>
            <small>Reset URL: <a href="${resetUrl}">${resetUrl}</a></small>
        </div>
        
        <div class="footer">
            ${content.footer}
        </div>
    </div>
</body>
</html>`,
    text: `
${content.title}

${content.greeting}

${content.message}

${content.instruction}

Reset URL: ${resetUrl}

${content.expiry}

${content.ignore}

${content.footer.replace("<br/>", "\n")}
`,
  };
}
