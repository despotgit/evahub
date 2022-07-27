import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable, of, Subscription, withLatestFrom } from "rxjs";
import { PageIndex } from "./common/constants";
import {
    ApplicationStateStoreService,
    Check,
    EvahubSidenavMenuOption,
    Log,
    Report
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
    userReports$: Observable<Report[]> = this.store.userReports$;
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    userLogs$: Observable<Log[]> = this.store.userLogs$;

    docSelectedSub: Subscription;

    currentPageIndex: number;

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
        this.updateCurrentPageIndex(PageIndex.LOGS_PAGE);
    }

    gotoReports() {
        this.router.navigate(["/reports"]);
        this.updateCurrentPageIndex(PageIndex.REPORTS_PAGE);
    }

    gotoChecks() {
        this.router.navigate(["/checks"]);
        this.updateCurrentPageIndex(PageIndex.CHECKS_PAGE);
    }

    gotoHome() {
        this.router.navigate(["/home"]);
        this.updateCurrentPageIndex(PageIndex.HOME_PAGE);
    }

    logOut() {
        this.authenticationService.logOut();
    }

    menuItemClicked($event) {
        let documentId$ = of($event);

        let currentlySelectedUserDocs$: Observable<any[]>;
        switch (this.currentPageIndex) {
            case PageIndex.REPORTS_PAGE:
                currentlySelectedUserDocs$ = this.userReports$;
                break;
            case PageIndex.LOGS_PAGE:
                currentlySelectedUserDocs$ = this.userLogs$;
                break;
            case PageIndex.CHECKS_PAGE:
                currentlySelectedUserDocs$ = this.userChecks$;
                break;
        }

        this.docSelectedSub = this.currentPageIndex$
            .pipe(
                withLatestFrom(documentId$, currentlySelectedUserDocs$),
                map(([cpi, documentId, docs]) => {
                    console.log("and now...");
                    console.log(cpi, documentId);

                    let selectedDoc;
                    switch (cpi) {
                        case PageIndex.REPORTS_PAGE:
                            selectedDoc = docs.filter(d => d.reportId == documentId);
                            this.store.updateSelectedUserReport(selectedDoc[0]);
                            break;
                        case PageIndex.LOGS_PAGE:
                            selectedDoc = docs.filter(d => d.logId == documentId);
                            this.store.updateSelectedUserLog(selectedDoc[0]);
                            break;
                        case PageIndex.CHECKS_PAGE:
                            selectedDoc = docs.filter(d => d.reportId == documentId);
                            this.store.updateSelectedUserCheck(selectedDoc[0]);
                    }
                })
            )
            .subscribe();
    }

    updateCurrentPageIndex(cpi: number) {
        this.currentPageIndex = cpi;
        this.store.updateCurrentPageIndex(cpi);
    }

    ngOnDestroy() {
        this.docSelectedSub.unsubscribe();
    }
}
