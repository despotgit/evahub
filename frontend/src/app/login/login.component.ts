import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { PageIndex } from "../common/constants";
import { ApplicationStateStoreService } from "../services/application-state-store.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, AfterViewChecked {
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
        private store: ApplicationStateStoreService
    ) {
        this.loginForm = this.formBuilder.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        });
    }

    ngOnInit() {
        //console.log("in ngoninit in login component");
        this.loginForm = this.formBuilder.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        });

        this.store.updateCurrentPageIndex(PageIndex.LOGIN_PAGE);
    }

    ngAfterViewChecked() {
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/home";
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
            .pipe(first())
            .subscribe(data => {
                if (data.authenticated) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    this.error = "Wrong credentials entered.";
                }
                this.loading = false;
            });
    }
}
