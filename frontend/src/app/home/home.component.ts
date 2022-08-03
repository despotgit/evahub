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
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    step1FormGroup: any;
    step2FormGroup: any;

    username$: Observable<string> = this.store.username$;
    firstLastName$: Observable<string> = this.store.firstLastName$.pipe(
        tap(newName => {
            //console.log("CHECKPOINT 2");
            this.step1FormGroup.get("firstLastNameFormControl").setValue(newName);
        })
    );
    address$: Observable<string> = this.store.address$.pipe(
        tap(address => {
            this.step2FormGroup.get("addressFormControl").setValue(address);
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
            addressFormControl: new FormControl("")
        });
    }

    ngOnInit(): void {
        const firstLastNameEvents: Observable<any> = this.step1FormGroup.get(
            "firstLastNameFormControl"
        ).valueChanges;
        const addressEvents: Observable<any> =
            this.step2FormGroup.get("addressFormControl").valueChanges;

        combineLatest([firstLastNameEvents, addressEvents])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                map(([firstLastName, address]) => {
                    this.store.updateFirstLastName(firstLastName);
                    this.store.updateAddress(address);
                })
            )
            .subscribe();
        this.store.updateCurrentPageIndex(PageIndex.HOME_PAGE);
    }

    doneStepper() {
        //console.log('v is:', this.firstFormGroup.value);
    }

    onChangeFirstLastName($event: any) {
        //console.log("event is:", $event);
    }
}
