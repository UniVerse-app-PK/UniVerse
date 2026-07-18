// Simple, inline-styled OTP email template (inline CSS = safest for email clients)
const otpEmailTemplate = ({ name, otp, message }) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #4f46e5; margin: 0 0 16px;">UniVerse</h2>
    <p style="color: #222; font-size: 15px;">Hi ${name || "there"},</p>
    <p style="color: #222; font-size: 15px;">${message}</p>
    <div style="background: #f4f4f8; padding: 18px; text-align: center; border-radius: 8px; margin: 20px 0;">
      <span style="font-size: 30px; font-weight: bold; letter-spacing: 8px; color: #111;">${otp}</span>
    </div>
    <p style="color: #777; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
  </div>
`;

module.exports = { otpEmailTemplate };
