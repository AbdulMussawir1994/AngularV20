import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ExpenseCategory,
  ExpenseType,
  ExpenseFormValue,
  CreateExpenseDto,
  AddExpenseBody,
} from '../../models/expense.model';
import { noPastDateValidator } from '../../extensions/noPastDateValidator';
import { ApiService } from '../../services/api-service';
import { finalize } from 'rxjs';

type ExpenseForm = FormGroup<{
  title: FormControl<string>;
  amount: FormControl<string>;
  category: FormControl<ExpenseCategory | ''>;
  dueDate: FormControl<string>;
  type: FormControl<ExpenseType | ''>;
  description: FormControl<string>;
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
  private readonly apiService = inject(ApiService);
  readonly submitting = signal(false);
  readonly loading = signal(false);

  today = this.getToday();

  categories: readonly ExpenseCategory[] = ['Home', 'Personal', 'Family', 'Other'];

  types: readonly ExpenseType[] = ['Prepaid', 'Postpaid'];

  readonly bubbles = Array.from({ length: 10 });

  readonly form: ExpenseForm = this.fb.group({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),

    amount: this.fb.control('', {
      validators: [Validators.required, Validators.min(1)],
    }),

    // ✅ EXPLICIT GENERIC TYPE
    category: this.fb.control<ExpenseCategory | ''>('', Validators.required),

    dueDate: this.fb.control(this.today, [Validators.required, noPastDateValidator(this.today)]),

    type: this.fb.control<ExpenseType | ''>('', Validators.required),

    description: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  // submit2(): void {
  //   if (this.form.invalid || this.submitting()) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   this.submitting.set(true);

  //   this.apiService
  //     .addExpense(this.buildFormData())
  //     .pipe(finalize(() => this.submitting.set(false)))
  //     .subscribe({
  //       next: () => this.router.navigateByUrl('/expenses'),
  //       error: () => {},
  //     });
  // }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const body: AddExpenseBody = {
      title: this.form.value.title!.trim(),
      amount: Number(this.form.value.amount), // ✅ converted to number
      category: this.form.value.category!,
      type: this.form.value.type!,
      dueDate: this.form.value.dueDate!, // yyyy-MM-dd
      description: this.form.value.description!,
    };

    this.apiService.addExpense(body).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/expenses');
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  private buildFormData(): FormData {
    const value = this.form.getRawValue();
    const formData = new FormData();

    formData.append('title', value.title);
    formData.append('amount', value.amount.toString());
    formData.append('category', value.category);
    formData.append('type', value.type);
    formData.append('dueDate', value.dueDate);

    return formData;
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove commas
    value = value.replace(/,/g, '');

    // Allow only digits and ONE decimal point
    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');

    // Prevent more than one decimal point
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    const [integerPart, decimalPart] = value.split('.');

    // Format integer part with commas
    const formattedInteger = integerPart ? Number(integerPart).toLocaleString('en-US') : '';

    const formattedValue =
      decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;

    input.value = formattedValue;
    this.form.controls.amount.setValue(formattedValue, { emitEvent: false });
  }

  private getToday(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  isInvalid(field: keyof ExpenseFormValue): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  error(field: keyof ExpenseFormValue): string {
    // debugger
    const control = this.form.controls[field];

    if (control.hasError('required')) return 'This field is required.';

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      return `Minimum ${requiredLength} characters required.`;
    }

    if (control.hasError('min')) return 'Amount must be greater than 0.';
    if (control.hasError('pastDate')) return 'Past date is not allowed.';

    return '';
  }

  private toDto(value: ExpenseFormValue): CreateExpenseDto {
    return {
      title: value.title.trim(),
      amount: Number(value.amount.replace(/,/g, '')), // ✅ convert here
      category: value.category as ExpenseCategory,
      type: value.type as ExpenseType,
      dueDate: new Date(value.dueDate).toISOString(),
      description: value.description.trim(),
    };
  }
}
