import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest, map, Observable, of, tap, withLatestFrom } from "rxjs";
import { PageIndex } from "./common/constants";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption
} from "./services/application-state-store.service";
import { AuthenticationService } from "./services/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
    username$: Observable<string> = this.store.username$;
    isLoggedIn$: Observable<boolean> = this.store.isloggedIn$;
    isSidenavOpened$: Observable<boolean> = this.store.isSidenavOpened$;
    sidenavMenuOptions$: Observable<EvahubSidenavMenuOption[]> = this.store.sidenavMenuOptions$;
    currentPageIndex$: Observable<PageIndex> = this.store.currentPageIndex$;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService
    ) {
        //
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        //this.sidenav.close();
    }

    gotoLogs() {
        this.router.navigate(["/logs"]);
        this.store.updateCurrentPageIndex(PageIndex.LOGS_PAGE);
    }

    gotoReports() {
        this.router.navigate(["/reports"]);
        this.store.updateCurrentPageIndex(PageIndex.REPORTS_PAGE);
    }

    gotoChecks() {
        this.router.navigate(["/checks"]);
        this.store.updateCurrentPageIndex(PageIndex.CHECKS_PAGE);
    }

    gotoHome() {
        this.router.navigate(["/home"]);
        this.store.updateCurrentPageIndex(PageIndex.HOME_PAGE);
    }

    logOut() {
        this.authenticationService.logOut();
    }

    menuItemClicked($event) {
        console.log($event + 100);
        let id$ = of($event);

        this.currentPageIndex$
            .pipe(
                withLatestFrom(id$),
                map(([cpi, id]) => {
                    console.log("and now...");
                    console.log(cpi, id);
                })
            )
            .subscribe();
    }
}
