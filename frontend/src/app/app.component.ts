import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "./services/authentication.service";
import { HomePageDataStoreService } from "./services/home-page-data-store.service";
import { Report, UserReportsStoreService } from "./services/user-reports.service";
import { UserStoreService } from "./services/user-store.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    username$: Observable<string> = this.userStore.$username;

    showFiller = false;

    @ViewChild("sidenav") sidenav;

    events: string[] = [];
    opened: boolean;

    title = "EVAHUB";

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private homePageDataStore: HomePageDataStoreService,
        private userStore: UserStoreService,
        private authenticationService: AuthenticationService
    ) {
        this.homePageDataStore.setState({
            firstLastName: "",
            address: ""
        });
    }

    ngOnInit(): void {}

    gotoReports() {
        this.router.navigate(["/reports"]);
    }

    gotoHome() {
        this.router.navigate(["/home"]);
    }

    logOut() {
        this.authenticationService.logOut();
        this.router.navigate(["login"]);
    }
}
