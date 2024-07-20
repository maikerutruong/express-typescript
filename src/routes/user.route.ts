import express, { Request, Response, Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { Document } from "mongoose";
import User, { IUser, IUserModel } from "../models/user.model";
import auth from "../middleware/auth";
import { sendCancelationEmail, sendWelcomeEmail } from "../emails/account";

const router: Router = express.Router();

router.post(
  "/users/register",
  async (req: Request, res: Response): Promise<void> => {
    const user: Document<IUser, IUserModel> = new User(req.body);

    try {
      await user.save();
      // sendWelcomeEmail(user.email, user.name);
      const token: string = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  },
);

router.post("/users/login", async (req: Request, res: Response) => {
  try {
    const user: IUserModel | null = (await User.findByCredentials(
      req.body.email,
      req.body.password,
    )) as IUserModel | null;
    if (!user) {
      return res.status(400).send("Unable to login");
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.error(e);
    res.status(400).send("Unable to login");
  }
});

router.post(
  "/users/logout",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      req.user!.tokens = req.user!.tokens.filter(
        (token: { token: string }): boolean => token.token !== req.token,
      );
      await req.user!.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },
);

router.post(
  "/users/logoutAll",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      req.user!.tokens = [];
      await req.user!.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },
);

router.get(
  "/users/me",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    res.send(req.user);
  },
);

router.patch(
  "/users/me",
  auth,
  async ({ body, user }: Request, res: Response) => {
    const updates: string[] = Object.keys(body);
    const allowedUpdates: string[] = ["name", "email", "password", "age"];

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
      updates.forEach((update: string) => {
        // @ts-ignore
        return (user![update] = body[update]);
      });
      await user!.save();
      res.send(user);
    } catch ({ message }) {
      res.status(400).send(message);
    }
  },
);

router.delete("/users/me", auth, async (req: Request, res: Response) => {
  try {
    await req.user?.remove();
    // sendCancelationEmail(req.user!.email, req.user!.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  fileFilter: function (
    req,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // @ts-ignore
      return cb(new Error("Please upload an image"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1000000,
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async ({ file, user }: Request, res: Response): Promise<void> => {
    // @ts-ignore
    user!.avatar = await sharp(file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    await user!.save();
    res.send();
  },
  (
    error: Error,
    req: Request,
    res: Response,
    next: express.NextFunction,
  ): void => {
    res.status(400).send({ error: error.message });
  },
);

router.delete(
  "/users/me/avatar",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    req.user!.avatar = undefined;
    await req.user!.save();
    res.send();
  },
);

router.get(
  "/users/:id/avatar",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);

      if (!user || !user.avatar) {
        throw new Error();
      }

      res.set("Content-Type", "image/png");
      res.send(user.avatar);
    } catch (e) {
      res.status(404).send();
    }
  },
);

export default router;
