const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // Use Gmail as default
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // For self-signed certificates
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('Server is ready to take our messages');
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} options.html - HTML email body (optional)
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Message sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

/**
 * Send a password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to,
      subject: 'Password Reset Token',
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You are receiving this email because you (or someone else) has requested a password reset.</p>
          <p>Please click the link below to reset your password:</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>This link will expire in ${process.env.JWT_RESET_EXPIRE || '10'} minutes.</p>
        </div>
      `,
    });
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send a welcome email
 * @param {string} to - Recipient email address
 * @param {string} name - User's name
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    await sendEmail({
      to,
      subject: 'Welcome to Our Hotel Management System',
      text: `Welcome ${name}! Thank you for registering with our hotel management system.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Welcome to Our Hotel Management System, ${name}!</h2>
          <p>Thank you for registering with our hotel management system. We're excited to have you on board!</p>
          <p>You can now log in to your account and start managing your bookings.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The Hotel Team</p>
        </div>
      `,
    });
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
