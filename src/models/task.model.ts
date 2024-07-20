import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  description: string;
  completed: boolean;
  owner: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;
