const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: "aleezay.shahzad12@gmail.com", 
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent via SendGrid");
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error);
    throw error;
  }
};

module.exports = sendEmail;