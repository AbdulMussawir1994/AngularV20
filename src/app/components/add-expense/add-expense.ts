import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ExpenseCategory,
  ExpenseType,
  ExpenseFormValue,
  CreateExpenseDto,
} from '../../models/expense.model';

type ExpenseForm = FormGroup<{
  title: FormControl<string>;
  amount: FormControl<number>;
  category: FormControl<ExpenseCategory | ''>;
  dueDate: FormControl<string>;
  type: FormControl<ExpenseType | ''>;
}>;

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpense {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly loading = signal(false);

  readonly categories: readonly ExpenseCategory[] = ['Home', 'Personal', 'Family', 'Other'];

  readonly types: readonly ExpenseType[] = ['Prepaid', 'Postpaid'];

  readonly bubbles = Array.from({ length: 10 });

  readonly form: ExpenseForm = this.fb.group({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),

    amount: this.fb.control(0, {
      validators: [Validators.required, Validators.min(1)],
    }),

    // ✅ EXPLICIT GENERIC TYPE
    category: this.fb.control<ExpenseCategory | ''>('', Validators.required),

    dueDate: this.fb.control(this.today(), Validators.required),

    type: this.fb.control<ExpenseType | ''>('', Validators.required),
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const dto = this.toDto(this.form.getRawValue());

    // 🔴 Call API here
    // await this.expenseService.create(dto);

    setTimeout(() => {
      this.submitting.set(false);
      this.router.navigateByUrl('/expenses');
    }, 800);
  }

  isInvalid(field: keyof ExpenseFormValue): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  error(field: keyof ExpenseFormValue): string {
    const c = this.form.controls[field];

    if (c.hasError('required')) return 'This field is required';
    if (c.hasError('minlength')) return 'Minimum 3 characters required';
    if (c.hasError('min')) return 'Amount must be greater than 0';

    return '';
  }

  private toDto(value: ExpenseFormValue): CreateExpenseDto {
    return {
      title: value.title.trim(),
      amount: value.amount,
      category: value.category as ExpenseCategory,
      type: value.type as ExpenseType,
      dueDate: new Date(value.dueDate).toISOString(),
    };
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
