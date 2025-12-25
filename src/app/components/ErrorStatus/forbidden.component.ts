import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  template: `
  <div class="container mt-5">
    <div class="card text-center" style="padding:20px;">
      <h1>You are not allowed to access this page</h1>
    </div>
  </div>
`,
 styles: []
})
export class ForbiddenComponent {

}
