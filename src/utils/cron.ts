import cron from "node-cron";
import Todo from "../models/Todo";
import { sendEmailReminder } from "./sendMail";

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const nextHour = new Date();
    nextHour.setHours(now.getHours() + 1);

    const todos = await Todo.find({
      reminderTime: { $gte: now, $lt: nextHour },
      isCompleted: false,
    });

    for (const todo of todos) {
      await sendEmailReminder(
        "user-email@example.com",
        todo.title,
        todo.dueDate
      );
    }
  } catch (error) {
    console.error("Error scheduling email reminders:", error);
  }
});
