import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITodo extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed';
}

const TodoSchema: Schema<ITodo> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
