import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    Subscription,
    tap,
    switchMap
} from "rxjs";
import { finalize } from "rxjs/operators";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ApplicationStateStoreService } from "../services/application-state-store.service";
import { PageIndex } from "../common/constants";
import { environment } from "src/environments/environment";
import { HttpClient, HttpEventType } from "@angular/common/http";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
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

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private formBuilder: FormBuilder,
        private http: HttpClient
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
        console.log("v1 is:", this.step1FormGroup.value);
        console.log("v2 is:", this.step2FormGroup.value);
        console.log("v3 is:", this.step3FormGroup.value);

        let url;

        const formData = new FormData();

        this.registerHttpCall$ = combineLatest(
            this.registerUsername$,
            this.firstLastName$,
            this.email$
        )
            .pipe(
                switchMap(([un, fln, email]) => {
                    console.log("un is:", un);
                    console.log("fln is:", fln);
                    console.log("email", email);

                    formData.append("username", un);
                    formData.append("firstLastName", fln);
                    formData.append("email", email);

                    url = `${environment.baseApiBackendUrl}/register`;

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
            });
    }

    cancelUpload() {
        if (this.registerHttpCall$) {
            this.registerHttpCall$.unsubscribe();
        }
        this.reset();
    }

    reset() {
        this.registerHttpCall$ = null;
    }

    ngOnDestroy() {
        this.cancelUpload();
    }
}
