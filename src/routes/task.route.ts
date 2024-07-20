import express, { Request, Response, Router } from "express";
import Task, { ITask } from "../models/task.model";
import auth from "../middleware/auth";

const router: Router = express.Router();

router.post(
  "/tasks",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    const task = new Task({
      ...req.body,
      owner: req.user?._id,
    });

    try {
      await task.save();
      res.status(201).send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  },
);

router.get(
  "/tasks",
  auth,
  async ({ query, user }: Request, res: Response): Promise<void> => {
    const match: { completed?: boolean } = {};

    const sort: { createdAt: number } = {
      createdAt: 1,
    };

    if (query.completed) {
      match.completed = query.completed === "true";
    }

    if (query.sortBy) {
      sort.createdAt = query.sortBy === "desc" ? -1 : 1;
    }

    try {
      await user!.populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(<string>query.limit),
          skip: parseInt(<string>query.skip),
          sort,
        },
      });

      res.send(user!.tasks);
    } catch (e) {
      res.status(404).send(e);
    }
  },
);

router.get("/tasks/:id", auth, async (req: Request, res: Response) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user!._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req: Request, res: Response) => {
  const allowedUpdates: (keyof ITask)[] = ["description", "completed"];

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!._id },
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update as keyof ITask),
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete(
  "/tasks/:id",
  auth,
  async ({ params, user }: Request, res: Response) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: params.id,
        owner: user!._id,
      });

      if (!task) {
        res.status(404).send();
      }

      res.send(task);
    } catch (e) {
      res.status(500).send();
    }
  },
);

export default router;
