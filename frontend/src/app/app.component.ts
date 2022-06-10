import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'power';

  constructor(private router: Router) {

  }

  gotoReports() {
    this.router.navigate(['/reports']);
  }

  gotoHome() {
    this.router.navigate(['/home']);
  }
}
