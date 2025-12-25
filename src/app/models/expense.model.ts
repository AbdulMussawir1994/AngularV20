export type ExpenseCategory = 'Home' | 'Personal' | 'Family' | 'Other';
export type ExpenseType = 'Prepaid' | 'Postpaid';

export interface Expense {
  readonly id: number;
  readonly title: string;
  readonly dueDate: Date;
  readonly type: ExpenseType;
  readonly amount: string;
  readonly category: ExpenseCategory;
}

export interface ExpenseFormValue {
  title: string;
  dueDate: string;
  type: ExpenseType;
  amount: string;
  category: ExpenseCategory;
}

export interface CreateExpenseDto {
  title: string;
  dueDate: string;
  type: ExpenseType;
  amount: string;
  category: ExpenseCategory;
}
