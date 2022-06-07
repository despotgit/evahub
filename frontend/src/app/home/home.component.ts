import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { UserStoreService } from '../services/user-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username$: Observable<string>;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private userStore: UserStoreService) {

    this.username$ = this.userStore.$username;
  }

  ngOnInit(): void {

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["login"]);

  }

}
