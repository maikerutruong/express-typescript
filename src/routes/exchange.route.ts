import express, { Request, Response, Router } from "express";
import Exchange from "../models/exchange.model";

const router: Router = express.Router();

router.get("/exchange", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Exchange.find();
    res.json(data);
  } catch (e) {
    res.status(404).send(e);
  }
});

export default router;
