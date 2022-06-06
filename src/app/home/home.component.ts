import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserStoreService } from '../services/user-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: any;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private userStore: UserStoreService) { }

  ngOnInit(): void {
    const $username = this.userStore.$username;
    this.username = $username;

    console.log('username is:', this.username);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["login"]);
    

  }

}
