import mongoose, { Document, Model, Schema, Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Task, { ITask } from "./task.model";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age?: number;
  tokens: { token: string }[];
  avatar?: Buffer;
  tasks?: Types.DocumentArray<ITask>;
  generateAuthToken: () => Promise<string>;

  remove(): unknown;
}

export interface IUserModel extends Model<IUser> {
  generateAuthToken(): unknown;

  findByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// Remove sensitive data from user object before sending response
userSchema.methods.toJSON = function (this: IUser & Document) {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.avatar;
  return user;
};

// Generate authentication token for user
userSchema.methods.generateAuthToken = async function (this: IUser & Document) {
  const user = this as IUser;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Find user by credentials (email and password)
userSchema.statics.findByCredentials = async function (
  email: string,
  password: string,
): Promise<IUser | null> {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};
userSchema.pre("save", async function (this: IUser & Document, next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (this: IUser & Document, next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

const User: Model<IUser, IUserModel> = mongoose.model("User", userSchema);

export default User;
