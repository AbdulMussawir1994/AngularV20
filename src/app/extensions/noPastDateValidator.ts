import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noPastDateValidator = (today: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    // Normalize dates (yyyy-mm-dd)
    const selected = new Date(control.value);
    const current = new Date(today);

    selected.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    return selected < current ? { pastDate: true } : null;
  };
};
