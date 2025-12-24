export type ExpenseCategory =
  | 'Home'
  | 'Personal'
  | 'Food'
  | 'Travel'
  | 'Other';

export interface Expense {
  readonly id: number;
  readonly title: string;
  readonly amount: number;
  readonly category: ExpenseCategory;
  readonly date: Date;
}

export interface ExpenseFormValue {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO string
}