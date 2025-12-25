import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ExpenseCategory,
  ExpenseType,
  ExpenseFormValue,
  CreateExpenseDto,
} from '../../models/expense.model';

type ExpenseForm = FormGroup<{
  title: FormControl<string>;
  amount: FormControl<string>;
  category: FormControl<ExpenseCategory>;
  dueDate: FormControl<string>;
  type: FormControl<ExpenseType>;
}>;

@Component({
  selector: 'app-add-expense',
  standalone: false,
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpense {
  private readonly fb = inject(NonNullableFormBuilder);
  //private readonly expenseService = inject(ExpenseService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);

  readonly categories: readonly ExpenseCategory[] = ['Home', 'Personal', 'Family', 'Other'];

  readonly types: readonly ExpenseType[] = ['Prepaid', 'Postpaid'];

  readonly form: ExpenseForm = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    amount: this.fb.control('', [Validators.required, Validators.min(1)]),
    category: this.fb.control<ExpenseCategory>('Home', Validators.required),
    dueDate: this.fb.control(this.today(), Validators.required),
    type: this.fb.control<ExpenseType>('Prepaid', Validators.required),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  control<K extends keyof ExpenseFormValue>(key: K) {
    return this.form.controls[key];
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const dto = this.toDto(this.form.getRawValue());
      //    await this.expenseService.create(dto);
      await this.router.navigateByUrl('/expenses');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private toDto(value: ExpenseFormValue): CreateExpenseDto {
    return {
      title: value.title.trim(),
      amount: value.amount,
      category: value.category,
      type: value.type,
      dueDate: new Date(value.dueDate).toISOString(),
    };
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
