const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, body) => {
  try {
    const safeSubject = (subject && subject.trim()) || "chaiNco Notification";

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey", // literally "apikey"
        pass: process.env.SENDGRID_API_KEY,
      },
    });

   //the emails are been send without any styling and in raw json output style. hence the code below will help format the emails drafted to match the brands aesthic. 
    const htmlBody = `
      <div style="font-family:sans-serif; background-color:#fdf2f8; padding:20px; border-radius:8px;">
        <h1 style="color:#be185d; font-size:20px;">${safeSubject}</h1>
        <p style="color:#111; line-height:1.5; font-size:16px;">${body.replace(/\n/g, "<br>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Chai & Co." <aleezay.shahzad12@gmail.com>',
      to: email,
      subject: safeSubject,
      html: htmlBody,
    });

    console.log(`Email sent to ${email} with subject: "${safeSubject}"`);
  } catch (error) {
    console.error("SendGrid error:", error);
    throw error;
  }
};

module.exports = sendEmail;