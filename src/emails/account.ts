import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendWelcomeEmail = (email: any, name: any) => {
  sgMail.send({
    to: email,
    from: process.env.HOST_EMAIL!,
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

export const sendCancelationEmail = (email: any, name: any) => {
  sgMail.send({
    to: email,
    from: process.env.HOST_EMAIL!,
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  });
};
