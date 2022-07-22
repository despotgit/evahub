import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { PageIndex } from "./common/constants";
import { AuthenticationService } from "./services/authentication.service";
import { HomePageDataStoreService, INITIAL_HOMEPAGE_STATE } from "./services/home-page-data-store.service";
import { SidenavStoreService } from "./services/sidenav-store.service";
import { UserStoreService } from "./services/user-store.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    username$: Observable<string> = this.userStore.username$;
    isLoggedIn$: Observable<boolean> = this.userStore.isloggedIn$;
    opened$: Observable<boolean> = this.sidenavStore.opened$;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";

    menuOptions = [{ id: 1 }, { id: 3 }, { id: 5 }];

    currentPageIndex = PageIndex.NONE_PAGE;

    constructor(
        private router: Router,
        private homePageDataStore: HomePageDataStoreService,
        private userStore: UserStoreService,
        private authenticationService: AuthenticationService,
        private sidenavStore: SidenavStoreService
    ) {
        this.homePageDataStore.setState(INITIAL_HOMEPAGE_STATE);
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
    }
}
