import express, { Request, Response } from "express";

const router = express.Router();

router.post("/:accountID/withdraw", (request: Request, response: Response) => {
  response.send("Transactions withdraw route");
});

router.post("/:accountID/deposit", (request: Request, response: Response) => {
  response.send("Transactions deposit route");
});

export default router;