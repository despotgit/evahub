import { HttpClient } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild
} from "@angular/core";
import { Router } from "@angular/router";

import { map, switchMap, Observable, of, Subscription, tap } from "rxjs";
import { environment } from "src/environments/environment";
import {
    getPageNameFromPageIndex,
    INITIAL_MAIN_MENU_ITEMS,
    EvahubMainMenuItem,
    PageIndex,
    PageIndexDictionary,
    capitalizeWord
} from "./common/constants";
import { Check } from "./models/Check";
import { EvahubDocumentTypeDictionary } from "./models/EvahubDocument";
import { Log } from "./models/Log";
import { Report } from "./models/Report";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption
} from "./services/application-state-store.service";
import { AuthenticationService } from "./services/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
    username$: Observable<string> = this.store.username$;
    isLoggedIn$: Observable<boolean> = this.store.isloggedIn$;
    isSidenavOpened$: Observable<boolean> = this.store.isSidenavOpened$;
    sidenavMenuOptions$: Observable<EvahubSidenavMenuOption[]> = this.store.sidenavMenuOptions$;
    userReports$: Observable<Report[]> = this.store.userReports$;
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    userLogs$: Observable<Log[]> = this.store.userLogs$;
    currentPageIndex$ = this.store.currentPageIndex$.pipe(
        tap(a => {
            const s = getPageNameFromPageIndex(a); // s : singularDocumentTypeName

            const sc = capitalizeWord(s);

            if (PageIndexDictionary[s].isDocumentsPage) {
                this.updateDocumentsSetFromApi(sc);
            }
            this.currentPageIndex = a;
        })
    );
    currentDocumentSet$ = this.currentPageIndex$.pipe(
        switchMap(cpi => {
            switch (cpi) {
                case PageIndex.LOGS_PAGE:
                    return this.userLogs$;

                case PageIndex.REPORTS_PAGE:
                    return this.userReports$;

                case PageIndex.CHECKS_PAGE:
                    return this.userChecks$;

                default:
                    return of([]);
            }
        }),
        map(cds => {
            let d = cds[0];
            if (d !== undefined) {
                //console.log("first's getDocumentId is:", d.getDocumentId());
                this.store.updateCurrentDocumentId(d.getDocumentId());
            }

            return cds;
        })
    );

    currentDocumentId$ = this.store.currentDocumentId$;

    docSelectedSub: Subscription;

    currentPageIndex: number = PageIndex.NONE_PAGE;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";
    httpDocsCall: any;

    // Home, Upload, Logs, Reports, Checks

    mainMenuItems: EvahubMainMenuItem[] = INITIAL_MAIN_MENU_ITEMS;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService,
        private httpClient: HttpClient
    ) {
        //
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    goTo(e) {
        const isDocumentsPage = e.isDocumentsPage;
        const page = e.gotoParam;

        const pageToLower: string = page.toLowerCase();

        let newPageIndex;
        if (isDocumentsPage) {
            this.router.navigate(["/documents/" + pageToLower]);
            newPageIndex = PageIndexDictionary[pageToLower].index;
        } else {
            this.router.navigate(["/" + pageToLower]);
            newPageIndex = PageIndexDictionary[pageToLower].index;
        }

        this.store.updateCurrentPageIndex(newPageIndex);
    }

    logOut() {
        this.authenticationService.logOut();
    }

    menuItemClicked($event) {
        //console.log("in app in menuItemClicked, $event is:", $event);
        this.store.updateCurrentDocumentId($event);
        return;
    }

    updateCurrentPageIndex(cpi: number) {
        this.currentPageIndex = cpi;
        this.store.updateCurrentPageIndex(cpi);
    }

    // docType is document name as string, singular form
    updateDocumentsSetFromApi(docType: string) {
        if (docType == undefined) return;
        //console.log("!!!!!docType is:", docType);
        let docTypeToLower = docType.toLowerCase();
        //console.log("docType is:", docType);
        let username = "test2";

        let url = `${environment.baseApiBackendUrl}/rest/${docTypeToLower}s/get/${username}`;

        this.httpDocsCall = this.httpClient
            .get(url)
            .pipe(
                map(ud => {
                    //console.log("ud is:", ud);
                    //console.log("prop name is:", "user" + docType + "s");
                    let ds = ud["user" + docType + "s"];
                    this.processDocuments(ds, docType);
                    return ud;
                }),
                tap()
            )
            .subscribe();

        //setTimeout(() => this.httpDocsCall.unsubscribe(), 1000);
    }

    // Runs as part of fetching the data from API backend
    processDocuments(ds: any[], dt: string) {
        //console.log("in process ds is:", ds);
        //console.log("in process dt is:", dt);

        const dtToLower = dt.toLowerCase();
        let [menuOptions, docs] = this.transformDbDocuments(ds, dtToLower);
        this.store.updateUserDocuments(dt, docs);
        this.store.updateSidenavMenuOptions(menuOptions);
        this.store.updateSelectedUserDocument(dt, docs[0]);
    }

    // Returns menuOptions[] and EvahubDocuments[]
    transformDbDocuments(ds: any, dtToLower) {
        let docs = [];
        let menuOptions = [];

        ds.map(d => {
            let doc;
            switch (dtToLower) {
                case "log":
                    doc = new Log();
                    //console.log("is a log");
                    break;
                case "report":
                    doc = new Report();
                    //console.log("is a report");
                    break;
                case "check":
                    doc = new Check();
                    //console.log("is a check");
                    break;
            }

            Object.keys(d).forEach(p => {
                doc[p] = d[p];
            });

            doc.documentType = EvahubDocumentTypeDictionary[dtToLower];

            docs.push(doc);

            let mo: EvahubSidenavMenuOption = {
                id: doc.getDocumentId(),
                label: doc.getDocumentName()
            };

            menuOptions.push(mo);
        });

        return [menuOptions, docs];
    }

    ngOnDestroy() {
        this.docSelectedSub.unsubscribe();
    }
}
