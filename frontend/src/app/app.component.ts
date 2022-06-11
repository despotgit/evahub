import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HomePageDataStoreService } from "./services/home-page-data-store.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'power';

  constructor(private router: Router,
    private homePageDataStore: HomePageDataStoreService) {
    this.homePageDataStore.setState(
      {
        firstLastName: '',
        address: ''

      }
    );

  }

  gotoReports() {
    this.router.navigate(['/reports']);
  }

  gotoHome() {
    this.router.navigate(['/home']);
  }
}
