import {
    Component,
    OnInit,
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { PageIndex } from "../common/constants";
import { ApplicationStateStoreService } from "../services/application-state-store.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit, AfterViewChecked {
    loginForm: FormGroup;
    submitted = false;
    loading = false;
    returnUrl: string = "";
    error = "";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private store: ApplicationStateStoreService,
        private cd: ChangeDetectorRef
    ) {
        this.ngOnInit();
    }

    ngOnInit() {
        //console.log("in ngoninit in login component");
        this.loginForm = this.formBuilder.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        });

        this.store.updateCurrentPageIndex(PageIndex.REGISTER_PAGE);
    }

    ngAfterViewChecked() {
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/documents/log";
    }

    get f() {
        return this.loginForm.controls;
    }

    // On submitting the username and password
    onSubmit() {
        this.submitted = true;

        // stop if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        this.authenticationService
            .login(this.f["username"].value, this.f["password"].value)
            .subscribe(data => {
                console.log("data is:", data);
                if (data.authenticated) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    console.log("just before Wrong cred entered");
                    this.error = data.message;
                    console.log("error is:", this.error);
                    this.cd.markForCheck();
                }
                this.loading = false;
                return;
            });

        //loginSubscription.unsubscribe();
    }
}
