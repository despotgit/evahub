import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    forwardRef
} from "@angular/core";
import { Router } from "@angular/router";
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    Subscription,
    tap,
    switchMap,
    of,
    fromEvent,
    Subject
} from "rxjs";
import { combineLatestWith, finalize, startWith, withLatestFrom } from "rxjs/operators";
import {
    Form,
    FormControl,
    NG_VALUE_ACCESSOR,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators
} from "@angular/forms";
import { ApplicationStateStoreService } from "../store/ApplicationStateStoreService";
import { doesMaterialFormHaveErrors, getRegisterUrl, PageIndex } from "../common/constants";

import { HttpClient, HttpEventType } from "@angular/common/http";
//import { MatLegacyButton as MatButton } from "@angular/material/legacy-button";
import { MatButton } from "@angular/material/button";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true }
        }
    ]
})
export class RegisterComponent implements OnInit, AfterViewInit {
    registerHttpCall$: Subscription;

    theForm: UntypedFormGroup;

    registerUsername$: Observable<string> = this.store.registerUsername$.pipe(
        tap(newRegisterUsername => {
            this.theForm.get("registerUsernameFormControl").setValue(newRegisterUsername);
        })
    );
    registerPassword$: Observable<string> = this.store.registerPassword$.pipe(
        tap(newRegisterPassword => {
            this.theForm.get("registerPasswordFormControl").setValue(newRegisterPassword);
        })
    );
    registerPasswordConfirmation$: Observable<string> =
        this.store.registerPasswordConfirmation$.pipe(
            tap(newRPC => {
                this.theForm.get("registerPasswordConfirmationFormControl").setValue(newRPC);
            })
        );
    firstLastName$: Observable<string> = this.store.firstLastName$.pipe(
        tap(newName => {
            //console.log("CHECKPOINT 2");
            this.theForm.get("firstLastNameFormControl").setValue(newName);
        })
    );
    email$: Observable<string> = this.store.email$.pipe(
        tap(email => {
            this.theForm.get("emailFormControl").setValue(email);
        })
    );
    isFormValid$: Observable<boolean>;

    @ViewChild("done") done: MatButton;

    isPosted = false;
    isBackendRegistrationSuccessful = false;
    backendRegistrationError = "";

    registrationData: any = {};

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private formBuilder: UntypedFormBuilder,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {
        this.theForm = this.formBuilder.group({
            registerUsernameFormControl: ["", [Validators.required]],
            registerPasswordFormControl: ["", [Validators.required]],
            registerPasswordConfirmationFormControl: ["", [Validators.required]],
            firstLastNameFormControl: new UntypedFormControl(""),
            emailFormControl: ["", [Validators.required, Validators.email]]
        });

        this.isFormValid$ = this.theForm.valueChanges.pipe(
            map((a: any) => {
                let rpfc = a.registerPasswordFormControl;
                let rpcfc = a.registerPasswordConfirmationFormControl;
                if (!this.theForm.invalid && rpfc == rpcfc) {
                    //console.log("returning true");
                    return true;
                } else {
                    //console.log("returning false");
                    return false;
                }
            })
        );

        this.ngOnInit();
    }

    ngOnInit(): void {
        const registerUsernameEvents$: Observable<any> = this.theForm.get(
            "registerUsernameFormControl"
        ).valueChanges;
        const registerPasswordEvents$: Observable<any> = this.theForm.get(
            "registerPasswordFormControl"
        ).valueChanges;
        const registerPasswordConfirmationEvents$: Observable<any> = this.theForm.get(
            "registerPasswordConfirmationFormControl"
        ).valueChanges;
        const firstLastNameEvents$: Observable<any> = this.theForm.get(
            "firstLastNameFormControl"
        ).valueChanges;
        const emailEvents$: Observable<any> = this.theForm.get("emailFormControl").valueChanges;

        combineLatest([
            registerUsernameEvents$,
            registerPasswordEvents$,
            registerPasswordConfirmationEvents$,
            firstLastNameEvents$,
            emailEvents$
        ])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                map(
                    ([
                        registerUsername,
                        registerPassword,
                        registerPasswordConfirmation,
                        firstLastName,
                        email
                    ]) => {
                        this.store.updateRegisterUsername(registerUsername);
                        this.store.updateRegisterPassword(registerPassword);
                        this.store.updateRegisterPasswordConfirmation(registerPasswordConfirmation);
                        this.store.updateRegisterFirstLastName(firstLastName);
                        this.store.updateRegisterEmail(email);

                        this.registrationData.registerUsername = registerUsername;
                        this.registrationData.registerPassword = registerPassword;
                        this.registrationData.registerPasswordConfirmation =
                            registerPasswordConfirmation;
                        this.registrationData.firstLastName = firstLastName;
                        this.registrationData.email = email;

                        //console.log("regData is:", this.registrationData);
                    }
                )
            )
            .subscribe();
        this.store.updateCurrentPageIndex(PageIndex.REGISTER_PAGE);
    }

    ngAfterViewInit(): void {
        this.registerSubmit();
    }

    registerSubmit() {
        let url;

        const clicks$ = fromEvent(this.done._elementRef.nativeElement, "click");

        this.registerHttpCall$ = clicks$
            .pipe(
                switchMap(a => {
                    const formData = new FormData();

                    formData.append("username", this.registrationData.registerUsername);
                    formData.append("password", this.registrationData.registerPassword);
                    formData.append("firstLastName", this.registrationData.firstLastName);
                    formData.append("email", this.registrationData.email);

                    console.log("******** formData is:", formData);

                    url = getRegisterUrl();
                    //console.log("aaaand url is:", url);

                    return this.http.post(url, formData);
                }),
                finalize(() => {
                    //console.log("step 3, in finalize");
                    //this.reset();
                    this.unsubscribeFromRegisterRequest();
                })
            )
            .subscribe((d: any) => {
                console.log(d);
                console.log("in registration subscribe");
                this.isPosted = true;

                if (d.status == "ok") {
                    this.isBackendRegistrationSuccessful = true;
                    this.backendRegistrationError = "";
                } else {
                    this.isBackendRegistrationSuccessful = false;
                    this.backendRegistrationError = d.message;
                }
                // DEV:  for testing purposes, reset page after the API call
                // this.store.resetRegisterPage();
                this.cd.markForCheck();
            });
    }

    cancelRequest() {
        this.unsubscribeFromRegisterRequest();

        this.reset();
    }

    unsubscribeFromRegisterRequest() {
        if (this.registerHttpCall$) {
            this.registerHttpCall$.unsubscribe();
        }
    }

    isRegistrationSuccessful() {
        if (this.isPosted && this.isBackendRegistrationSuccessful) {
            return true;
        } else {
            return false;
        }
    }

    reset() {
        this.registerHttpCall$ = null;
    }

    ngOnDestroy() {
        this.cancelRequest();
    }
}
