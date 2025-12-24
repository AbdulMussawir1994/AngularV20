import {
  Component,
  OnInit,
  inject,
  signal,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NonNullableFormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExpenseCategory, ExpenseFormValue, CreateExpenseDto } from '../../models/Expense';

type ExpenseForm = FormGroup<{
  title: FormControl<string>;
  amount: FormControl<number>;
  category: FormControl<ExpenseCategory>;
  date: FormControl<string>;
}>;

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpenseComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  //private readonly expenseService = inject(ExpenseService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20 Signals
  readonly isSubmitting = signal(false);

  readonly categories: readonly ExpenseCategory[] = ['Home', 'Personal', 'Food', 'Travel', 'Other'];

  expenseForm!: ExpenseForm;

  ngOnInit(): void {
    this.buildForm();
    this.trackChanges();
  }

  private buildForm(): void {
    this.expenseForm = this.fb.group({
      title: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      amount: this.fb.control(0, {
        validators: [Validators.required, Validators.min(1)],
      }),
      category: this.fb.control<ExpenseCategory>('Home', {
        validators: [Validators.required],
      }),
      date: this.fb.control(this.today(), {
        validators: [Validators.required],
      }),
    });
  }

  private trackChanges(): void {
    this.expenseForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  control<K extends keyof ExpenseFormValue>(name: K) {
    return this.expenseForm.controls[name];
  }

  async submitExpense(): Promise<void> {
    if (this.expenseForm.invalid || this.isSubmitting()) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const dto = this.mapToDto(this.expenseForm.getRawValue());
      //await this.expenseService.create(dto);
      await this.router.navigateByUrl('/expenses');
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private mapToDto(value: ExpenseFormValue): CreateExpenseDto {
    return {
      title: value.title.trim(),
      amount: value.amount,
      category: value.category,
      date: new Date(value.date).toISOString(),
    };
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }
}
