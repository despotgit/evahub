import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild
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
import { finalize, startWith, withLatestFrom } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApplicationStateStoreService } from "../services/application-state-store.service";
import { getRegisterUrl, PageIndex } from "../common/constants";
import { environment } from "src/environments/environment";
import { HttpClient, HttpEventType } from "@angular/common/http";
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

    forma: any;

    registerUsername$: Observable<string> = this.store.registerUsername$.pipe(
        tap(newRegisterUsername => {
            this.forma.get("registerUsernameFormControl").setValue(newRegisterUsername);
        })
    );
    registerPassword$: Observable<string> = this.store.registerPassword$.pipe(
        tap(newRegisterPassword => {
            this.forma.get("registerPasswordFormControl").setValue(newRegisterPassword);
        })
    );
    registerPasswordConfirmation$: Observable<string> =
        this.store.registerPasswordConfirmation$.pipe(
            tap(newRPC => {
                this.forma.get("registerPasswordConfirmationFormControl").setValue(newRPC);
            })
        );
    firstLastName$: Observable<string> = this.store.firstLastName$.pipe(
        tap(newName => {
            //console.log("CHECKPOINT 2");
            this.forma.get("firstLastNameFormControl").setValue(newName);
        })
    );
    email$: Observable<string> = this.store.email$.pipe(
        tap(email => {
            this.forma.get("emailFormControl").setValue(email);
        })
    );

    @ViewChild("done") done: MatButton;

    isPosted = false;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {
        this.forma = this.formBuilder.group({
            registerUsernameFormControl: ["", [Validators.required]],
            registerPasswordFormControl: ["", [Validators.required]],
            registerPasswordConfirmationFormControl: ["", [Validators.required]],
            firstLastNameFormControl: new FormControl(""),
            emailFormControl: ["", [Validators.required, Validators.email]]
        });

        this.ngOnInit();
    }

    ngOnInit(): void {
        const registerUsernameEvents$: Observable<any> = this.forma.get(
            "registerUsernameFormControl"
        ).valueChanges;
        const registerPasswordEvents$: Observable<any> = this.forma.get(
            "registerPasswordFormControl"
        ).valueChanges;
        const registerPasswordConfirmationEvents$: Observable<any> = this.forma.get(
            "registerPasswordConfirmationFormControl"
        ).valueChanges;
        const firstLastNameEvents$: Observable<any> = this.forma.get(
            "firstLastNameFormControl"
        ).valueChanges;
        const emailEvents$: Observable<any> = this.forma.get("emailFormControl").valueChanges;

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
                    }
                )
            )
            .subscribe();
        this.store.updateCurrentPageIndex(PageIndex.REGISTER_PAGE);
    }

    ngAfterViewInit(): void {
        this.finish();
    }

    finish() {
        console.log("v1 is:", this.forma.value);
        console.log("v1 is:", this.forma.value);
        console.log("v2 is:", this.forma.value);
        console.log("v3 is:", this.forma.value);

        let url;

        const formData = new FormData();

        const clicks$ = fromEvent(this.done._elementRef.nativeElement, "click");

        this.registerHttpCall$ = clicks$
            .pipe(
                withLatestFrom(
                    combineLatest([
                        this.registerUsername$,
                        this.registerPassword$,
                        this.registerPasswordConfirmation$,
                        this.firstLastName$,
                        this.email$
                    ])
                ),
                switchMap(([e, data]) => {
                    //console.log("data is:", data);
                    //console.log("e is:", e);

                    const formData = new FormData();

                    formData.append("username", data[0]);
                    formData.append("password", data[1]);
                    formData.append("name", data[2]);
                    formData.append("email", data[3]);

                    //console.log("formData is: ", formData);

                    url = getRegisterUrl();
                    //console.log("aaaand url is:", url);

                    return this.http.post(url, formData);
                }),
                finalize(() => {
                    //console.log("step 3, in finalize");
                    this.reset();
                })
            )
            .subscribe(event => {
                console.log(event);
                console.log("in registration subscribe");
                this.isPosted = true;
                this.store.resetRegisterPage();
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

    reset() {
        this.registerHttpCall$ = null;
    }

    displ() {
        console.log(this.forma.controls["registerPasswordFormControl"]);
    }

    ngOnDestroy() {
        this.cancelRequest();
    }
}
