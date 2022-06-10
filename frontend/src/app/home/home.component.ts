import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from "@angular/material/expansion";
import { HomePageDataStoreService } from "../services/home-page-data-store.service";
import { UserStoreService } from '../services/user-store.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  panelOpenState = false;

  step1FormGroup: any;

  username$: Observable<string> = this.userStore.$username;
  firstLastName$: Observable<string> = this.homePageDataStore.firstLastName$;

  /*
  firstNameChanges$ = this.step1FormGroup.get('firstLastName').valueChanges.pipe(
    debounceTime(300),
    //map(v => (v || '').trim()),
    distinctUntilChanged(),
    tap(value => console.log('yeahhhhsh'))
  );
  */



  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private userStore: UserStoreService,
    private homePageDataStore: HomePageDataStoreService,
    private formBuilder: FormBuilder) {

    this.step1FormGroup = this.formBuilder.group({
      firstLastNameFormControl: new FormControl('')

    });


  }



  ngOnInit(): void {
    this.step1FormGroup.get('firstLastNameFormControl').valueChanges.pipe(
      map((a) => {
        console.log('oy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

      })
    );

    this.step1FormGroup.get('firstLastNameFormControl').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => console.log('oy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')),
      map((a) => a),
      tap((text: any) => {

        this.homePageDataStore.updateFirstLastName(text);

      })
    ).subscribe();


  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["login"]);

  }

  doneStepper() {

    //console.log('v is:', this.firstFormGroup.value);

  }

  onChangeFirstLastName($event: any) {

    console.log('event is:', $event);
  }



}
