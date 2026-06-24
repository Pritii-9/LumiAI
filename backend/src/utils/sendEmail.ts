import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string, rawOtp?: string) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('\n=============================================');
      console.log('📧 NO EMAIL CREDENTIALS FOUND IN .env');
      console.log(`✉️ Simulated Email to: ${to}`);
      console.log(`Subject: ${subject}`);
      if (rawOtp) console.log(`OTP Code: ${rawOtp}`);
      console.log('=============================================\n');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"LumiAI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
