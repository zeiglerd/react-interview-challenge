import express from "express";
import transactionsRouter from "./routes/transactions";
import accountsRouter from "./routes/accounts";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Setup Routes
app.use("/transactions", transactionsRouter);
app.use("/accounts", accountsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});