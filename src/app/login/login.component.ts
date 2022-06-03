import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, AfterViewChecked {
    loginForm: FormGroup;
    submitted = false;
    loading = false;
    returnUrl: string = '';
    error = "";

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) {
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

        // logout the person when he opens the app for the first time
        this.authenticationService.logout();
    }

    ngAfterViewChecked() {
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    }

    // Convenience getter for easy access to form fields
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
            .subscribe(
                data => {
                    //console.log("in loginComponent, this.returnUrl is:");
                    //console.log(this.returnUrl);

                    //console.log("in subscribe, data is:");
                    //console.log(data);

                    if (data.authenticated) {
                        //localStorage.setItem("currentUser", data);
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.error = "Wrong credentials entered.";
                    }
                    this.loading = false;
                },
                error => {
                    //console.log("in login component error branch, error is:");
                    //console.log(error);

                    this.error = "Problem during authentication.";
                    this.loading = false;
                }
            );
    }
}
