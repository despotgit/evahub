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
  step2FormGroup: any

  username$: Observable<string> = this.userStore.$username;
  firstLastName$: Observable<string> = this.homePageDataStore.firstLastName$.pipe(
    tap((newName) => {
      this.step1FormGroup.get('firstLastNameFormControl').setValue(newName);
    }
    )
  );
  address$: Observable<string> = this.homePageDataStore.address$.pipe(
    tap((address) => {
      this.step2FormGroup.get('addressFormControl').setValue(address);
    })
  )

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private userStore: UserStoreService,
    private homePageDataStore: HomePageDataStoreService,
    private formBuilder: FormBuilder) {

    this.step1FormGroup = this.formBuilder.group({
      firstLastNameFormControl: new FormControl('')
    });

    this.step2FormGroup = this.formBuilder.group({
      addressFormControl: new FormControl('')
    });

  }

  ngOnInit(): void {
    this.step1FormGroup.get('firstLastNameFormControl').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((text: any) => {
        this.homePageDataStore.updateFirstLastName(text);
      })
    ).subscribe();

    this.step2FormGroup.get('addressFormControl').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((text: any) => {
        this.homePageDataStore.updateAddress(text);
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
