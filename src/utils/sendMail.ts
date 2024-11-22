import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

export const sendEmailReminder = async (
  email: string,
  taskTitle: string,
  dueDate: Date
) => {
  try {
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: `Reminder: ${taskTitle} due soon!`,
      text: `Your task "${taskTitle}" is due on ${dueDate}. Don't forget to complete it!`,
    });
  } catch (error) {
    console.error("Failed to send email reminder:", error);
  }
};
