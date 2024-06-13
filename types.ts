export interface Transaction {
  id: number;
  category_id: number;
  amount: number;
  date: number;
  description: string;
  type: "Expense" | "Income";
}

export interface Category {
  id: number;
  name: string;
  type: "Expense" | "Income";
}

export interface TransactionsByMonth {
  totalExpenses: number;
  totalIncome: number;
}

export interface Donor {
  id: number;
  name: string;
  date: number;
  national_id: string;
  height: number;
  mass: number;
  packNumber: number;
  age: number;
  sex: string;
}

export interface DonorsBled {
  maleDonors: number;
  femaleDonors: number;
}
