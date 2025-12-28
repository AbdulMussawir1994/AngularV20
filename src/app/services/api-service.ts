import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { environment } from '../environment/environment';
import { GenericResponse } from '../extensions/GenericResponse';
import { AddExpenseBody } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.backEndServer;
  private readonly requestTimeout = 30_000; // 30s

  /**
   * Create Expense
   */
 addExpense(body: AddExpenseBody): Observable<GenericResponse<unknown>> {
  return this.http
    .post<GenericResponse<unknown>>(
      `${this.baseUrl}/AddExpense`,
      body, // ✅ JSON body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError)
    );
}

  /**
   * Centralized HTTP error handling
   */
  private handleError(error: HttpErrorResponse) {
    let message = 'Something went wrong. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side / network error
      message = error.error.message;
    } else {
      // Backend error
      message = error.error?.message ?? `Server error (${error.status})`;
    }

    return throwError(() => new Error(message));
  }
}
