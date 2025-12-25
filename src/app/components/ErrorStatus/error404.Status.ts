import { Component } from '@angular/core';

@Component({
  selector: 'app-404-error-status',
  template: ` <div class="container">
    <h4>404 - Page Not Found</h4>
  </div>`,
  styles: ['h4{color:red;font-size:40px; text-align:center; margin-top:50px;}'],
})
export class Error404Status {}
