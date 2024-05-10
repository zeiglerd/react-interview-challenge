import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (request: Request, response: Response) => {
  response.send("Accounts get route");
});

router.get("/:accountID", (request: Request, response: Response) => {
  response.send("Specific Account get route");
});

export default router;

