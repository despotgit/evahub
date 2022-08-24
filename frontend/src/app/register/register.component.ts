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
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ApplicationStateStoreService } from "../services/application-state-store.service";
import { PageIndex } from "../common/constants";
import { environment } from "src/environments/environment";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { MatButton } from "@angular/material/button";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, AfterViewInit {
    registerHttpCall$: Subscription;

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

    @ViewChild("done") done: MatButton;

    isPosted = false;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private cd: ChangeDetectorRef
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
        const registerUsernameEvents$: Observable<any> = this.step1FormGroup.get(
            "registerUsernameFormControl"
        ).valueChanges;
        const firstLastNameEvents$: Observable<any> = this.step2FormGroup.get(
            "firstLastNameFormControl"
        ).valueChanges;
        const emailEvents$: Observable<any> =
            this.step3FormGroup.get("emailFormControl").valueChanges;

        combineLatest([registerUsernameEvents$, firstLastNameEvents$, emailEvents$])
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

    ngAfterViewInit(): void {
        this.doneStepper();
    }

    doneStepper() {
        console.log("v1 is:", this.step1FormGroup.value);
        console.log("v2 is:", this.step2FormGroup.value);
        console.log("v3 is:", this.step3FormGroup.value);

        let url;

        const formData = new FormData();

        const clicks$ = fromEvent(this.done._elementRef.nativeElement, "click");

        this.registerHttpCall$ = clicks$
            .pipe(
                withLatestFrom(
                    combineLatest([this.registerUsername$, this.firstLastName$, this.email$])
                ),
                switchMap(([e, data]) => {
                    console.log("data is:", data);
                    console.log("e is:", e);

                    formData["run"] = data[0];
                    formData["fln"] = data[1];
                    formData["email"] = data[2];

                    url = `${environment.baseApiBackendUrl}/register/user`;

                    return this.http.post(url, formData, {
                        reportProgress: true,
                        observe: "events"
                    });
                }),
                finalize(() => {
                    console.log("step 3, in finalize");
                    this.reset();
                })
            )
            .subscribe(event => {
                console.log(event);
                console.log("in registration subscribe");
                this.isPosted = true;
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

    ngOnDestroy() {
        this.cancelRequest();
    }
}
