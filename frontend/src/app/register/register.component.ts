import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    mergeMap,
    Observable,
    tap
} from "rxjs";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ApplicationStateStoreService } from "../services/application-state-store.service";
import { PageIndex } from "../common/constants";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
    step1FormGroup: any;
    step2FormGroup: any;
    step3FormGroup: any;

    registerUsername$: Observable<string> = this.store.registerUsername$.pipe(
        tap(newRegisterUsername => {
            this.step1FormGroup.get("registerUsernameFormControl").setValue(newRegisterUsername);
        })
    );
    firstLastName$: Observable<string> = this.store.firstLastName$.pipe(
        tap(newName => {
            //console.log("CHECKPOINT 2");
            this.step2FormGroup.get("firstLastNameFormControl").setValue(newName);
        })
    );
    email$: Observable<string> = this.store.email$.pipe(
        tap(email => {
            this.step3FormGroup.get("emailFormControl").setValue(email);
        })
    );

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private formBuilder: FormBuilder
    ) {
        this.step1FormGroup = this.formBuilder.group({
            registerUsernameFormControl: new FormControl("")
        });

        this.step2FormGroup = this.formBuilder.group({
            firstLastNameFormControl: new FormControl("")
        });

        this.step3FormGroup = this.formBuilder.group({
            emailFormControl: ["", [Validators.required, Validators.email]]
        });

        this.ngOnInit();
    }

    ngOnInit(): void {
        const registerUsernameEvents: Observable<any> = this.step1FormGroup.get(
            "registerUsernameFormControl"
        ).valueChanges;
        const firstLastNameEvents: Observable<any> = this.step2FormGroup.get(
            "firstLastNameFormControl"
        ).valueChanges;
        const emailEvents: Observable<any> =
            this.step3FormGroup.get("emailFormControl").valueChanges;

        combineLatest([registerUsernameEvents, firstLastNameEvents, emailEvents])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                map(([registerUsername, firstLastName, email]) => {
                    this.store.updateRegisterUsername(registerUsername);
                    this.store.updateFirstLastName(firstLastName);
                    this.store.updateEmail(email);
                })
            )
            .subscribe();
        this.store.updateCurrentPageIndex(PageIndex.REGISTER_PAGE);
    }

    doneStepper() {
        //console.log('v is:', this.firstFormGroup.value);
    }

    onChangeFirstLastName($event: any) {
        //console.log("event is:", $event);
    }
}
