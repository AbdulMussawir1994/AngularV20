export type ExpenseCategory = 'Home' | 'Personal' | 'Family' | 'Other';
export type ExpenseType = 'Prepaid' | 'Postpaid';

export interface ExpenseFormValue {
  title: string;
  amount: string;
  category: ExpenseCategory | '';
  dueDate: string;
  type: ExpenseType | '';
  description: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: string;
  type: ExpenseType;
  description?: string;
}

export interface AddExpenseBody {
  title: string;
  amount: number;
  category: string;
  type: string;
  dueDate: string; // yyyy-MM-dd or ISO
  description: string;
}
