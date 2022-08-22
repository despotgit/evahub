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
import { FormBuilder, FormControl } from "@angular/forms";
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

    username$: Observable<string> = this.store.username$;
    firstLastName$: Observable<string> = this.store.firstLastName$.pipe(
        tap(newName => {
            //console.log("CHECKPOINT 2");
            this.step1FormGroup.get("firstLastNameFormControl").setValue(newName);
        })
    );
    email$: Observable<string> = this.store.email$.pipe(
        tap(email => {
            this.step2FormGroup.get("emailFormControl").setValue(email);
        })
    );

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private formBuilder: FormBuilder
    ) {
        this.step1FormGroup = this.formBuilder.group({
            firstLastNameFormControl: new FormControl("")
        });

        this.step2FormGroup = this.formBuilder.group({
            emailFormControl: new FormControl("")
        });

        this.ngOnInit();
    }

    ngOnInit(): void {
        const firstLastNameEvents: Observable<any> = this.step1FormGroup.get(
            "firstLastNameFormControl"
        ).valueChanges;
        const emailEvents: Observable<any> =
            this.step2FormGroup.get("emailFormControl").valueChanges;

        combineLatest([firstLastNameEvents, emailEvents])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                map(([firstLastName, email]) => {
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
