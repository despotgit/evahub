import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { UserStoreService } from '../services/user-store.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from "@angular/material/expansion";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  panelOpenState = false;

  username$: Observable<string>;

  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: [''] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: [''] });

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private userStore: UserStoreService,
    private _formBuilder: FormBuilder) {

    this.username$ = this.userStore.$username;


  }

  ngOnInit(): void {

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["login"]);

  }

  doneStepper() {

    console.log('v is:', this.firstFormGroup.value);

    //console.log('stepper is:', this.stepper);
  }



}
