const nodemailer = require("nodemailer");

let transporter;

// Lazily create the transporter so a missing/invalid config doesn't crash
// the server on boot - it'll only throw when an email is actually sent.
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for port 465, false for 587/others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

// @param {Object} options
// @param {string} options.to
// @param {string} options.subject
// @param {string} options.html
const sendEmail = async ({ to, subject, html }) => {
  const mailTransporter = getTransporter();

  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || `"UniVerse" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
