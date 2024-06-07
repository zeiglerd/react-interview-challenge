export type account = {
  accountNumber: number;
  name: string;
  amount: number;
  type: string;
  creditLimit: number;
  lastWithdraw?: {
    date: string;
    amount: number;
  };
}
