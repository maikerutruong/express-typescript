import { IUser } from "../models/user.model"; // Adjust the path as per your project structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null; // Assuming IUser represents your user model interface
      token?: string;
    }
  }
}
