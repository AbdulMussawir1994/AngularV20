export type ExpenseCategory = 'Home' | 'Personal' | 'Family' | 'Other';
export type ExpenseType = 'Prepaid' | 'Postpaid';

export interface ExpenseFormValue {
  title: string;
  amount: number;
  category: ExpenseCategory | '';
  dueDate: string;
  type: ExpenseType | '';
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: string;
  type: ExpenseType;
}
