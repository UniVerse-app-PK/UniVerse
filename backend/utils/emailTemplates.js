// Simple, inline-styled OTP email template (inline CSS = safest for email clients)
const otpEmailTemplate = ({ name, otp, message }) => `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 30px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; font-family: 'Righteous', 'Inter', Helvetica, Arial, sans-serif;">
        <span style="color: #6C5CE7;">Uni</span><span style="color: #1E1B2E;">Verse</span>
      </h1>
    </div>
    <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; margin: 0 0 16px;">Hi ${name || "there"},</h2>
    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">${message}</p>
    
    <div style="background: linear-gradient(145deg, #f8f7ff 0%, #f3f0ff 100%); padding: 32px 24px; text-align: center; border-radius: 12px; margin: 32px 0; border: 1px solid #ede9fe;">
      <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #6C5CE7; text-shadow: 0 2px 4px rgba(108, 92, 231, 0.1);">${otp}</span>
    </div>
    
    <p style="color: #71717a; font-size: 14px; line-height: 1.5; margin-bottom: 30px;">
      This verification code is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
    
    <p style="color: #a1a1aa; font-size: 13px; line-height: 1.5; text-align: center; margin: 0;">
      If you didn't request this email, there's nothing to worry about &mdash; you can safely ignore it.
    </p>
    <p style="color: #a1a1aa; font-size: 13px; line-height: 1.5; text-align: center; margin: 0;">
      ㅤ
    </p>
    <p style="color: #a1a1aa; font-size: 10px; line-height: 1.5; text-align: center; margin: 0;">
      © Foundry_4 Team
    </p>
  </div>
`;

module.exports = { otpEmailTemplate };
