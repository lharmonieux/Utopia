import sgMail from "@sendgrid/mail";

export const sendMail = async ({ to, subject, text, html }) => {
  sgMail.setApiKey(String(process.env.API_KEY_SENDGRID));

  const msg = {
    to,
    from: process.env.MAIL_USER,
    subject,
    text,
    html,
  };

  return await sgMail.send(msg);
};
