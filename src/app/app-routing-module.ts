import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { AddExpense } from './components/add-expense/add-expense';
import { Error404Status } from './components/ErrorStatus/error404.Status';
import { ForbiddenComponent } from './components/ErrorStatus/forbidden.component';

const routes: Routes = [
  {
    path: '',
    component: AddExpense,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: Error404Status,
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
