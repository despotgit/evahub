import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { PageIndex } from "./common/constants";
import { AuthenticationService } from "./services/authentication.service";
import { HomePageDataStoreService } from "./services/home-page-data-store.service";
import { UserStoreService } from "./services/user-store.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    username$: Observable<string> = this.userStore.username$;
    isLoggedIn$: Observable<boolean> = this.userStore.isloggedIn$;

    @ViewChild("sidenav") sidenav;

    opened: boolean = false;

    title = "EVAHUB";

    menuOptions = [{ id: 1 }, { id: 3 }, { id: 5 }];

    currentPageIndex = PageIndex.NONE_PAGE;

    constructor(
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

    gotoLogs() {
        this.router.navigate(["/logs"]);
    }

    gotoReports() {
        this.router.navigate(["/reports"]);
    }

    gotoChecks() {
        this.router.navigate(["/checks"]);
    }

    gotoHome() {
        this.router.navigate(["/home"]);
    }

    logOut() {
        this.authenticationService.logOut();
        this.router.navigate(["login"]);
        this.opened = false;
    }
}
