export type account = {
  account_number: number;
  name: string;
  amount: number;
  type: string;
  credit_limit: number;
  lastWithdraw?: {
    date: string;
    amount: number;
  };
}
